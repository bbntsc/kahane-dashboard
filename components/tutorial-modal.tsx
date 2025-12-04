"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ArrowRight, Compass } from "lucide-react"
import { useSettings } from "@/lib/settings-context" // NEU
import { useTranslation } from "@/lib/i18n" // NEU

interface TutorialModalProps {
  onClose: () => void      
  onStartTour: () => void 
}

export function TutorialModal({ onClose, onStartTour }: TutorialModalProps) {
  const [isVisible, setIsVisible] = useState(true)
  
  // NEU: Lokalisierung
  const { language } = useSettings()
  const t = useTranslation(language)

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) 
  }

  const handleTour = () => {
    setIsVisible(false)
    setTimeout(onStartTour, 300)
  }

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Dunkler Hintergrund */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={handleClose}
      />

      {/* Das Modal */}
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row transition-all duration-500 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}>
        
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Linke Seite: Der Concierge (Animiert) */}
        <div className="w-full md:w-2/5 bg-[#f8f3ef] relative min-h-[300px] md:min-h-full flex items-end justify-center pt-10">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#ebf151]/20 rounded-full blur-3xl"></div>
           
           {/* HIER WIRD DIE GRÖSSE ANGEPASST */}
           <div className="relative w-56 h-72 md:w-72 md:h-96 transition-transform duration-700 hover:scale-105 animate-float">
             <Image 
               src="/images/2.svg" // KORREKTUR: Bild auf 2.svg geändert
               alt={t.concierge.tutorialTitle} // Alt-Text übersetzt
               fill
               className="object-contain object-bottom drop-shadow-xl"
               priority
             />
           </div>
        </div>

        {/* Rechte Seite: Text & Auswahl */}
        <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
          <span className="inline-block px-3 py-1 rounded-full bg-[#f8f3ef] text-[#1b251d] text-xs font-semibold tracking-wider uppercase mb-4 w-fit mx-auto md:mx-0">
            {t.concierge.tutorialWelcome}
          </span>
          
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1b251d] mb-4 leading-tight">
            {t.concierge.tutorialTitle}
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed text-lg">
            {t.concierge.tutorialBody}
          </p>

          {/* Der neue Hinweis zur Glocke */}
          <p className="text-gray-500 text-sm mb-8 italic">
            {t.concierge.tutorialHint}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={handleTour}
              className="group flex items-center justify-center gap-2 px-6 py-4 bg-[#1b251d] text-white rounded-xl hover:bg-[#2a382c] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>{t.concierge.tutorialStart}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleClose}
              className="group flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <Compass className="h-4 w-4" />
              <span>{t.concierge.tutorialExplore}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}