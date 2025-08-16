"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EmptyState } from "@/components/empty-state"
import { HistoryCard } from "@/components/history-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { motion } from "framer-motion"

// Mock history data
const mockHistory = [
  {
    id: "1",
    title: "Рабочий разговор с коллегой",
    date: "2024-01-15",
    time: "14:30",
    participants: 2,
    messageCount: 15,
    overallScore: 72,
    dominantEmotion: "Беспокойство",
    fileName: "work_chat.txt",
    preview: "Разговор между двумя коллегами о рабочем проекте...",
  },
  {
    id: "2",
    title: "Семейная беседа",
    date: "2024-01-14",
    time: "19:45",
    participants: 3,
    messageCount: 28,
    overallScore: 85,
    dominantEmotion: "Радость",
    fileName: "family_chat.txt",
    preview: "Обсуждение планов на выходные с семьей...",
  },
  {
    id: "3",
    title: "Переговоры с клиентом",
    date: "2024-01-13",
    time: "11:20",
    participants: 2,
    messageCount: 22,
    overallScore: 68,
    dominantEmotion: "Напряжение",
    fileName: "client_meeting.txt",
    preview: "Обсуждение условий контракта и сроков...",
  },
  {
    id: "4",
    title: "Дружеская переписка",
    date: "2024-01-12",
    time: "16:15",
    participants: 2,
    messageCount: 45,
    overallScore: 92,
    dominantEmotion: "Веселье",
    fileName: "friend_chat.txt",
    preview: "Обмен новостями и планирование встречи...",
  },
]

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [filterBy, setFilterBy] = useState("all")

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.preview.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "high" && item.overallScore >= 80) ||
      (filterBy === "medium" && item.overallScore >= 60 && item.overallScore < 80) ||
      (filterBy === "low" && item.overallScore < 60)

    return matchesSearch && matchesFilter
  })

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === "score") {
      return b.overallScore - a.overallScore
    } else if (sortBy === "messages") {
      return b.messageCount - a.messageCount
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

        {mockHistory.length > 0 ? (
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
                  placeholder="Поиск по названию или содержанию..."
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
                  <HistoryCard item={item} />
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
