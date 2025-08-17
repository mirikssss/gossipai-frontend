"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalysisResults } from "@/components/analysis-results"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { apiClient } from "@/lib/api"
import { motion } from "framer-motion"

export default function AnalysisDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!params.id) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        const analysisData = await apiClient.getHistoryDetail(params.id as string)
        setAnalysis(analysisData.analysis_results)
      } catch (err) {
        console.error("Failed to fetch analysis:", err)
        setError("Не удалось загрузить анализ")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAnalysis()
  }, [params.id])
  
  const handleBack = () => {
    router.back()
  }
  
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="border-neon-blue/20 hover:bg-neon-blue/10"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к истории
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple mx-auto mb-4"></div>
              <p className="text-muted-foreground">Загрузка анализа...</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-red-50/10 border border-red-500/20 text-center">
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4 border-neon-blue/20 hover:bg-neon-blue/10"
              onClick={handleBack}
            >
              Вернуться к истории
            </Button>
          </div>
        ) : analysis ? (
          <AnalysisResults data={analysis} />
        ) : null}
      </motion.div>
    </DashboardLayout>
  )
}
