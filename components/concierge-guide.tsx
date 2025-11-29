// kahane-dashboard-concierge 2/components/concierge-guide.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"
import { TutorialModal } from "@/components/tutorial-modal"
import { TourGuide } from "@/components/tour-guide"
import { ConciergeHelpModal } from "@/components/concierge-help-modal" // Importiere das dedizierte Help Modal
import { useTranslation } from "@/lib/i18n"
import { useSettings } from "@/lib/settings-context"


const TUTORIAL_SEEN_KEY = "kahane-simulation-tutorial-seen"
const TOUR_ACTIVE_KEY = "is_tour_active" // Schlüssel für die persistente Tour-Aktivität

// NEU: Diese Komponente steuert die gesamte Concierge-Logik im Hintergrund
export function ConciergeController() {
  const [showTutorial, setShowTutorial] = useState(false) 
  const [showGuidedTour, setShowGuidedTour] = useState(false) 
  const [showHelpModal, setShowHelpModal] = useState(false) 
  const { language } = useSettings()
  const pathname = usePathname();

  // --- INIT: Modal nur beim ersten Besuch zeigen & Tour-Status wiederherstellen ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
        // 1. Tutorial anzeigen (nur auf /simulation und wenn nie gesehen)
        const tutorialSeen = sessionStorage.getItem(TUTORIAL_SEEN_KEY)
        if (!tutorialSeen && pathname === "/simulation") {
            setTimeout(() => setShowTutorial(true), 500); 
        }
        
        // 2. TOUR WIEDERHERSTELLUNG (nach Navigation oder F5)
        // Muss hier nach dem Tutorial-Check erfolgen
        const tourActiveStorage = localStorage.getItem(TOUR_ACTIVE_KEY);
        if (tourActiveStorage === "true") {
            // Nur die Tour aktivieren, wenn sie wirklich aktiv sein sollte (im Hintergrund weiterlaufen)
            if (!showTutorial) { 
               setShowGuidedTour(true);
            }
        }
    }
  }, [pathname]) 

  // --- Event Listener für Sidebar/Header-Klick ---
  useEffect(() => {
    const handleStartIntro = () => {
        // Bei manuellem Start (z.B. Logo-Klick): Jede laufende Tour beenden, Speicher löschen und Tutorial zeigen.
        if (showGuidedTour) {
            setShowGuidedTour(false);
            localStorage.removeItem(TOUR_ACTIVE_KEY);
        }
        setShowTutorial(true);
    }

    const handleBellClick = () => {
        // Bell-Klick: Wenn keine Tour läuft, zeige den Help Modal.
        if (!showGuidedTour && !showTutorial) {
            setShowHelpModal(true);
        }
    }

    window.addEventListener('startConciergeIntro', handleStartIntro);
    window.addEventListener('bellClick', handleBellClick);
    
    return () => {
        window.removeEventListener('startConciergeIntro', handleStartIntro);
        window.removeEventListener('bellClick', handleBellClick);
    }
  }, [showGuidedTour, showTutorial])

  // --- Tour-Handler ---
  const handleStartGuidedTour = () => {
    setShowTutorial(false)
    setShowGuidedTour(true)
    // Persistieren des aktiven Tour-Status für die Dauer der Tour
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(TUTORIAL_SEEN_KEY, "true")
        localStorage.setItem(TOUR_ACTIVE_KEY, "true"); 
    }
  }
  
  const handleTourComplete = () => {
    setShowGuidedTour(false)
    // HIER IST DIE KORREKTUR: Entferne den aktiven Status, wenn die Tour abgeschlossen ist.
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOUR_ACTIVE_KEY); 
        // WICHTIG: Setze den Tour-Schritt-Cache zurück
        localStorage.removeItem("activeTourStep"); 
    }
  }
  
  const handleCloseTutorial = () => {
    setShowTutorial(false)
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(TUTORIAL_SEEN_KEY, "true")
    }
  }

  // Bestimmen des Kontextes für die on-demand Hilfe
  const helpContext = useMemo(() => {
      if (pathname.includes("/simulation")) return "simulation";
      if (pathname.includes("/market")) return "market";
      if (pathname.includes("/contact")) return "contact";
      return "simulation"; 
  }, [pathname]);


  return (
    <>
      {/* 1. TUTORIAL MODAL (Intro) */}
      {showTutorial && (
          <TutorialModal 
            onClose={handleCloseTutorial} 
            onStartTour={handleStartGuidedTour} 
          />
      )}
      
      {/* 2. GEFÜHRTE TOUR (Über Seiten hinweg persistent) */}
      <TourGuide 
        isActive={showGuidedTour} 
        onComplete={handleTourComplete} 
      />

      {/* 3. CONCIERGE HELP MODAL (On-Demand Glocke) */}
      {showHelpModal && (
          <ConciergeHelpModal 
            context={helpContext}
            isOpen={showHelpModal}
            onClose={() => setShowHelpModal(false)}
          />
      )}
    </>
  )
}