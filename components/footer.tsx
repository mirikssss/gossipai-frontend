import { Button } from "@/components/ui/button"
import { Github, Twitter, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue glow-purple" />
              <span className="text-xl font-bold text-neon-purple">GossipAI</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              ИИ-анализ разговоров для понимания эмоций и скрытых смыслов
            </p>
          </div>

          <div className="px-0">
            <h3 className="font-semibold mb-4">Продукт</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-neon-blue transition-colors">
                  Возможности
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-neon-blue transition-colors">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-neon-blue transition-colors">
                  Документация
                </a>
              </li>
            </ul>
          </div>

          

          
        </div>

        <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2024 GossipAI. Все права защищены.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button variant="ghost" size="sm">
              <Github className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Twitter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Mail className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
