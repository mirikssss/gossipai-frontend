"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { motion } from "framer-motion"

interface PresetCardProps {
  preset: {
    id: string
    name: string
    description: string
    color: string
    icon: string
  }
  isSelected?: boolean
  onSelect?: () => void
}

export function PresetCard({ preset, isSelected = false, onSelect }: PresetCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        className={`transition-all duration-300 cursor-pointer ${
          isSelected
            ? `border-${preset.color}/40 bg-${preset.color}/10`
            : "border-border/40 bg-card/50 hover:border-neon-blue/40"
        } backdrop-blur`}
        onClick={onSelect}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                className="text-2xl"
                animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {preset.icon}
              </motion.div>
              <div>
                <CardTitle className="text-lg">{preset.name}</CardTitle>
              </div>
            </div>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="w-6 h-6 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm">{preset.description}</CardDescription>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={`mt-4 w-full ${
                isSelected
                  ? "bg-gradient-to-r from-neon-purple to-neon-blue"
                  : "border-neon-blue/20 hover:bg-neon-blue/10"
              } transition-all duration-300`}
            >
              {isSelected ? "Выбрано" : "Выбрать"}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
