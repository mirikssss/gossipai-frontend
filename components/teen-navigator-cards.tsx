"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Brain, Compass } from "lucide-react"
import { motion } from "framer-motion"

interface TeenNavigatorCardsProps {
  data: {
    preset_validation?: {
      is_valid: boolean;
      reason: string;
    };
    safety_check?: {
      bullying_indicators?: string[];
      safety_level?: number;
      recommendations?: string[];
    };
    emotion_dictionary?: {
      hidden_emotions?: Array<{
        text: string;
        explanation: string;
      }>;
    };
    social_compass?: {
      group_dynamics?: string;
      inner_circles?: string[];
      navigation_tips?: string[];
    };
  }
}

export function TeenNavigatorCards({ data }: TeenNavigatorCardsProps) {
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
              <Shield className="w-5 h-5" />
              <span>Пресет не подходит для данного диалога</span>
            </CardTitle>
            <CardDescription className="text-red-300">
              {data.preset_validation.reason}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-muted-foreground py-8">
              <p className="mb-4">Выбранный пресет "Подростковый Навигатор" предназначен для анализа подростковой коммуникации.</p>
              <p>Попробуйте выбрать другой пресет или загрузить диалог, содержащий подростковую тематику.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <>
      {/* Safety Check Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="bg-card/50 backdrop-blur border-neon-purple/20 h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-neon-purple" />
              <span>Проверка безопасности</span>
            </CardTitle>
            <CardDescription>Индикаторы буллинга и эмоциональная безопасность</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.safety_check ? (
              <>
                <div className="text-center">
                  <div className="relative mx-auto w-24 h-24 mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-purple/20 to-neon-blue/20"></div>
                    <div 
                      className="absolute inset-0 rounded-full border-4" 
                      style={{ 
                        borderColor: `hsl(${data.safety_check.safety_level}, 100%, 50%)`,
                        borderLeftColor: 'transparent',
                        transform: `rotate(${(data.safety_check.safety_level || 0) * 1.8}deg)`,
                        transition: 'transform 1s ease-in-out'
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">
                        {data.safety_check.safety_level}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">Уровень безопасности общения</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Индикаторы:</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.safety_check.bullying_indicators?.map((indicator, index) => (
                      <Badge key={index} variant={index % 2 === 0 ? "default" : "secondary"} className="text-xs">
                        {indicator}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <h4 className="text-sm font-medium mb-2">Рекомендации:</h4>
                  <ul className="space-y-1">
                    {data.safety_check.recommendations?.map((recommendation, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-neon-purple mr-2">•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Данные о безопасности недоступны
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Emotion Dictionary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Card className="bg-card/50 backdrop-blur border-neon-purple/20 h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-neon-purple" />
              <span>Словарь эмоций</span>
            </CardTitle>
            <CardDescription>Расшифровка скрытых эмоций в простых терминах</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.emotion_dictionary && data.emotion_dictionary.hidden_emotions?.length ? (
              <>
                <div className="space-y-4">
                  {data.emotion_dictionary.hidden_emotions && data.emotion_dictionary.hidden_emotions.length > 0 ? (
                    data.emotion_dictionary.hidden_emotions.map((emotion, index) => (
                      <div key={index} className="bg-muted/30 rounded-lg p-4 border border-neon-purple/10">
                        <h4 className="text-md font-medium mb-2">{emotion.text}</h4>
                        <p className="text-sm text-muted-foreground">{emotion.explanation}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      Скрытые эмоции не обнаружены
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Словарь эмоций недоступен
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Social Compass Card - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="col-span-2"
      >
        <Card className="bg-card/50 backdrop-blur border-neon-purple/20 h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-neon-purple" />
              <span>Социальный компас</span>
            </CardTitle>
            <CardDescription>Анализ групповой динамики и советы по навигации</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.social_compass ? (
              <>
                <div className="bg-muted/30 rounded-lg p-4 border border-neon-purple/10">
                  <h4 className="text-sm font-medium mb-1">Групповая динамика:</h4>
                  <p className="text-sm">{data.social_compass.group_dynamics}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Внутренние круги:</h4>
                  <div className="flex flex-col gap-2">
                    {data.social_compass.inner_circles?.map((circle, index) => (
                      <div 
                        key={index} 
                        className="bg-muted/20 rounded-lg p-3 border border-neon-blue/10 relative"
                        style={{
                          marginLeft: `${index * 12}px`,
                          width: `calc(100% - ${index * 12}px)`,
                        }}
                      >
                        <p className="text-sm">{circle}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <h4 className="text-sm font-medium mb-2">Советы по навигации:</h4>
                  <ul className="space-y-1">
                    {data.social_compass.navigation_tips?.map((tip, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-neon-purple mr-2">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Данные социального компаса недоступны
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}
