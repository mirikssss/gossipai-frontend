"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-background to-neon-blue/10" />

      <div className="container mx-auto max-w-7xl relative px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Понимайте разговоры{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
              как никогда раньше
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            ИИ-анализ, который раскрывает эмоции, тонкости и скрытый смысл в ваших чатах.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/register">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-neon-purple to-neon-blue glow-purple hover:glow-blue transition-all duration-300 text-lg px-8 py-6 hover:shadow-lg hover:shadow-neon-purple/25"
                >
                  Попробовать демо
                </Button>
              </motion.div>
            </Link>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-neon-blue text-neon-blue hover:bg-neon-blue/10 text-lg px-8 py-6 bg-transparent hover:shadow-lg hover:shadow-neon-blue/25 transition-all duration-300"
              >
                Как это работает
              </Button>
            </motion.div>
          </motion.div>

          {/* Demo Chat Animation */}
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="p-6 bg-card/50 backdrop-blur border-neon-purple/20 glow-purple">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-turquoise" />
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-3 text-left">
                      <p className="text-sm">Привет! Как дела? 😊</p>
                    </div>
                    <div className="mt-2 text-xs text-neon-turquoise">
                      <Sparkles className="inline w-3 h-3 mr-1" />
                      Эмоция: Радость (85%) • Тон: Дружелюбный
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 justify-end">
                  <div className="flex-1">
                    <div className="bg-neon-purple/20 rounded-lg p-3 text-right ml-12">
                      <p className="text-sm">Все хорошо, спасибо за вопрос</p>
                    </div>
                    <div className="mt-2 text-xs text-neon-blue text-right">
                      <Brain className="inline w-3 h-3 mr-1" />
                      Скрытый смысл: Формальная вежливость, дистанция
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
