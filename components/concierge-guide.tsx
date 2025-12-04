// components/concierge-guide.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"
import { TutorialModal } from "@/components/tutorial-modal"
// KORREKTUR: Export ALL_TOUR_STEPS
import { TourGuide, ALL_TOUR_STEPS } from "@/components/tour-guide" 
import { useSettings } from "@/lib/settings-context" 
// import { ConciergeHelpModal } from "@/components/concierge-help-modal" // Wird nicht mehr benötigt


const TUTORIAL_SEEN_KEY = "kahane-simulation-tutorial-seen"
const TOUR_ACTIVE_KEY = "is_tour_active" // Schlüssel für die persistente Tour-Aktivität

/**
 * Findet den Startindex in der ALL_TOUR_STEPS Liste basierend auf dem aktuellen Pfad.
 */
const getStartingStepIndex = (pathname: string): number => {
    // Finde den ersten Schritt in ALL_TOUR_STEPS, dessen Pfad mit dem aktuellen pathname übereinstimmt.
    const index = ALL_TOUR_STEPS.findIndex(step => pathname.startsWith(step.path || "/") && (pathname === step.path || (step.path !== "/" && pathname.includes(step.path))));

    // Wenn kein spezifischer Schritt gefunden wird, starte bei 0 (Willkommen)
    return index !== -1 ? index : 0; 
}


// NEU: Diese Komponente steuert die gesamte Concierge-Logik im Hintergrund
// KORREKTUR: Export hinzufügen
export function ConciergeController() {
  const [showTutorial, setShowTutorial] = useState(false) 
  const [showGuidedTour, setShowGuidedTour] = useState(false) 
  const [currentTourStep, setCurrentTourStep] = useState(0) 
  const [isContextualTour, setIsContextualTour] = useState(false); // Zustand für den kontextuellen Modus
  // 1. KORREKTUR: Standardbild auf 2.svg gesetzt (für volle Tour)
  const [conciergeImage, setConciergeImage] = useState("/images/2.svg"); 
  
  const { language } = useSettings()
  const pathname = usePathname();

  // --- INIT: Modal nur beim ersten Besuch zeigen & Tour-Status wiederherstellen ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
        
        const tutorialSeen = sessionStorage.getItem(TUTORIAL_SEEN_KEY)
        const isSimulationPage = pathname === "/simulation" || pathname === "/"; 
        
        // 1. Tutorial anzeigen (nur auf /simulation und wenn nie gesehen)
        if (!tutorialSeen && isSimulationPage) {
            // WICHTIG: Wenn Tutorial gezeigt wird, muss die persistente Tour abgebrochen werden.
            localStorage.removeItem(TOUR_ACTIVE_KEY); 
            setTimeout(() => setShowTutorial(true), 500); 
            return; // Beende, um die Tour-Wiederherstellung unten zu verhindern
        }
        
        // 2. TOUR WIEDERHERSTELLUNG (nach Navigation oder F5)
        const tourActiveStorage = localStorage.getItem(TOUR_ACTIVE_KEY);
        
        if (tourActiveStorage === "true") { 
            // Wenn Tour aktiv, setze den Startschritt basierend auf dem aktuellen Pfad
            const startingIndex = getStartingStepIndex(pathname);
            setCurrentTourStep(startingIndex);
            setIsContextualTour(false); 
            // KORREKTUR: Für die PERSISTENTE VOLLE TOUR MUSS 2.svg verwendet werden
            setConciergeImage("/images/2.svg"); 
            // Aktiviere die geführte Tour nur hier, wenn KEIN Tutorial gezeigt werden muss.
            setShowGuidedTour(true); 
        }
    }
  }, [pathname]) 

  // --- Event Listener für Sidebar/Header-Klick ---
  useEffect(() => {
    const handleStartIntro = () => {
        // Logo-Klick: Volle Führung
        if (showGuidedTour) {
            handleTourComplete(); // Stoppt die aktuelle Tour
        }
        setIsContextualTour(false);
        // 3. KORREKTUR: Der INTRO-Klick soll das Bild 2.svg verwenden.
        setConciergeImage("/images/2.svg"); 
        setCurrentTourStep(0);
        setShowTutorial(true);
    }

    const handleBellClick = () => {
        // Bell-Klick: Kontextuelle Hilfe
        const startingIndex = getStartingStepIndex(pathname);
        
        // Tour starten und alle anderen Modals/Guides schließen
        setShowTutorial(false);
        // 2. KORREKTUR: Der GLOCKEN-Klick soll das Bild 1.svg verwenden.
        handleStartGuidedTour(startingIndex, true, "/images/1.svg"); 
    }

    window.addEventListener('startConciergeIntro', handleStartIntro);
    window.addEventListener('bellClick', handleBellClick);
    
    return () => {
        window.removeEventListener('startConciergeIntro', handleStartIntro);
        window.removeEventListener('bellClick', handleBellClick);
    }
  }, [showGuidedTour, pathname])


  // --- Tour-Handler ---
  // Parameter imagePath hinzugefügt
  // 4. KORREKTUR: Default imagePath auf 2.svg gesetzt
  const handleStartGuidedTour = (initialIndex: number = 0, contextual: boolean = false, imagePath: string = "/images/2.svg") => { 
    setShowTutorial(false);
    setCurrentTourStep(initialIndex); // Setze den Startindex
    setIsContextualTour(contextual); // Setze den Modus
    setConciergeImage(imagePath); // Setze das Bild
    setShowGuidedTour(true);
    
    // Nur die volle Tour wird im Local Storage gespeichert
    if (!contextual && typeof window !== 'undefined') {
        sessionStorage.setItem(TUTORIAL_SEEN_KEY, "true")
        localStorage.setItem(TOUR_ACTIVE_KEY, "true"); 
        // KORREKTUR: Die persistente Tour (Intro) nutzt immer 2.svg.
        setConciergeImage("/images/2.svg");
    }
  }
  
  const handleTourComplete = () => {
    setShowGuidedTour(false)
    setIsContextualTour(false); // Setze Modus zurück
    // KORREKTUR: Setze das Bild zurück auf den Standard (volle Tour) 2.svg
    setConciergeImage("/images/2.svg"); 
    
    // Entferne den aktiven Status, wenn die Tour abgeschlossen ist.
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOUR_ACTIVE_KEY); 
        // WICHTIG: Setze den Tour-Schritt-Cache zurück
        localStorage.removeItem("activeTourStep"); 
    }
  }
  
  const handleCloseTutorial = () => {
    setShowTutorial(false)
    if (typeof window !== 'undefined') {
        // Wenn der Nutzer "Selbst erkunden" wählt, markiere das Tutorial als gesehen, starte aber keine Tour.
        sessionStorage.setItem(TUTORIAL_SEEN_KEY, "true")
    }
  }

  return (
    <>
      {/* 1. TUTORIAL MODAL (Intro) */}
      {showTutorial && (
          <TutorialModal 
            onClose={handleCloseTutorial} 
            // KORREKTUR: Startet die Tour mit 2.svg
            onStartTour={() => handleStartGuidedTour(0, false, "/images/2.svg")} 
          />
      )}
      
      {/* 2. GEFÜHRTE TOUR (Über Seiten hinweg persistent) */}
      <TourGuide 
        isActive={showGuidedTour} 
        onComplete={handleTourComplete} 
        initialStep={currentTourStep} 
        isContextual={isContextualTour} 
        conciergeImage={conciergeImage} // Übergibt den dynamischen Bildpfad
      />
      
      {/* 3. ConciergeHelpModal wird hier nicht mehr gerendert, da die Glocke nun die Tour startet. */}
    </>
  )
}