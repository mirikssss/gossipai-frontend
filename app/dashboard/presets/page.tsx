"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { PresetCard } from "@/components/preset-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { motion } from "framer-motion"

const presets = [
  {
    id: "formal",
    name: "Формальный",
    description: "Анализ деловой переписки и официальных разговоров",
    color: "neon-blue",
    icon: "💼",
  },
  {
    id: "friendly",
    name: "Дружеский",
    description: "Анализ неформального общения и дружеских бесед",
    color: "neon-turquoise",
    icon: "😊",
  },
  {
    id: "deep",
    name: "Глубокий психо",
    description: "Детальный психологический анализ с глубокими инсайтами",
    color: "neon-purple",
    icon: "🧠",
  },
  {
    id: "business",
    name: "Бизнес",
    description: "Анализ переговоров и бизнес-коммуникаций",
    color: "neon-blue",
    icon: "📈",
  },
]

export default function PresetsPage() {
  const [temperature, setTemperature] = useState([0.7])
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

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
                onSelect={() => setSelectedPreset(preset.id)}
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
                <Label htmlFor="temperature" className="text-sm font-medium">
                  Температура ответа: {temperature[0]}
                </Label>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onValueChange={setTemperature}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Низкие значения дают более консервативные результаты, высокие - более креативные
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
