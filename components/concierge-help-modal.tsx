"use client"

import { X } from "lucide-react"

interface ConciergeHelpModalProps {
  onClose: () => void
  context: "simulation" | "market"
}

export function ConciergeHelpModal({ onClose, context }: ConciergeHelpModalProps) {
  const helpContent = {
    simulation: {
      title: "Hilfe zur Vermögenssimulation",
      sections: [
        {
          heading: "Was sehen Sie hier?",
          content:
            "Diese Seite zeigt Ihnen, wie sich Ihr Vermögen unter verschiedenen Szenarien entwickeln könnte. Die Simulation berücksichtigt Volatilität und realistische Marktbewegungen.",
        },
        {
          heading: "Die vier Regler",
          content:
            "• Veranlagungsbetrag: Ihr Startkapital\n• Monatliche Investition: Regelmäßige Einzahlungen\n• Aktienquote: Verhältnis von Aktien zu Anleihen (höher = mehr Chance, aber auch mehr Risiko)\n• Anlagehorizont: Über wie viele Jahre Sie investieren",
        },
        {
          heading: "Das Diagramm",
          content:
            "Zeigt drei Szenarien:\n• Best Case (90%): 90% der Simulationen liegen darunter\n• Mitte (50%): Der Median - die wahrscheinlichste Entwicklung\n• Worst Case (10%): Nur 10% der Simulationen liegen darunter",
        },
      ],
    },
    market: {
      title: "Hilfe zum Blick in den Markt",
      content:
        "Hier sehen Sie, wie sich Ihre Investition in der Vergangenheit verhalten hätte. Klicken Sie auf die roten Krisenpunkte, um mehr über historische Ereignisse zu erfahren.",
    },
  }

  const content = helpContent[context]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#f8f3ef] rounded-lg max-w-2xl w-full p-8 relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-start gap-6 mb-6">
          <img src="/images/1.svg" alt="Concierge" className="w-24 h-24 object-contain flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-serif text-[#1b251d] mb-2">{content.title}</h2>
            <p className="text-[#1b251d] opacity-80">
              Wobei darf ich Ihnen behilflich sein? Klicken Sie auf das Element, das ich Ihnen erklären soll.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {context === "simulation" &&
            "sections" in content &&
            content.sections.map((section, index) => (
              <div key={index} className="bg-white p-4 rounded-lg">
                <h3 className="font-medium text-[#1b251d] mb-2">{section.heading}</h3>
                <p className="text-[#1b251d] text-sm whitespace-pre-line leading-relaxed">{section.content}</p>
              </div>
            ))}
          {context === "market" && "content" in content && (
            <div className="bg-white p-4 rounded-lg">
              <p className="text-[#1b251d] text-sm leading-relaxed">{content.content}</p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-[#1b251d] text-white rounded-lg hover:bg-[#2a3529] transition-colors"
        >
          Verstanden
        </button>
      </div>
    </div>
  )
}
