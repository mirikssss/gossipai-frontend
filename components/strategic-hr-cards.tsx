"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart2, Sprout, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface StrategicHrCardsProps {
  data: {
    preset_validation?: {
      is_valid: boolean;
      reason: string;
    };
    team_analytics?: {
      communication_metrics?: {
        speaking_time?: Record<string, number>;
        question_frequency?: Record<string, number>;
        solution_proposals?: Record<string, number>;
      };
      goal_effectiveness?: number;
    };
    psychological_safety?: {
      safety_level?: number;
      openness_indicators?: string[];
      trust_level?: string;
    };
    professional_growth?: {
      skill_analysis?: Array<{
        person: string;
        strengths: string[];
        areas_to_develop: string[];
      }>;
      recommendations?: string[];
    };
  }
}

export function StrategicHrCards({ data }: StrategicHrCardsProps) {
  // Check if preset validation failed
  if (data.preset_validation && !data.preset_validation.is_valid) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="col-span-2"
      >
        <Card className="bg-card/50 backdrop-blur border-red-500/20 h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-400">
              <BarChart2 className="w-5 h-5" />
              <span>Пресет не подходит для данного диалога</span>
            </CardTitle>
            <CardDescription className="text-red-300">
              {data.preset_validation.reason}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-muted-foreground py-8">
              <p className="mb-4">Выбранный пресет "Стратегический HR" предназначен для анализа деловой/рабочей коммуникации.</p>
              <p>Попробуйте выбрать другой пресет или загрузить диалог, содержащий рабочую тематику.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Calculate total from speaking time to create percentages
  const calculateTotal = (metrics: Record<string, number> = {}) => {
    return Object.values(metrics).reduce((sum, value) => sum + value, 0);
  };
  
  const getColor = (value: number, max: number = 100) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 50) return "text-yellow-500";
    return "text-red-500";
  };
  
  return (
    <>
      {/* Team Analytics Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="bg-card/50 backdrop-blur border-neon-blue/20 h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-neon-blue" />
              <span>Командная аналитика</span>
            </CardTitle>
            <CardDescription>Квантифицированные метрики коммуникации</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.team_analytics?.communication_metrics ? (
              <>
                <div className="space-y-4">
                  {/* Speaking Time */}
                  <div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <h4 className="font-medium">Распределение времени говорения:</h4>
                    </div>
                    <div className="space-y-3">
                      {data.team_analytics.communication_metrics.speaking_time && 
                       Object.entries(data.team_analytics.communication_metrics.speaking_time).map(([person, time], index) => {
                        const totalTime = calculateTotal(data.team_analytics?.communication_metrics?.speaking_time);
                        const percentage = totalTime > 0 ? (time / totalTime) * 100 : 0;
                        
                        return (
                          <div key={index}>
                            <div className="flex justify-between items-center text-sm mb-1">
                              <span>{person}</span>
                              <span className="font-medium">{percentage.toFixed(0)}%</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Question Frequency */}
                  <div className="pt-3 border-t border-border/40">
                    <h4 className="text-sm font-medium mb-2">Частота вопросов:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {data.team_analytics.communication_metrics.question_frequency && 
                       Object.entries(data.team_analytics.communication_metrics.question_frequency).map(([person, count], index) => (
                        <div key={index} className="bg-muted/30 rounded-lg p-3 border border-neon-blue/10 text-center">
                          <div className="text-lg font-bold">{count}</div>
                          <div className="text-xs text-muted-foreground">{person}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Solution Proposals */}
                  <div className="pt-3 border-t border-border/40">
                    <h4 className="text-sm font-medium mb-2">Предложения решений:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {data.team_analytics.communication_metrics.solution_proposals && 
                       Object.entries(data.team_analytics.communication_metrics.solution_proposals).map(([person, count], index) => (
                        <div key={index} className="bg-muted/30 rounded-lg p-3 border border-neon-blue/10 text-center">
                          <div className="text-lg font-bold">{count}</div>
                          <div className="text-xs text-muted-foreground">{person}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Goal Effectiveness */}
                <div className="pt-4 border-t border-border/40 text-center space-y-2">
                  <h4 className="text-sm font-medium">Эффективность достижения целей обсуждения:</h4>
                  <div className={`text-2xl font-bold ${getColor(data.team_analytics.goal_effectiveness || 0)}`}>
                    {data.team_analytics.goal_effectiveness}%
                  </div>
                  <Progress 
                    value={data.team_analytics.goal_effectiveness} 
                    className="h-2" 
                  />
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Данные командной аналитики недоступны
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Psychological Safety Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Card className="bg-card/50 backdrop-blur border-neon-blue/20 h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sprout className="w-5 h-5 text-neon-blue" />
              <span>Психологическая безопасность</span>
            </CardTitle>
            <CardDescription>Уровень открытости и доверия в коммуникации</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.psychological_safety ? (
              <>
                <div className="text-center">
                  <div className="relative mx-auto w-28 h-28 mb-4">
                    <div 
                      className="absolute inset-0 rounded-full border-8 border-muted/40"
                    ></div>
                    <div 
                      className="absolute inset-0 rounded-full border-8 border-transparent"
                      style={{
                        borderTopColor: `hsl(${data.psychological_safety.safety_level || 0}, 100%, 50%)`,
                        borderRightColor: `hsl(${data.psychological_safety.safety_level || 0}, 100%, 50%)`,
                        transform: `rotate(${(data.psychological_safety.safety_level || 0) * 3.6}deg)`,
                        transition: 'transform 1s ease-out'
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <div className="text-2xl font-bold">
                          {data.psychological_safety.safety_level}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {data.psychological_safety.trust_level}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium">Уровень психологической безопасности</p>
                </div>
                
                <div className="pt-3 border-t border-border/40">
                  <h4 className="text-sm font-medium mb-2">Индикаторы открытости:</h4>
                  <div className="space-y-2">
                    {data.psychological_safety.openness_indicators?.map((indicator, index) => (
                      <div key={index} className="flex items-center space-x-3 bg-muted/30 rounded-lg p-3 border border-neon-blue/10">
                        <div 
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: `hsl(${index * 30}, 70%, 50%)` }}
                        ></div>
                        <p className="text-sm">{indicator}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Данные о психологической безопасности недоступны
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Professional Growth Card - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="col-span-2"
      >
        <Card className="bg-card/50 backdrop-blur border-neon-blue/20 h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-neon-blue" />
              <span>Профессиональный рост</span>
            </CardTitle>
            <CardDescription>Анализ коммуникационных навыков членов команды</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.professional_growth?.skill_analysis ? (
              <>
                {data.professional_growth.skill_analysis.map((person, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-4 border border-neon-blue/10">
                    <h4 className="text-md font-medium mb-3">{person.person}</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium mb-1 flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          Сильные стороны:
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {person.strengths.map((strength, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-green-500/40 text-green-500">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium mb-1 flex items-center">
                          <span className="text-yellow-500 mr-2">○</span>
                          Зоны развития:
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {person.areas_to_develop.map((area, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-yellow-500/40 text-yellow-500">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-3 border-t border-border/40">
                  <h4 className="text-sm font-medium mb-2">Рекомендации по обучению:</h4>
                  <ul className="space-y-1">
                    {data.professional_growth.recommendations?.map((recommendation, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-neon-blue mr-2">•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Данные о профессиональном росте недоступны
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}
