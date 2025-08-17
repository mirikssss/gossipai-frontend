"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PresetCard } from "@/components/preset-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api"
import { motion } from "framer-motion"
// import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface Preset {
  id: string
  name: string
  description: string
  color: string
  icon: string
  target_audience?: string
  report_style?: string[]
  focus_analysis?: string[]
  temperature?: number
  custom_cards?: Array<{
    id: string
    name: string
    icon: string
    description: string
  }>
}

export default function PresetsPage() {
  const [temperature, setTemperature] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('analysisTemperature')
      return saved ? [parseFloat(saved)] : [0.7]
    }
    return [0.7]
  })
  const [selectedPreset, setSelectedPreset] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedPresetId') || null
    }
    return null
  })
  const [presets, setPresets] = useState<Preset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  // const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const loadPresets = async () => {
      try {
        setIsLoading(true)
        const presetsData = await apiClient.getPresets()
        if (presetsData && Array.isArray(presetsData)) {
          setPresets(presetsData)
          
          // Get the user's previous preset selection from localStorage if available
          const savedPresetId = localStorage.getItem('selectedPresetId')
          if (savedPresetId && presetsData.some(p => p.id === savedPresetId)) {
            setSelectedPreset(savedPresetId)
            
            // Set the temperature based on the selected preset
            const preset = presetsData.find(p => p.id === savedPresetId)
            if (preset && preset.temperature) {
              setTemperature([preset.temperature])
            }
          } else if (presetsData.length > 0) {
            // Set default preset if none is selected
            setSelectedPreset(presetsData[0].id)
            if (presetsData[0].temperature) {
              setTemperature([presetsData[0].temperature])
            }
          }
        } else {
          console.error("Failed to load presets")
        }
      } catch (error) {
        console.error("Error loading presets:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadPresets()
  }, [])
  
  const handleSelectPreset = (presetId: string, presetTemperature: number) => {
    console.log(`Выбран пресет: ${presetId} с температурой: ${presetTemperature}`)
    setSelectedPreset(presetId)
    setTemperature([presetTemperature])
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedPresetId', presetId)
      localStorage.setItem('analysisTemperature', presetTemperature.toString())
      console.log(`Сохранено в localStorage: presetId=${presetId}, temperature=${presetTemperature}`)
    }
  }
  
  const handleTemperatureChange = (value: number[]) => {
    setTemperature(value)
    // Save temperature setting to localStorage
    localStorage.setItem('analysisTemperature', value[0].toString())
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка пресетов...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (presets.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Не удалось загрузить пресеты</p>
            <Button onClick={() => window.location.reload()}>
              Попробовать снова
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Пресеты анализа</h1>
          <p className="text-muted-foreground">
            Выберите стиль анализа и настройте параметры для получения оптимальных результатов
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {presets.map((preset, index) => (
            <motion.div
              key={preset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <PresetCard
                preset={preset}
                isSelected={selectedPreset === preset.id}
                onSelect={() => handleSelectPreset(preset.id, preset.temperature || 0.7)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-card/50 backdrop-blur border-neon-purple/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⚙️</span>
                <span>Настройки анализа</span>
              </CardTitle>
              <CardDescription>Настройте параметры для более точного анализа</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="temperature" className="text-sm font-medium">
                    Температура ответа:
                  </Label>
                  <span className="bg-muted/40 px-2 py-0.5 rounded text-sm font-medium">
                    {temperature[0]}
                  </span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onValueChange={handleTemperatureChange}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Низкие значения дают более консервативные результаты, высокие - более креативные
                </p>
              </div>
              
              {/* Current preset details section */}
              {selectedPreset && (
                <div className="pt-4 border-t border-border/40 space-y-3">
                  <h3 className="text-sm font-semibold">Детали выбранного пресета</h3>
                  {presets.find(p => p.id === selectedPreset)?.target_audience && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">Целевая аудитория:</h4>
                      <p className="text-sm">{presets.find(p => p.id === selectedPreset)?.target_audience}</p>
                    </div>
                  )}
                  
                  {presets.find(p => p.id === selectedPreset)?.report_style && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">Стиль отчета:</h4>
                      <ul className="text-sm list-disc list-inside pl-2 space-y-1">
                        {presets.find(p => p.id === selectedPreset)?.report_style?.map((style, idx) => (
                          <li key={idx}>{style}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {presets.find(p => p.id === selectedPreset)?.focus_analysis && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">Фокус анализа:</h4>
                      <ul className="text-sm list-disc list-inside pl-2 space-y-1">
                        {presets.find(p => p.id === selectedPreset)?.focus_analysis?.map((focus, idx) => (
                          <li key={idx}>{focus}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}