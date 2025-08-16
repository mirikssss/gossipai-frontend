import type React from "react"
import type { Metadata } from "next"
import { Wix_Madefor_Display } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const wixMadefor = Wix_Madefor_Display({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-wix-madefor",
})

export const metadata: Metadata = {
  title: "GossipAI - Понимайте разговоры как никогда раньше",
  description: "ИИ-анализ, который раскрывает эмоции, тонкости и скрытый смысл в ваших чатах.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={wixMadefor.variable}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
