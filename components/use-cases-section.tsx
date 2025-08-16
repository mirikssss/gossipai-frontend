"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export function UseCasesSection() {
  const useCases = [
    {
      title: "Подростки",
      description: "Хотят понять, как они звучат в переписках",
      icon: "👥",
      buttonColor: "bg-slate-500",
      details: ["Анализ тона сообщений", "Понимание восприятия", "Советы по общению"],
    },
    {
      title: "HR и рекрутеры",
      description: "Анализируют коммуникацию кандидатов",
      icon: "💼",
      buttonColor: "bg-blue-500",
      details: ["Оценка soft skills", "Анализ интервью", "Объективные метрики"],
    },
    {
      title: "Пары",
      description: "Решают конфликты и учатся слышать друг друга",
      icon: "💕",
      buttonColor: "bg-emerald-500",
      details: ["Разбор конфликтов", "Улучшение понимания", "Гармония в отношениях"],
    },
  ]

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-slate-100 to-blue-100/60 text-slate-600 text-sm font-medium mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Применение
          </motion.div>
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Кто использует{" "}
            <span className="bg-gradient-to-r from-slate-500 to-blue-400 bg-clip-text text-cyan-500">GossipAI</span>
          </motion.h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Наш ИИ помогает разным людям лучше понимать общение и улучшать свои навыки
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                y: -15,
                scale: 1.03,
                transition: { duration: 0.3, type: "spring", stiffness: 300 },
              }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-transparent border-2 border-border/20 hover:border-border/40 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <motion.div
                      className="text-5xl mb-4"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      {useCase.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{useCase.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{useCase.description}</p>
                  </div>

                  <div className="space-y-3">
                    {useCase.details.map((detail, detailIndex) => (
                      <motion.div
                        key={detailIndex}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + detailIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <motion.div
                          className={`w-2 h-2 rounded-full ${useCase.buttonColor}`}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: detailIndex * 0.3 }}
                        ></motion.div>
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-border/50">
                    <motion.div
                      className={`text-xs font-medium py-2 px-4 rounded-full text-white text-center ${useCase.buttonColor} hover:opacity-90 transition-opacity cursor-pointer`}
                      whileHover={{
                        scale: 1.05,
                        y: -2,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      Попробовать бесплатно
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
