import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  title: string
  description: string
  icon: string
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <Card className="bg-card/30 backdrop-blur border-dashed border-border/40">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-md">{description}</p>
      </CardContent>
    </Card>
  )
}
