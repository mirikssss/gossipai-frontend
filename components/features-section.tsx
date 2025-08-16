"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Heart, TrendingUp, Shield } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Heart,
    title: "Анализ разговоров",
    description: "ИИ определяет эмоции, тон и подтекст в ваших сообщениях",
    color: "neon-purple",
  },
  {
    icon: Shield,
    title: "ИИ-судья",
    description: "Объективная оценка качества и эффективности общения",
    color: "neon-blue",
  },
  {
    icon: TrendingUp,
    title: "Временная шкала эмоций",
    description: "Отслеживайте, как меняются эмоции в ходе разговора",
    color: "neon-turquoise",
  },
  {
    icon: Brain,
    title: "Умные инсайты",
    description: "Выявляет паттерны и риски в ваших коммуникациях",
    color: "neon-purple",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Возможности{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue bg-gray-200">
              GossipAI
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Превратите обычный текст в мощные инсайты за секунды
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              viewport={{ once: true }}
            >
              <Card
                className={`h-full bg-card/50 backdrop-blur border-${feature.color}/20 hover:border-${feature.color}/40 transition-all duration-300 group hover:glow-purple hover:shadow-xl hover:shadow-${feature.color}/10`}
              >
                <CardHeader>
                  <motion.div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${feature.color} to-${feature.color}/60 flex items-center justify-center mb-4 group-hover:glow-${feature.color.split("-")[1]} transition-all duration-300`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
