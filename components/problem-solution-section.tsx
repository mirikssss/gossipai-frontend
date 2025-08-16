"use client"

import { motion } from "framer-motion"

export function ProblemSolutionSection() {
  return (
    <>
      {/* Problem Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Проблема
            </motion.div>
            <motion.h2
              className="text-3xl lg:text-5xl font-bold text-foreground leading-tight"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Миллионы людей остаются <span className="text-red-500">недопонятыми</span>
            </motion.h2>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Сегодня миллионы людей тратят часы на общение, но остаются недопонятыми. Подростки ищут подтверждение, HR
              анализируют soft skills, пары спорят из-за недопонимания. Но объективно оценить качество разговора сложно.
            </p>
            <div className="flex justify-center items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Недопонимание</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Конфликты</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Потерянное время</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Наше решение
            </motion.div>
            <motion.h2
              className="text-3xl lg:text-5xl font-bold text-foreground leading-tight"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Умный <span className="text-lime-500">собеседник-наблюдатель</span>
            </motion.h2>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              GossipAI — ваш умный собеседник-наблюдатель. Он анализирует разговор, выделяет эмоции, показывает слабые и
              сильные стороны общения и дает конкретные советы для улучшения.
            </p>
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {[
                {
                  bg: "bg-blue-50",
                  border: "border-blue-200",
                  text: "text-blue-600",
                  textSm: "text-blue-700",
                  content: "AI",
                  desc: "Анализ эмоций",
                },
                {
                  bg: "bg-purple-50",
                  border: "border-purple-200",
                  text: "text-purple-600",
                  textSm: "text-purple-700",
                  content: "📊",
                  desc: "Объективная оценка",
                },
                {
                  bg: "bg-green-50",
                  border: "border-green-200",
                  text: "text-green-600",
                  textSm: "text-green-700",
                  content: "💡",
                  desc: "Советы по улучшению",
                },
                {
                  bg: "bg-orange-50",
                  border: "border-orange-200",
                  text: "text-orange-600",
                  textSm: "text-orange-700",
                  content: "⚡",
                  desc: "Быстрый результат",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-lg ${item.bg} border ${item.border} cursor-pointer`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  viewport={{ once: true }}
                >
                  <div className={`text-2xl font-bold ${item.text}`}>{item.content}</div>
                  <div className={`text-sm ${item.textSm}`}>{item.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
