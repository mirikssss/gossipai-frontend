"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, MessageSquare, Users, MoreVertical, Eye, Download, Trash2 } from "lucide-react"
import { useState } from "react"

interface HistoryCardProps {
  item: {
    id: string
    title: string
    date: string
    time: string
    participants: number
    messageCount: number
    overallScore: number
    dominantEmotion: string
    fileName: string
    preview: string
  }
}

export function HistoryCard({ item }: HistoryCardProps) {
  const [isDeleted, setIsDeleted] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  const handleDelete = () => {
    setIsDeleted(true)
    // Handle delete logic here
    console.log("Deleting analysis:", item.id)
  }

  const handleView = () => {
    // Handle view logic here
    console.log("Viewing analysis:", item.id)
  }

  const handleDownload = () => {
    // Handle download logic here
    console.log("Downloading analysis:", item.id)
  }

  if (isDeleted) {
    return null
  }

  return (
    <Card className="bg-card/50 backdrop-blur border-neon-purple/20 hover:border-neon-blue/40 transition-all duration-300 group hover:glow-purple">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
            <CardDescription className="flex items-center space-x-2 mt-1">
              <Calendar className="w-3 h-3" />
              <span>
                {item.date} в {item.time}
              </span>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleView}>
                <Eye className="w-4 h-4 mr-2" />
                Просмотреть
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Скачать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-500">
                <Trash2 className="w-4 h-4 mr-2" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{item.preview}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3 text-neon-blue" />
              <span className="text-muted-foreground">{item.participants}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-3 h-3 text-neon-turquoise" />
              <span className="text-muted-foreground">{item.messageCount}</span>
            </div>
          </div>
          <div className={`font-bold ${getScoreColor(item.overallScore)}`}>{item.overallScore}/100</div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-neon-turquoise/40 text-neon-turquoise text-xs">
            {item.dominantEmotion}
          </Badge>
          <Badge variant={getScoreBadgeVariant(item.overallScore)} className="text-xs">
            {item.overallScore >= 80 ? "Отлично" : item.overallScore >= 60 ? "Хорошо" : "Требует внимания"}
          </Badge>
        </div>

        <Button
          onClick={handleView}
          variant="outline"
          size="sm"
          className="w-full border-neon-purple/20 hover:bg-neon-purple/10 bg-transparent group-hover:border-neon-purple/40 transition-all duration-300"
        >
          Открыть анализ
        </Button>
      </CardContent>
    </Card>
  )
}
