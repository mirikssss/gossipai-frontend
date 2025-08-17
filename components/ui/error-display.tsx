"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
  title?: string
  description?: string
}

export function ErrorDisplay({ 
  error, 
  onRetry, 
  title = "Произошла ошибка", 
  description = "Не удалось загрузить данные. Попробуйте еще раз." 
}: ErrorDisplayProps) {
  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <CardTitle className="text-red-700">{title}</CardTitle>
        </div>
        <CardDescription className="text-red-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md bg-red-100 p-3">
            <p className="text-sm text-red-800 font-mono break-all">
              {error}
            </p>
          </div>
          
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Попробовать снова
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
