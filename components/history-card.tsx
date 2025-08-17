"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, MessageSquare, Users, MoreVertical, Eye, Download, Trash2, FileText, Image, Mic } from "lucide-react"
import { useState } from "react"
import { apiClient, HistoryItem } from "@/lib/api"
import { useRouter } from "next/navigation"

interface HistoryCardProps {
  item: HistoryItem;
  onDelete?: (id: string) => void;
}

export function HistoryCard({ item, onDelete }: HistoryCardProps) {
  const [isDeleted, setIsDeleted] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  
  const formattedDate = apiClient.formatDate(item.date)
  
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
  
  const getFileTypeIcon = () => {
    switch (item.file_type) {
      case "text":
        return <FileText className="w-3 h-3 text-blue-500" />
      case "image":
      case "multi-image":
        return <Image className="w-3 h-3 text-purple-500" />
      case "audio":
        return <Mic className="w-3 h-3 text-green-500" />
      default:
        return <FileText className="w-3 h-3 text-blue-500" />
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await apiClient.deleteHistoryItem(item.id)
      setIsDeleted(true)
      if (onDelete) {
        onDelete(item.id)
      }
    } catch (error) {
      console.error("Failed to delete history item:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleView = () => {
    router.push(`/dashboard/analysis/${item.id}`)
  }

  const handleDownload = async () => {
    try {
      const detail = await apiClient.getHistoryDetail(item.id)
      
      // Create a JSON file for download
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(detail, null, 2))
      const downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", `analysis-${item.id}.json`)
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    } catch (error) {
      console.error("Failed to download analysis:", error)
    }
  }

  if (isDeleted) {
    return null
  }

  return (
    <Card className="bg-card/50 backdrop-blur border-neon-purple/20 hover:border-neon-blue/40 transition-all duration-300 group hover:glow-purple">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              {getFileTypeIcon()}
              <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
            </div>
            <CardDescription className="flex items-center space-x-2 mt-1">
              <Calendar className="w-3 h-3" />
              <span>
                {formattedDate.date} в {formattedDate.time}
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
              <DropdownMenuItem onClick={handleDelete} className="text-red-500" disabled={isDeleting}>
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Удаление..." : "Удалить"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3 text-neon-blue" />
              <span className="text-muted-foreground">{item.participants}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-3 h-3 text-neon-turquoise" />
              <span className="text-muted-foreground">{item.message_count}</span>
            </div>
          </div>
          <div className={`font-bold ${getScoreColor(item.overall_score)}`}>{item.overall_score}/100</div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-neon-turquoise/40 text-neon-turquoise text-xs">
            {item.dominant_emotion}
          </Badge>
          <Badge variant={getScoreBadgeVariant(item.overall_score)} className="text-xs">
            {item.overall_score >= 80 ? "Отлично" : item.overall_score >= 60 ? "Хорошо" : "Требует внимания"}
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
