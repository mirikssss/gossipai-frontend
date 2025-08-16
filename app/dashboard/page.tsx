"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UploadSection } from "@/components/upload-section"
import { EmptyState } from "@/components/empty-state"
import { AnalysisResults } from "@/components/analysis-results"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const [analysisData, setAnalysisData] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data)
    setIsAnalyzing(false)
  }

  const handleAnalysisStart = () => {
    setIsAnalyzing(true)
    // Simulate analysis delay
    setTimeout(() => {
      // Mock analysis data
      const mockData = {
        summary: {
          overview:
            "Разговор между двумя коллегами о рабочем проекте. Общий тон профессиональный, но с элементами напряжения.",
          participants: 2,
          messageCount: 15,
          duration: "~5 минут",
          mainTopics: ["Рабочий проект", "Дедлайны", "Ответственность"],
        },
        emotionTimeline: {
          emotions: [
            { time: "00:00", emotion: "Нейтральность", intensity: 60, color: "#64748b" },
            { time: "01:30", emotion: "Беспокойство", intensity: 75, color: "#f59e0b" },
            { time: "02:45", emotion: "Раздражение", intensity: 85, color: "#ef4444" },
            { time: "03:20", emotion: "Понимание", intensity: 70, color: "#10b981" },
            { time: "04:50", emotion: "Облегчение", intensity: 80, color: "#06b6d4" },
          ],
          dominantEmotion: "Беспокойство",
          emotionalShifts: 4,
        },
        aiJudgeScore: {
          overallScore: 72,
          breakdown: {
            clarity: 85,
            empathy: 60,
            professionalism: 80,
            resolution: 65,
          },
          verdict: "Хорошее",
          recommendation:
            "Разговор был продуктивным, но стоит работать над эмпатией и более четким выражением потребностей.",
        },
        subtleties: [
          {
            type: "Скрытое недовольство",
            message: "Использование формальных фраз может указывать на скрытое раздражение",
            confidence: 78,
            context: "Фраза: 'Конечно, я понимаю вашу позицию'",
          },
          {
            type: "Избегание конфликта",
            message: "Собеседник избегает прямых ответов на сложные вопросы",
            confidence: 85,
            context: "Переход к другим темам при обсуждении ответственности",
          },
          {
            type: "Желание завершить разговор",
            message: "Короткие ответы и согласие могут указывать на желание закончить беседу",
            confidence: 70,
            context: "Последние 3 сообщения становятся заметно короче",
          },
        ],
      }
      handleAnalysisComplete(mockData)
    }, 3000)
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Панель управления</h1>
          <p className="text-muted-foreground">Загрузите разговор для анализа эмоций и скрытых смыслов</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <UploadSection onAnalysisStart={handleAnalysisStart} isAnalyzing={isAnalyzing} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {analysisData ? (
            <AnalysisResults data={analysisData} />
          ) : (
            <EmptyState
              title="Начните свой первый анализ"
              description="Загрузите текстовый файл или скриншот разговора, чтобы получить детальный ИИ-анализ эмоций, тона и скрытых смыслов."
              icon="🧠"
            />
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
