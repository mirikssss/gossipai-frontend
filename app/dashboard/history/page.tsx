"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EmptyState } from "@/components/empty-state"
import { HistoryCard } from "@/components/history-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { apiClient, HistoryItem } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [filterBy, setFilterBy] = useState("all")
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log("Fetching history data...");
      const historyData = await apiClient.getHistory();
      console.log("History data received:", historyData);
      
      if (!historyData || historyData.length === 0) {
        console.log("No history data found");
      }
      
      setHistory(Array.isArray(historyData) ? historyData : []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setError("Не удалось загрузить историю анализов");
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "high" && item.overall_score >= 80) ||
      (filterBy === "medium" && item.overall_score >= 60 && item.overall_score < 80) ||
      (filterBy === "low" && item.overall_score < 60)

    return matchesSearch && matchesFilter
  })

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === "score") {
      return b.overall_score - a.overall_score
    } else if (sortBy === "messages") {
      return b.message_count - a.message_count
    }
    return 0
  })

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">История анализов</h1>
          <p className="text-muted-foreground">Просматривайте и управляйте всеми вашими предыдущими анализами</p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-purple mx-auto mb-4"></div>
              <p className="text-muted-foreground">Загрузка истории анализов...</p>
            </div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-4 rounded-lg bg-red-50/10 border border-red-500/20 text-center"
          >
            <p className="text-red-500">{error}</p>
          </motion.div>
        ) : history.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Поиск по названию..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-neon-blue/20 focus:border-neon-blue/40"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 bg-background/50 border-neon-blue/20">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">По дате</SelectItem>
                  <SelectItem value="score">По оценке</SelectItem>
                  <SelectItem value="messages">По сообщениям</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full sm:w-48 bg-background/50 border-neon-turquoise/20">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Фильтр" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все анализы</SelectItem>
                  <SelectItem value="high">Высокая оценка (80+)</SelectItem>
                  <SelectItem value="medium">Средняя оценка (60-79)</SelectItem>
                  <SelectItem value="low">Низкая оценка (&lt;60)</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <HistoryCard item={item} onDelete={handleDeleteHistoryItem} />
                </motion.div>
              ))}
            </div>

            {filteredHistory.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <EmptyState
                  title="Ничего не найдено"
                  description="Попробуйте изменить параметры поиска или фильтры"
                  icon="🔍"
                />
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <EmptyState
              title="История пуста"
              description="Здесь будут отображаться все ваши анализы разговоров. Создайте свой первый анализ, чтобы увидеть результаты здесь."
              icon="📚"
            />
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  )
}