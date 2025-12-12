"use client"
import { Slider } from "@/components/input_cockpit/slider"
import { Info } from "lucide-react"
import { useEffect, useState } from "react"
import { useSettings } from "@/lib/settings-context" // Wichtig für die Lokalisierung

interface SimulationControlProps {
  label: string
  value: number
  onChange: (val: number) => void
  min: number
  max: number
  step: number
  unit?: string
  isCurrency?: boolean // Neuer Prop, um Währungsformatierung zu aktivieren
}

export function SimulationControl({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step, 
  unit, 
  isCurrency = false 
}: SimulationControlProps) {
  const [inputValue, setInputValue] = useState("")
  const { language } = useSettings()

  // Helfer: Formatiert eine Zahl mit Tausendertrennzeichen (ohne Währungssymbol)
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(language === 'de' ? "de-DE" : "en-US", {
      maximumFractionDigits: 0,
    }).format(num)
  }

  // Initialisierung und Update, wenn sich der externe Value ändert (z.B. durch Slider)
  useEffect(() => {
    setInputValue(formatNumber(value))
  }, [value, language])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Entferne alle Nicht-Zahlen (außer evtl. Dezimaltrennzeichen, hier ignorieren wir sie für Ganzzahlen)
    const rawValue = e.target.value.replace(/\D/g, "")
    setInputValue(rawValue) // Zeige temporär die Rohzahl an, während getippt wird
    
    const num = Number(rawValue)
    
    // Update den Parent-State, aber klammere noch nicht hart (damit man löschen kann)
    // Wir begrenzen nur das Maximum grob, damit keine riesigen Zahlen entstehen
    if (!isNaN(num)) {
        // Optional: Direktes Update beim Tippen (kann bei Tausendern springen, daher Vorsicht)
        // Besser: Wir warten auf Blur für das finale Clamping, aber updaten den Chart
        onChange(Math.min(Math.max(num, 0), max * 10)) 
    }
  }

  const handleBlur = () => {
      // Beim Verlassen des Feldes: Säubern, Clamping und Formatieren
      const rawValue = inputValue.replace(/\D/g, "")
      let num = Number(rawValue)
      
      if(isNaN(num)) num = min;
      
      // Clamping zwischen Min und Max
      num = Math.max(min, Math.min(num, max));
      
      onChange(num);
      setInputValue(formatNumber(num)); // Zurück zum schönen Format
  }

  // Einheit bestimmen: Wenn isCurrency true ist, nehmen wir "€", sonst den übergebenen unit
  const displayUnit = isCurrency ? "€" : unit

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-[#1b251d] dark:text-gray-100">{label}</h3>
          <Info className="h-4 w-4 text-gray-400" />
        </div>
        
        {/* Input Container */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-700 border border-[#ede9e1] dark:border-gray-600 rounded-lg px-3 py-1 focus-within:ring-2 focus-within:ring-[#1b251d]">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="w-24 text-sm text-right bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
            />
            {displayUnit && (
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium select-none">
                    {displayUnit}
                </span>
            )}
        </div>
      </div>
      
      <Slider
        value={[Math.min(Math.max(value, min), max)]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals) => onChange(vals[0])}
        className="py-1"
      />
      
      {/* Das untere Info-Div wurde entfernt, da die Info jetzt im Input steht */}
    </div>
  )
}