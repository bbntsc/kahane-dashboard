// components/simulation-context.tsx

import * as React from 'react'

// Definiert den Typ des Kontextwertes
interface SimulationContextProps {
  onLogoClickForTutorial: (() => void) | undefined
  // Hier könnten weitere simulationsspezifische Funktionen folgen
}

// Erstellt den Kontext mit einem Standardwert
export const SimulationContext = React.createContext<SimulationContextProps>({
  onLogoClickForTutorial: undefined,
})

export function useSimulationContext() {
  return React.useContext(SimulationContext)
}