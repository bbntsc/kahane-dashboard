"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { X, ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConciergeGuideProps {
  onClose: () => void
}

// Definition der Touren pro Seite
const pageGuides: Record<string, { title: string; text: string }[]> = {
  "/simulation": [
    {
      title: "Willkommen in der Simulation",
      text: "Hier können Sie Ihre finanzielle Zukunft planen. Dieser Bereich hilft Ihnen zu verstehen, wie sich Ihr Vermögen entwickeln könnte.",
    },
    {
      title: "Parameter anpassen",
      text: "Nutzen Sie die Schieberegler auf der linken Seite. Ändern Sie den Anlagebetrag oder die monatliche Sparrate und sehen Sie sofort den Effekt.",
    },
    {
      title: "Szenarien verstehen",
      text: "Das Diagramm zeigt drei Kurven: Ein optimistisches, ein realistisches und ein vorsichtiges Szenario basierend auf historischen Marktdaten.",
    },
  ],
  "/market": [
    {
      title: "Historische Marktdaten",
      text: "Lernen Sie aus der Vergangenheit. Hier sehen Sie, wie sich Märkte über Jahrzehnte entwickelt haben.",
    },
    {
      title: "Krisen verstehen",
      text: "Klicken Sie auf die roten Punkte im Chart. Wir erklären Ihnen genau, was in Krisenjahren passiert ist und wie sich der Markt erholt hat.",
    },
  ],
  "/portfolio": [
    {
      title: "Ihr Portfolio Überblick",
      text: "Hier sehen Sie Ihre aktuelle Vermögensaufteilung (Asset Allocation) auf einen Blick.",
    },
  ],
  // Fallback für alle anderen Seiten (z.B. Dashboard /)
  "default": [
    {
      title: "Ihr persönlicher Concierge",
      text: "Schön, dass Sie da sind! Klicken Sie jederzeit auf die Glocke, wenn Sie Hilfe zu der Seite benötigen, auf der Sie sich gerade befinden.",
    },
    {
      title: "Navigation",
      text: "Über das Menü links erreichen Sie alle wichtigen Bereiche: Simulation, Marktanalyse und Ihr Portfolio.",
    },
  ]
}

export function ConciergeGuide({ onClose }: ConciergeGuideProps) {
  const pathname = usePathname()
  const [currentStep, setCurrentStep] = useState(0)
  
  // Wähle die passenden Schritte basierend auf der URL, sonst Default
  const steps = pageGuides[pathname] || pageGuides["default"]
  const currentContent = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      onClose()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  return (
    // Overlay Container (fixed, unten rechts positioniert)
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-end sm:items-end sm:justify-end p-4 sm:p-8">
      
      {/* Hintergrund-Dimmer (optional, aktuell auskommentiert, falls du den User weiter klicken lassen willst) */}
      {/* <div className="absolute inset-0 bg-black/20 pointer-events-auto" onClick={onClose} /> */}

      <div className="relative pointer-events-auto flex flex-col items-end animate-in slide-in-from-bottom-10 fade-in duration-500">
        
        {/* --- SPRECHBLASE --- */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full mb-4 relative border border-[#ede9e1]">
          {/* Schließen X */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Inhalt */}
          <div className="pr-6">
            <h3 className="text-lg font-serif font-bold text-[#1b251d] mb-2">
              {currentContent.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {currentContent.text}
            </p>
          </div>

          {/* Footer: Steps & Button */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">
              Schritt {currentStep + 1} von {steps.length}
            </span>

            <button
              onClick={handleNext}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all",
                isLastStep 
                  ? "bg-[#1b251d] text-white hover:bg-gray-800" 
                  : "bg-[#ebf151] text-[#1b251d] hover:bg-[#d9df47]"
              )}
            >
              {isLastStep ? "Tour beenden" : "Weiter"}
              {isLastStep ? <Check className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
            </button>
          </div>

          {/* Kleines Dreieck unten rechts (Sprechblasen-Nippel) */}
          <div className="absolute -bottom-2 right-12 w-4 h-4 bg-white border-b border-r border-[#ede9e1] rotate-45 transform"></div>
        </div>

        {/* --- CHARAKTER (2.svg) --- */}
        <div className="relative w-24 h-48 mr-8"> {/* Größe anpassen je nach SVG */}
          <Image
            src="/images/2.svg" 
            alt="Concierge"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>

      </div>
    </div>
  )
}
