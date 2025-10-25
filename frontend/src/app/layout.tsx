import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { EB_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  weight: ["400", "500", "600", "700"],
})
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import QueryProvider from "@/components/providers/QueryProvider"
import { SessionProvider } from "@/contexts/SessionContext"
import "@/styles/globals.css"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://llm-lab.vercel.app"),
  title: {
    default: "LLM Lab - AI Response Quality Analyzer",
    template: "%s | LLM Lab"
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/icon-192.svg',
  },
  description: "Experiment with LLM parameters and analyze response quality. Generate multiple responses with different temperature and top_p settings, compare results, and understand how parameters affect AI output.",
  keywords: [
    "LLM",
    "AI",
    "Large Language Model",
    "Temperature",
    "Top P",
    "Response Quality",
    "AI Experimentation",
    "Parameter Testing",
    "Quality Metrics",
    "AI Analysis"
  ],
  authors: [{ name: "LLM Lab" }],
  creator: "LLM Lab",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://llm-lab.vercel.app",
    siteName: "LLM Lab - AI Response Quality Analyzer",
    title: "LLM Lab - AI Response Quality Analyzer",
    description: "Experiment with LLM parameters and analyze response quality. Compare AI outputs with different settings.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LLM Lab - AI Response Quality Analyzer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM Lab - AI Response Quality Analyzer",
    description: "Experiment with LLM parameters and analyze response quality. Compare AI outputs with different settings.",
    images: ["/og-image.png"],
    creator: "@llmlab"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    }
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "https://llm-lab.vercel.app"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${ebGaramond.variable}`}>
      <body className={`${GeistSans.className} bg-background overflow-x-hidden antialiased`} suppressHydrationWarning>
        <SessionProvider>
          <QueryProvider>
            <TooltipProvider>
              {children}
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </QueryProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}