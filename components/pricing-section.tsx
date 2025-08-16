"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { motion } from "framer-motion"

const plans = [
  {
    name: "Бесплатный",
    price: "0",
    description: "Для знакомства с возможностями",
    features: ["5 анализов в месяц", "Базовый анализ эмоций", "Простые инсайты", "Поддержка по email"],
    popular: false,
  },
  {
    name: "Про",
    price: "990",
    description: "Для активных пользователей",
    features: [
      "Безлимитные анализы",
      "Продвинутый ИИ-анализ",
      "История всех анализов",
      "API доступ",
      "Приоритетная поддержка",
      "Экспорт результатов",
    ],
    popular: true,
  },
  {
    name: "Команда",
    price: "2990",
    description: "Для команд и бизнеса",
    features: [
      "Все возможности Про",
      "Командные аналитики",
      "Интеграции с CRM",
      "Персональный менеджер",
      "Кастомные настройки",
      "SLA 99.9%",
    ],
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32">
      <div className="container px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Выберите свой{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
              тарифный план
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Начните бесплатно, масштабируйтесь по мере роста
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className={`h-full relative ${
                  plan.popular ? "border-neon-purple/40 glow-purple bg-card/80" : "border-border/40 bg-card/50"
                } backdrop-blur transition-all duration-300 hover:border-neon-blue/40`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-neon-purple to-neon-blue text-white px-4 py-1 rounded-full text-sm font-medium glow-purple">
                      Популярный
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">₽{plan.price}</span>
                    <span className="text-muted-foreground">/месяц</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-neon-turquoise flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-neon-purple to-neon-blue glow-purple hover:glow-blue"
                        : "bg-secondary hover:bg-secondary/80"
                    } transition-all duration-300`}
                    size="lg"
                  >
                    {plan.price === "0" ? "Начать бесплатно" : "Выбрать план"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
