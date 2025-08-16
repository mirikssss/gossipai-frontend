"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, ImageIcon, Sparkles, Loader2, MessageSquare, Mic, Wand2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadSectionProps {
  onAnalysisStart?: () => void
  isAnalyzing?: boolean
}

export function UploadSection({ onAnalysisStart, isAnalyzing = false }: UploadSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [textInput, setTextInput] = useState("")
  const [additionalPrompt, setAdditionalPrompt] = useState("")
  const [activeTab, setActiveTab] = useState("file")

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
    if (files.length > 0) {
      setUploadedFile(files[0])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setUploadedFile(files[0])
    }
  }, [])

  const handleAnalyze = () => {
    const hasContent = uploadedFile || textInput.trim()
    if (hasContent && onAnalysisStart) {
      onAnalysisStart()
    }
  }

  const canAnalyze = () => {
    if (activeTab === "file") return uploadedFile
    if (activeTab === "text") return textInput.trim()
    return false
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="file" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Файл
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
              {uploadedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue mx-auto">
                    {uploadedFile.type.startsWith("image/") ? (
                      <ImageIcon className="w-8 h-8 text-white" />
                    ) : uploadedFile.type.startsWith("audio/") ? (
                      <Mic className="w-8 h-8 text-white" />
                    ) : (
                      <FileText className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Файл загружен</h3>
                    <p className="text-sm text-muted-foreground">
                      {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setUploadedFile(null)}
                    disabled={isAnalyzing}
                    className="border-neon-blue/20 hover:bg-neon-blue/10 disabled:opacity-50"
                  >
                    Выбрать другой файл
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 border border-neon-purple/20 mx-auto">
                    <Upload className="w-8 h-8 text-neon-purple" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Загрузите файл разговора</h3>
                    <p className="text-sm text-muted-foreground mb-4">Перетащите файл сюда или нажмите для выбора</p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-muted rounded">TXT</span>
                      <span className="px-2 py-1 bg-muted rounded">PNG</span>
                      <span className="px-2 py-1 bg-muted rounded">JPG</span>
                      <span className="px-2 py-1 bg-muted rounded">PDF</span>
                    </div>
                  </div>
                  <div>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".txt,.png,.jpg,.jpeg,.pdf"
                      onChange={handleFileSelect}
                    />
                    <label htmlFor="file-upload">
                      <Button
                        variant="outline"
                        className="border-neon-blue/40 text-neon-blue hover:bg-neon-blue/10 cursor-pointer bg-transparent"
                        asChild
                      >
                        <span>Выбрать файл</span>
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
              {uploadedFile && uploadedFile.type.startsWith("audio/") ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue mx-auto">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Аудио загружено</h3>
                    <p className="text-sm text-muted-foreground">
                      {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setUploadedFile(null)}
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
