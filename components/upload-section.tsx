"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, ImageIcon, Sparkles, Loader2, MessageSquare, Mic, Wand2, X, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { apiClient, AnalysisResult } from "@/lib/api"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface UploadSectionProps {
  onAnalysisStart?: () => void
  onAnalysisComplete?: (data: AnalysisResult) => void
  isAnalyzing?: boolean
}

interface UploadedFile {
  id: string
  file: File
  preview?: string
}

// Sortable file item component
function SortableFileItem({ file, index, onRemove, isAnalyzing }: {
  file: UploadedFile
  index: number
  onRemove: (id: string) => void
  isAnalyzing: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/40"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-move"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 flex items-center gap-3">
        {file.preview && (
          <img
            src={file.preview}
            alt="Preview"
            className="w-12 h-12 object-cover rounded border"
          />
        )}
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-foreground">
            {file.file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {Math.round(file.file.size / 1024)} KB • Порядок: {index + 1}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(file.id)}
        disabled={isAnalyzing}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}

export function UploadSection({ onAnalysisStart, onAnalysisComplete, isAnalyzing = false }: UploadSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [textInput, setTextInput] = useState("")
  const [additionalPrompt, setAdditionalPrompt] = useState("")
  const [activeTab, setActiveTab] = useState("file")
  const [error, setError] = useState("")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith("image/"))
    
    if (imageFiles.length > 0) {
      addFiles(imageFiles)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith("image/"))
      addFiles(imageFiles)
    }
  }, [])

  const addFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined
    }))

    setUploadedFiles(prev => {
      const combined = [...prev, ...newFiles]
      // Limit to 4 files
      return combined.slice(0, 4)
    })
  }

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setUploadedFiles((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over?.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleAnalyze = async () => {
    setError("")
    
    // Call onAnalysisStart immediately when button is clicked
    if (onAnalysisStart) onAnalysisStart()
    
    // Get selected preset and temperature from localStorage if available
    const presetId = localStorage.getItem('selectedPresetId') || undefined
    const temperatureStr = localStorage.getItem('analysisTemperature')
    const temperature = temperatureStr ? parseFloat(temperatureStr) : undefined
    
    console.log(`Анализ: получены настройки из localStorage - presetId: ${presetId}, temperature: ${temperature}`)
    
    if (activeTab === "file" && uploadedFiles.length > 0) {
      await analyzeFiles(uploadedFiles, presetId, temperature)
    } else if (activeTab === "text" && textInput.trim()) {
      await analyzeText(textInput, presetId, temperature)
    } else if (activeTab === "audio" && uploadedFiles.length > 0) {
      await analyzeAudio(uploadedFiles[0], presetId, temperature)
    }
  }

  const analyzeText = async (text: string, presetId?: string, temperature?: number) => {
    try {
      console.log("Отправка текста на анализ...")
      console.log("Используемый пресет:", presetId)
      console.log("Используемая температура:", temperature)
      const result = await apiClient.analyzeText(text, additionalPrompt, presetId, temperature)
      console.log("Получен результат анализа текста:", result)
      
      if (onAnalysisComplete && result) {
        console.log("Вызов onAnalysisComplete с результатом анализа")
        // Проверка структуры ответа, возможно результат сразу в корне ответа
        if (result && typeof result === 'object' && 'summary' in result && 'emotionTimeline' in result && 'aiJudgeScore' in result) {
          onAnalysisComplete(result as AnalysisResult)
        } else if (result && typeof result === 'object' && 'result' in result && typeof result.result === 'object') {
          onAnalysisComplete(result.result as AnalysisResult)
        } else {
          console.error("Неожиданная структура ответа:", result)
          setError("Получен неверный формат ответа от сервера")
        }
      } else {
        console.error("onAnalysisComplete не определен или result пуст", { onAnalysisComplete: !!onAnalysisComplete, result })
      }
    } catch (err) {
      console.error("Ошибка при анализе текста:", err)
      setError("Ошибка при анализе текста. Попробуйте еще раз.")
    }
  }

  const analyzeFiles = async (files: UploadedFile[], presetId?: string, temperature?: number) => {
    try {
      console.log("Отправка файлов на анализ...")
      console.log("Используемый пресет:", presetId)
      console.log("Используемая температура:", temperature)
      const result = await apiClient.analyzeMultipleFiles(files.map(f => f.file), presetId, temperature)
      console.log("Получен результат анализа файлов:", result)
      
      if (onAnalysisComplete && result) {
        console.log("Вызов onAnalysisComplete с результатом анализа файлов")
        // Проверка структуры ответа, возможно результат сразу в корне ответа
        if (result && typeof result === 'object' && 'summary' in result && 'emotionTimeline' in result && 'aiJudgeScore' in result) {
          onAnalysisComplete(result as AnalysisResult)
        } else if (result && typeof result === 'object' && 'result' in result && typeof result.result === 'object') {
          onAnalysisComplete(result.result as AnalysisResult)
        } else {
          console.error("Неожиданная структура ответа:", result)
          setError("Получен неверный формат ответа от сервера")
        }
      } else {
        console.error("onAnalysisComplete не определен или result пуст", { onAnalysisComplete: !!onAnalysisComplete, result })
      }
    } catch (err: any) {
      console.error("Files analysis error:", err)
      
      // Provide more specific error messages
      if (err.message?.includes("Не удалось извлечь текст")) {
        setError("Не удалось распознать текст на изображениях. Убедитесь, что изображения четкие и содержат читаемый текст.")
      } else if (err.message?.includes("Неподдерживаемый тип файла")) {
        setError("Неподдерживаемый тип файла. Поддерживаются: изображения (jpg, png, gif, bmp), аудио (mp3, wav, m4a, ogg), текст (txt, md)")
      } else if (err.message?.includes("PDF файлы пока не поддерживаются")) {
        setError("PDF файлы пока не поддерживаются. Пожалуйста, конвертируйте в изображение или сохраните как текст.")
      } else {
        setError("Ошибка при анализе файлов. Попробуйте еще раз или используйте другие файлы.")
      }
    }
  }

  const analyzeAudio = async (file: UploadedFile, presetId?: string, temperature?: number) => {
    try {
      console.log("Отправка аудио на анализ...")
      console.log("Используемый пресет:", presetId)
      console.log("Используемая температура:", temperature)
      // For now, treat audio files as regular files
      const result = await apiClient.analyzeFile(file.file, additionalPrompt, presetId, temperature)
      console.log("Получен результат анализа аудио:", result)
      
      if (onAnalysisComplete && result) {
        console.log("Вызов onAnalysisComplete с результатом анализа аудио")
        // Проверка структуры ответа, возможно результат сразу в корне ответа
        if (result && typeof result === 'object' && 'summary' in result && 'emotionTimeline' in result && 'aiJudgeScore' in result) {
          onAnalysisComplete(result as AnalysisResult)
        } else if (result && typeof result === 'object' && 'result' in result && typeof result.result === 'object') {
          onAnalysisComplete(result.result as AnalysisResult)
        } else {
          console.error("Неожиданная структура ответа:", result)
          setError("Получен неверный формат ответа от сервера")
        }
      } else {
        console.error("onAnalysisComplete не определен или result пуст", { onAnalysisComplete: !!onAnalysisComplete, result })
      }
    } catch (err) {
      console.error("Ошибка при анализе аудио:", err)
      setError("Ошибка при анализе аудио. Попробуйте еще раз.")
    }
  }

  const canAnalyze = () => {
    if (activeTab === "file") return uploadedFiles.length > 0
    if (activeTab === "text") return textInput.trim()
    if (activeTab === "audio") return uploadedFiles.length > 0 && uploadedFiles[0].file.type.startsWith("audio/")
    return false
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="file" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Файлы
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Текст
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Аудио
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <Card
            className={cn(
              "border-2 border-dashed transition-all duration-300 bg-card/50 backdrop-blur",
              isDragOver
                ? "border-neon-purple/60 bg-neon-purple/10 glow-purple"
                : "border-border/40 hover:border-neon-blue/40",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
              {uploadedFiles.length > 0 ? (
                <div className="space-y-4 w-full">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Загружено файлов: {uploadedFiles.length}/4
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Перетащите файлы для изменения порядка
                    </p>
                  </div>
                  
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={uploadedFiles && uploadedFiles.length > 0 ? uploadedFiles.map(f => f.id) : []}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {uploadedFiles && uploadedFiles.length > 0 ? (
                          uploadedFiles.map((file, index) => (
                            <SortableFileItem
                              key={file.id}
                              file={file}
                              index={index}
                              onRemove={removeFile}
                              isAnalyzing={isAnalyzing}
                            />
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground py-4">
                            Файлы не загружены
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </DndContext>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        uploadedFiles.forEach(f => {
                          if (f.preview) URL.revokeObjectURL(f.preview)
                        })
                        setUploadedFiles([])
                      }}
                      disabled={isAnalyzing}
                      className="border-neon-blue/20 hover:bg-neon-blue/10 disabled:opacity-50"
                    >
                      Очистить все
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={isAnalyzing || uploadedFiles.length >= 4}
                      className="border-neon-blue/20 hover:bg-neon-blue/10 disabled:opacity-50"
                    >
                      Добавить еще
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 border border-neon-purple/20 mx-auto">
                    <Upload className="w-8 h-8 text-neon-purple" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Загрузите файлы разговора</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Перетащите файлы сюда или нажмите для выбора (до 4 изображений)
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      💡 <strong>Совет:</strong> Для длинных чатов загрузите несколько скриншотов по порядку. 
                      Система объединит их в один разговор для анализа.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-muted rounded">PNG</span>
                      <span className="px-2 py-1 bg-muted rounded">JPG</span>
                      <span className="px-2 py-1 bg-muted rounded">GIF</span>
                      <span className="px-2 py-1 bg-muted rounded">BMP</span>
                      <span className="px-2 py-1 bg-muted rounded">WEBP</span>
                    </div>
                  </div>
                  <div>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.gif,.bmp,.webp"
                      multiple
                      onChange={handleFileSelect}
                    />
                    <label htmlFor="file-upload">
                      <Button
                        variant="outline"
                        className="border-neon-blue/40 text-neon-blue hover:bg-neon-blue/10 cursor-pointer bg-transparent"
                        asChild
                      >
                        <span>Выбрать файлы</span>
                      </Button>
                    </label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 border border-neon-purple/20 mx-auto">
                  <MessageSquare className="w-8 h-8 text-neon-purple" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Введите текст разговора</h3>
                <p className="text-sm text-muted-foreground">Вставьте или введите текст диалога для анализа</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="text-input">Текст разговора</Label>
                <Textarea
                  id="text-input"
                  placeholder="Введите или вставьте текст разговора здесь..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[200px] resize-none border-neon-blue/20 focus:border-neon-purple/40"
                  disabled={isAnalyzing}
                />
                <p className="text-xs text-muted-foreground">Символов: {textInput.length}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio">
          <Card
            className={cn(
              "border-2 border-dashed transition-all duration-300 bg-card/50 backdrop-blur",
              isDragOver
                ? "border-neon-purple/60 bg-neon-purple/10 glow-purple"
                : "border-border/40 hover:border-neon-blue/40",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
              {uploadedFiles.length > 0 && uploadedFiles[0].file.type.startsWith("audio/") ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue mx-auto">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Аудио загружено</h3>
                    <p className="text-sm text-muted-foreground">
                      {uploadedFiles[0].file.name} ({Math.round(uploadedFiles[0].file.size / 1024)} KB)
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      uploadedFiles.forEach(f => {
                        if (f.preview) URL.revokeObjectURL(f.preview)
                      })
                      setUploadedFiles([])
                    }}
                    disabled={isAnalyzing}
                    className="border-neon-blue/20 hover:bg-neon-blue/10 disabled:opacity-50"
                  >
                    Выбрать другой файл
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 border border-neon-purple/20 mx-auto">
                    <Mic className="w-8 h-8 text-neon-purple" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Загрузите аудио разговора</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Перетащите аудиофайл сюда или нажмите для выбора
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-muted rounded">MP3</span>
                      <span className="px-2 py-1 bg-muted rounded">WAV</span>
                      <span className="px-2 py-1 bg-muted rounded">M4A</span>
                      <span className="px-2 py-1 bg-muted rounded">OGG</span>
                    </div>
                  </div>
                  <div>
                    <input
                      type="file"
                      id="audio-upload"
                      className="hidden"
                      accept=".mp3,.wav,.m4a,.ogg,.aac"
                      onChange={handleFileSelect}
                    />
                    <label htmlFor="audio-upload">
                      <Button
                        variant="outline"
                        className="border-neon-blue/40 text-neon-blue hover:bg-neon-blue/10 cursor-pointer bg-transparent"
                        asChild
                      >
                        <span>Выбрать аудио</span>
                      </Button>
                    </label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-card/50 backdrop-blur">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="w-5 h-5 text-neon-purple" />
            <Label htmlFor="additional-prompt" className="text-base font-medium">
              Дополнительный промпт (необязательно)
            </Label>
          </div>
          <Input
            id="additional-prompt"
            placeholder="Добавьте специальные инструкции для анализа..."
            value={additionalPrompt}
            onChange={(e) => setAdditionalPrompt(e.target.value)}
            className="border-neon-blue/20 focus:border-neon-purple/40"
            disabled={isAnalyzing}
          />
          <p className="text-xs text-muted-foreground">
            Например: "Обратите внимание на сарказм" или "Анализируйте только эмоциональный тон"
          </p>
        </CardContent>
      </Card>

      {canAnalyze() && (
        <div className="flex justify-center">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            size="lg"
            className="bg-gradient-to-r from-neon-purple to-neon-blue glow-purple hover:glow-blue transition-all duration-300 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Анализируем...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Анализировать
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}