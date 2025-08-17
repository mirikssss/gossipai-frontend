"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  TrendingUp,
  Shield,
  Eye,
  Users,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
  Share,
  Bot,
  Send,
  Lightbulb,
  RefreshCcw,
  Heart,
  Brain,
  Compass,
  BarChart2,
  Sprout,
} from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"

interface AnalysisResultsProps {
  data: {
    summary?: {
      overview?: string
      participants?: number
      messageCount?: number
      duration?: string
      mainTopics?: string[]
    }
    emotionTimeline?: {
      emotions?: Array<{
        time: string
        emotion: string
        intensity: number
        color: string
      }>
      dominantEmotion?: string
      emotionalShifts?: number
    }
    aiJudgeScore?: {
      overallScore?: number
      breakdown?: {
        clarity?: number
        empathy?: number
        professionalism?: number
        resolution?: number
      }
      verdict?: string
      recommendation?: string
    }
    subtleties?: Array<{
      type: string
      message: string
      confidence: number
      context: string
    }>
    preset?: {
      id: string
      name: string
      custom_cards: Array<{
        id: string
        name: string
        icon: string
        description: string
      }>
    }
    preset_validation?: {
      is_valid: boolean;
      reason: string;
    }
    // Teen Navigator specific data
    safety_check?: {
      bullying_indicators?: string[];
      safety_level?: number;
      recommendations?: string[];
    }
    emotion_dictionary?: {
      hidden_emotions?: Array<{
        text: string;
        explanation: string;
      }>;
    }
    social_compass?: {
      group_dynamics?: string;
      inner_circles?: string[];
      navigation_tips?: string[];
    }
    
    // Family Balance specific data
    communication_cycles?: {
      patterns?: string[];
      trigger_points?: string[];
      interruption_techniques?: string[];
    }
    needs_map?: {
      expressed_needs?: string[];
      unexpressed_needs?: string[];
      overlap_areas?: string[];
    }
    family_roles?: {
      role_distribution?: string[];
      responsibility_balance?: number;
      recommendations?: string[];
    }
    
    // Strategic HR specific data
    team_analytics?: {
      communication_metrics?: {
        speaking_time?: Record<string, number>;
        question_frequency?: Record<string, number>;
        solution_proposals?: Record<string, number>;
      }
      goal_effectiveness?: number;
    }
    psychological_safety?: {
      safety_level?: number;
      openness_indicators?: string[];
      trust_level?: string;
    }
    professional_growth?: {
      skill_analysis?: Array<{
        person: string;
        strengths: string[];
        areas_to_develop: string[];
      }>;
      recommendations?: string[];
    }
  }
}

// Import preset-specific card components
import { TeenNavigatorCards } from "@/components/teen-navigator-cards"
import { FamilyBalanceCards } from "@/components/family-balance-cards"
import { StrategicHrCards } from "@/components/strategic-hr-cards"

export function AnalysisResults({ data }: AnalysisResultsProps) {
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<Array<{ role: "assistant" | "user"; message: string }>>([
    {
      role: "assistant",
      message: "Привет! Я готов ответить на ваши вопросы об анализе разговора. Что вас интересует?",
    },
  ])
  const [showTips, setShowTips] = useState(false)
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const [suggestedResponses, setSuggestedResponses] = useState<Array<{
    text: string
    reason: string
  }>>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [conversationId] = useState(`conv_${Date.now()}`)

  // Generate suggested responses when component mounts
  useEffect(() => {
    generateSuggestedResponses()
  }, [])

  const generateSuggestedResponses = async () => {
    setIsLoadingSuggestions(true)
    try {
      // Create conversation text from analysis data
      const conversationText = `
        Анализ разговора:
        - Общий обзор: ${data.summary?.overview || 'Не указано'}
        - Участники: ${data.summary?.participants || 0}
        - Сообщений: ${data.summary?.messageCount || 0}
        - Длительность: ${data.summary?.duration || 'Не указано'}
        - Основные темы: ${data.summary?.mainTopics?.join(', ') || 'Не указано'}
        - Доминирующая эмоция: ${data.emotionTimeline?.dominantEmotion || 'Не указано'}
        - Эмоциональные переходы: ${data.emotionTimeline?.emotionalShifts || 0}
        - Общий балл ИИ-судьи: ${data.aiJudgeScore?.overallScore || 0}/100
        - Рекомендация: ${data.aiJudgeScore?.recommendation || 'Не указано'}
        - Тонкости: ${data.subtleties?.map(s => `${s.type}: ${s.message}`).join('; ') || 'Не указано'}
      `

      const response = await apiClient.getSuggestedResponses(conversationText)
      if (response && typeof response === 'object' && 'success' in response && response.success && 'suggestions' in response) {
        setSuggestedResponses(response.suggestions as Array<{ text: string; reason: string }>)
      }
    } catch (error) {
      console.error("Failed to generate suggested responses:", error)
      // Fallback to default suggestions
      setSuggestedResponses([
        {
          text: "Понимаю твою точку зрения! 🤝",
          reason: "Показывает эмпатию и готовность к диалогу"
        },
        {
          text: "Расскажи подробнее, мне важно услышать твое мнение 💬",
          reason: "Поощряет открытую коммуникацию"
        },
        {
          text: "Давай сделаем паузу и вернемся позже ⏰",
          reason: "Помогает избежать эскалации конфликта"
        }
      ])
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

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

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isLoadingChat) return

    const userMessage = chatMessage.trim()
    setChatMessage("")
    setIsLoadingChat(true)

    // Add user message to chat
    setChatHistory((prev) => [
      ...prev,
      { role: "user", message: userMessage },
    ])

    try {
      const response = await apiClient.chatWithAI(userMessage, conversationId)
      if (response && typeof response === 'object' && 'success' in response && response.success && 'response' in response) {
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", message: response.response as string },
        ])
      } else {
        // Fallback response
        setChatHistory((prev) => [
          ...prev,
          { 
            role: "assistant", 
            message: "Отличный вопрос! 😊 Основываясь на анализе, я вижу, что общение было очень конструктивным. Оба участника проявили эмпатию и профессионализм. Рекомендую продолжать такой стиль общения! 👍" 
          },
        ])
      }
    } catch (error) {
      console.error("Chat error:", error)
      // Fallback response on error
      setChatHistory((prev) => [
        ...prev,
        { 
          role: "assistant", 
          message: "Извините, произошла ошибка 😔 Попробуйте задать вопрос еще раз." 
        },
      ])
    } finally {
      setIsLoadingChat(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Результаты анализа</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="border-neon-blue/20 hover:bg-neon-blue/10 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-neon-turquoise/20 hover:bg-neon-turquoise/10 bg-transparent"
          >
            <Share className="w-4 h-4 mr-2" />
            Поделиться
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-min">
        {/* Summary Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="bg-card/50 backdrop-blur border-neon-purple/20 h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-neon-purple" />
                <span>Краткое содержание</span>
              </CardTitle>
              <CardDescription>Общий обзор разговора</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground leading-relaxed">{data.summary?.overview || 'Обзор не доступен'}</p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-neon-blue" />
                  <span className="text-sm text-muted-foreground">Участники:</span>
                  <span className="text-sm font-medium">{data.summary?.participants || 0}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-neon-turquoise" />
                  <span className="text-sm text-muted-foreground">Сообщений:</span>
                  <span className="text-sm font-medium">{data.summary?.messageCount || 0}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-neon-purple" />
                  <span className="text-sm text-muted-foreground">Длительность:</span>
                  <span className="text-sm font-medium">{data.summary?.duration || 'Не указано'}</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2">Основные темы:</p>
                <div className="flex flex-wrap gap-2">
                  {data.summary?.mainTopics?.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  )) || <span className="text-sm text-muted-foreground">Темы не указаны</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Judge Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur border-neon-blue/20 h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-neon-blue" />
                <span>ИИ-судья</span>
              </CardTitle>
              <CardDescription>Объективная оценка качества общения</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(data.aiJudgeScore?.overallScore || 0)} mb-2`}>
                  {data.aiJudgeScore?.overallScore || 0}/100
                </div>
                <Badge variant={getScoreBadgeVariant(data.aiJudgeScore?.overallScore || 0)} className="mb-4 max-w-full break-words">
                  {data.aiJudgeScore?.verdict || 'Оценка не доступна'}
                </Badge>
              </div>

              <div className="space-y-3">
                {data.aiJudgeScore?.breakdown ? (
                  Object.entries(data.aiJudgeScore.breakdown).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize text-muted-foreground">
                          {key === "clarity"
                            ? "Ясность"
                            : key === "empathy"
                              ? "Эмпатия"
                              : key === "professionalism"
                                ? "Профессионализм"
                                : "Решение"}
                        </span>
                        <span className="font-medium">{value || 0}%</span>
                      </div>
                      <Progress value={value || 0} className="h-2" />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">
                    Детальная оценка не доступна
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border/40">
                <p className="text-sm text-muted-foreground">
                  <strong>Рекомендация:</strong> {data.aiJudgeScore?.recommendation || 'Рекомендация не доступна'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Emotion Timeline Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur border-neon-turquoise/20 h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-neon-turquoise" />
                <span>Временная шкала эмоций</span>
              </CardTitle>
              <CardDescription>Как менялись эмоции в ходе разговора</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Доминирующая эмоция:</span>
                <Badge variant="outline" className="border-neon-turquoise/40 text-neon-turquoise whitespace-nowrap">
                  {data.emotionTimeline?.dominantEmotion || 'Не указано'}
                </Badge>
              </div>

              <div className="space-y-3">
                {data.emotionTimeline?.emotions?.map((emotion, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-xs text-muted-foreground w-12">{emotion.time}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-1">{emotion.emotion}</span>
                        <span className="text-muted-foreground">{emotion.intensity}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${emotion.intensity}%`,
                            backgroundColor: emotion.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-muted-foreground">
                    Данные об эмоциях не доступны
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border/40 text-center">
                <p className="text-sm text-muted-foreground">
                  Эмоциональных переходов: <span className="font-medium">{data.emotionTimeline?.emotionalShifts || 0}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subtleties Detector Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-card/50 backdrop-blur border-neon-purple/20 h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-neon-purple" />
                <span>Детектор тонкостей</span>
              </CardTitle>
              <CardDescription>Скрытые смыслы и подтексты</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.subtleties?.map((subtlety, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/50 border border-border/40">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm text-foreground">{subtlety.type}</h4>
                    <div className="flex items-center space-x-1">
                      {subtlety.confidence >= 80 ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className="text-xs text-muted-foreground">{subtlety.confidence}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{subtlety.message}</p>
                  <div className="text-xs text-muted-foreground bg-background/50 p-2 rounded border-l-2 border-neon-purple/40">
                    <strong>Контекст:</strong> {subtlety.context}
                  </div>
                </div>
              )) || (
                <div className="text-center text-muted-foreground">
                  Тонкости не обнаружены
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Preset-specific cards */}
        {data.preset?.id === 'teen_navigator' && (
          <TeenNavigatorCards data={data} />
        )}
        
        {data.preset?.id === 'family_balance' && (
          <FamilyBalanceCards data={data} />
        )}
        
        {data.preset?.id === 'strategic_hr' && (
          <StrategicHrCards data={data} />
        )}
      </div>

      {/* AI Chatbot section with full width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8"
      >
        <Card className="bg-card/50 backdrop-blur border-neon-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-neon-blue" />
              <span>ИИ-консультант</span>
            </CardTitle>
            <CardDescription>Задайте вопросы об анализе разговора</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-64 overflow-y-auto space-y-3 p-4 bg-muted/20 rounded-lg">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
              {isLoadingChat && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-muted text-foreground">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neon-blue"></div>
                      <span className="text-sm">ИИ думает...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Задайте вопрос об анализе..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
                disabled={isLoadingChat}
              />
              <Button onClick={handleSendMessage} size="sm" disabled={isLoadingChat || !chatMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Suggested Responses section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-card/50 backdrop-blur border-neon-turquoise/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-neon-turquoise" />
              <span>Подходящие ответы</span>
            </CardTitle>
            <CardDescription>Конкретные фразы для улучшения общения</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setShowTips(!showTips)}
              variant="outline"
              className="w-full border-neon-turquoise/20 hover:bg-neon-turquoise/10"
            >
              {showTips ? "Скрыть советы" : "Показать советы по общению"}
            </Button>

            {showTips && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {isLoadingSuggestions ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neon-turquoise"></div>
                    <span className="ml-2 text-sm text-muted-foreground">Генерируем советы...</span>
                  </div>
                ) : (
                  suggestedResponses.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-muted/30 rounded-lg border border-neon-turquoise/10"
                    >
                      <p className="text-sm text-foreground font-medium mb-2">{suggestion.text}</p>
                      <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
