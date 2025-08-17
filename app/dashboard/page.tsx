"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UploadSection } from "@/components/upload-section"
import { EmptyState } from "@/components/empty-state"
import { AnalysisResults } from "@/components/analysis-results"
import { motion } from "framer-motion"
import { apiClient, AnalysisResult } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, CheckCircle } from "lucide-react"

interface User {
  id: string;
  email: string;
  name: string;
  created_at?: string;
  settings?: any;
}

export default function DashboardPage() {
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showUploadSection, setShowUploadSection] = useState(true)
  const [analysisSteps, setAnalysisSteps] = useState<Array<{step: string, completed: boolean}>>([]);
  const [progressIntervalId, setProgressIntervalId] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Check if we're on the client side and have a token
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken')
        if (!token) {
          router.push("/login")
          return
        }
      }
      
      const userData = await apiClient.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error("Auth check failed:", error)
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalysisComplete = (data: AnalysisResult) => {
    console.log("Analysis complete, stopping interval and showing results")
    
    // Если интервал прогресса существует, остановим его
    if (progressIntervalId) {
      clearInterval(progressIntervalId)
      setProgressIntervalId(null)
    }
    
    // Mark all steps as completed
    setAnalysisSteps(prev => prev.map(step => ({ ...step, completed: true })))
    
    // Short timeout to show all steps completed before showing results
    setTimeout(() => {
      setAnalysisData(data)
      setIsAnalyzing(false)
      // Upload section is already hidden from handleAnalysisStart
    }, 1000)
  }

  const handleAnalysisStart = () => {
    setIsAnalyzing(true)
    // Hide upload section immediately
    setShowUploadSection(false)
    
    // Define analysis steps
    setAnalysisSteps([
      { step: "Извлечение текста и изображений", completed: false },
      { step: "Анализ эмоционального тона", completed: false },
      { step: "Определение скрытых смыслов", completed: false },
      { step: "Формирование оценки ИИ-судьи", completed: false },
      { step: "Подготовка рекомендаций", completed: false }
    ])
    
    // Запускаем и сохраняем ID интервала
    const intervalId = simulateStepProgress()
    setProgressIntervalId(intervalId)
  }
  
  const simulateStepProgress = () => {
    // This simulates the progress of steps while the actual analysis happens in the backend
    let currentStep = 0;
    
    // Сохраняем ID интервала в глобальной переменной, чтобы его можно было остановить
    const intervalId = setInterval(() => {
      if (currentStep < 5) {
        setAnalysisSteps(prev => {
          const newSteps = [...prev];
          if (newSteps[currentStep]) {
            newSteps[currentStep].completed = true;
          }
          return newSteps;
        });
        currentStep++;
      } else {
        clearInterval(intervalId);
      }
    }, 2000); // Update a step every 2 seconds
    
    // Возвращаем ID интервала, чтобы его можно было остановить извне
    return intervalId;
  }
  
  const handleStartNewAnalysis = () => {
    // Если интервал прогресса существует, остановим его
    if (progressIntervalId) {
      clearInterval(progressIntervalId)
      setProgressIntervalId(null)
    }
    
    setAnalysisData(null)
    setShowUploadSection(true)
    setIsAnalyzing(false)
    setAnalysisSteps([])
  }

  const handleLogout = async () => {
    try {
      await apiClient.logout()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка...</p>
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
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Панель управления</h1>
            <p className="text-muted-foreground">
              {showUploadSection 
                ? "Загрузите разговор для анализа эмоций и скрытых смыслов"
                : "Результаты анализа разговора"}
              {user && ` • Добро пожаловать, ${user.name}!`}
            </p>
          </div>
          {!showUploadSection && (
            <Button
              onClick={handleStartNewAnalysis}
              size="sm"
              className="bg-neon-blue text-white button-hover-effect hover:bg-neon-purple active:scale-95 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 mr-2 animate-spin-slow" />
              Новый анализ
            </Button>
          )}
        </motion.div>

        {showUploadSection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <UploadSection 
              onAnalysisStart={handleAnalysisStart} 
              onAnalysisComplete={handleAnalysisComplete}
              isAnalyzing={isAnalyzing} 
            />
          </motion.div>
        )}
        
        {isAnalyzing && analysisSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 py-8"
          >
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 border border-neon-purple/20 mx-auto">
                <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Анализируем разговор</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                ИИ обрабатывает ваш разговор для выявления эмоций, скрытых смыслов и предоставления рекомендаций
              </p>
            </div>
            
            <div className="max-w-md mx-auto bg-card/50 backdrop-blur rounded-lg p-6 space-y-4 border border-neon-purple/20">
              {analysisSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : index === analysisSteps.findIndex(s => !s.completed) ? (
                    <div className="w-5 h-5 rounded-full border-2 border-neon-purple border-t-transparent animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-muted flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{step.step}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {analysisData ? (
            <AnalysisResults data={analysisData} />
          ) : !isAnalyzing && showUploadSection ? (
            <EmptyState
              title="Начните свой первый анализ"
              description="Загрузите текстовый файл или скриншот разговора, чтобы получить детальный ИИ-анализ эмоций, тона и скрытых смыслов."
              icon="🧠"
            />
          ) : null}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}