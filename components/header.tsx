"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue glow-purple" />
          <span className="text-xl font-bold text-neon-purple">GossipAI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium hover:text-neon-blue transition-colors">
            Возможности
          </a>
          <a href="#about" className="text-sm font-medium hover:text-neon-blue transition-colors">
            О нас
          </a>
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Войти
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-neon-purple to-neon-blue glow-purple hover:glow-blue transition-all duration-300">
              Начать бесплатно
            </Button>
          </Link>
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <nav className="container mx-auto max-w-7xl px-4 py-4 space-y-4">
            <a href="#features" className="block text-sm font-medium hover:text-neon-blue transition-colors">
              Возможности
            </a>
            <a href="#about" className="block text-sm font-medium hover:text-neon-blue transition-colors">
              О нас
            </a>
            <div className="flex flex-col space-y-2 pt-4">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="w-full">
                  Войти
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-neon-purple to-neon-blue glow-purple w-full">
                  Начать бесплатно
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
