"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

export function ShowcaseSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-neon-purple/5 via-background to-neon-blue/5">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            От сырого текста к{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
              мощным инсайтам
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            за секунды
          </motion.p>
        </div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-card/50 backdrop-blur border-neon-purple/20 glow-purple">
            <div className="aspect-video bg-gradient-to-br from-neon-purple/10 to-neon-blue/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue glow-purple flex items-center justify-center">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Панель анализа</h3>
                <p className="text-muted-foreground">Интерактивная демонстрация будет здесь</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
