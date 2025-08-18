"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RefreshCcw, Heart, Users } from "lucide-react"
import { motion } from "framer-motion"

interface FamilyBalanceCardsProps {
  data: {
    preset_validation?: {
      is_valid: boolean;
      reason: string;
    };
    communication_cycles?: {
      patterns?: string[];
      trigger_points?: string[];
      interruption_techniques?: string[];
    };
    needs_map?: {
      expressed_needs?: string[];
      unexpressed_needs?: string[];
      overlap_areas?: string[];
    };
    family_roles?: {
      role_distribution?: string[];
      responsibility_balance?: number;
      recommendations?: string[];
    };
  }
}

export function FamilyBalanceCards({ data }: FamilyBalanceCardsProps) {
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
              <RefreshCcw className="w-5 h-5" />
              <span>Пресет не подходит для данного диалога</span>
            </CardTitle>
            <CardDescription className="text-red-300">
              {data.preset_validation.reason}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-muted-foreground py-8">
              <p className="mb-4">Выбранный пресет "Семейный Баланс" предназначен для анализа семейной коммуникации.</p>
              <p>Попробуйте выбрать другой пресет или загрузить диалог, содержащий семейную тематику.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <>
      {/* Communication Cycles Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="bg-card/50 backdrop-blur border-neon-turquoise/20 h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <RefreshCcw className="w-5 h-5 text-neon-turquoise" />
              <span>Коммуникационные циклы</span>
            </CardTitle>
            <CardDescription>Повторяющиеся паттерны коммуникации</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.communication_cycles ? (
              <>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Паттерны коммуникации:</h4>
                  <div className="space-y-2">
                    {data.communication_cycles.patterns && data.communication_cycles.patterns.length > 0 ? (
                      data.communication_cycles.patterns.map((pattern, index) => (
                        <div key={index} className="bg-muted/30 rounded-lg p-3 border border-neon-turquoise/10">
                          <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-r from-neon-turquoise/20 to-neon-blue/20">
                              <span className="text-sm font-bold">{index + 1}</span>
                            </div>
                            <p className="text-sm">{pattern}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-2">
                        Паттерны не обнаружены
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-3 border-t border-border/40 space-y-3">
                  <h4 className="text-sm font-medium">Точки триггера:</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.communication_cycles.trigger_points?.map((trigger, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-3 border-t border-border/40">
                  <h4 className="text-sm font-medium mb-2">Техники прерывания циклов:</h4>
                  <ul className="space-y-1">
                    {data.communication_cycles.interruption_techniques?.map((technique, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-neon-turquoise mr-2">•</span>
                        <span>{technique}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Данные о коммуникационных циклах недоступны
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Needs Map Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Card className="bg-card/50 backdrop-blur border-neon-turquoise/20 h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-neon-turquoise" />
              <span>Карта потребностей</span>
            </CardTitle>
            <CardDescription>Анализ выраженных и невыраженных потребностей</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.needs_map ? (
              <>
                <div className="space-y-3">
                  <div className="bg-muted/30 rounded-lg p-3 border border-neon-turquoise/10">
                    <h4 className="text-sm font-medium mb-2">Выраженные потребности:</h4>
                    <ul className="space-y-1">
                      {data.needs_map.expressed_needs?.map((need, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-neon-turquoise mr-2">✓</span>
                          <span>{need}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-3 border border-neon-turquoise/10">
                    <h4 className="text-sm font-medium mb-2">Невыраженные потребности:</h4>
                    <ul className="space-y-1">
                      {data.needs_map.unexpressed_needs?.map((need, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-neon-turquoise/60 mr-2">○</span>
                          <span>{need}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-border/40">
                  <h4 className="text-sm font-medium mb-2">Зоны пересечения:</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.needs_map.overlap_areas?.map((area, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-neon-turquoise/40 text-neon-turquoise">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Карта потребностей недоступна
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Family Roles Card - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="col-span-2"
      >
        <Card className="bg-card/50 backdrop-blur border-neon-turquoise/20 h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-neon-turquoise" />
              <span>Семейные роли</span>
            </CardTitle>
            <CardDescription>Анализ распределения ролей в семейной динамике</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.family_roles ? (
              <>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Распределение ролей:</h4>
                  <ul className="space-y-1">
                    {data.family_roles.role_distribution?.map((role, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-neon-turquoise mr-2">•</span>
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-3 border-t border-border/40 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Баланс ответственности:</span>
                    <span className="font-medium">{data.family_roles.responsibility_balance}%</span>
                  </div>
                  <Progress value={data.family_roles.responsibility_balance} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    {(data.family_roles.responsibility_balance || 0) < 30 ? 'Несбалансированное распределение' : 
                     (data.family_roles.responsibility_balance || 0) < 70 ? 'Умеренно сбалансированное распределение' : 
                     'Хорошо сбалансированное распределение'}
                  </p>
                </div>
                
                <div className="pt-3 border-t border-border/40">
                  <h4 className="text-sm font-medium mb-2">Рекомендации:</h4>
                  <ul className="space-y-1">
                    {data.family_roles.recommendations?.map((recommendation, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-neon-turquoise mr-2">•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Данные о семейных ролях недоступны
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}
