"use client"
import { X } from "lucide-react"

interface ConciergeOverlayProps {
  onClose: () => void
  onStartTour: () => void
}

export function ConciergeOverlay({ onClose, onStartTour }: ConciergeOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#f8f3ef] rounded-lg max-w-2xl w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Concierge Character */}
          <div className="flex-shrink-0">
            <img src="/images/1.svg" alt="Concierge" className="w-48 h-48 object-contain" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h2 className="text-2xl font-serif text-[#1b251d] mb-4">Herzlich willkommen im Marktsimulator</h2>
            <p className="text-[#1b251d] mb-6 leading-relaxed">
              Ich bin Ihr digitaler Begleiter. Mein Ziel ist es, Ihnen ein Gefühl dafür zu geben, wie sich Vermögen über
              die Zeit und durch verschiedene Marktphasen entwickelt.
            </p>

            <div className="space-y-4">
              <button
                onClick={onStartTour}
                className="w-full py-4 px-6 bg-[#1b251d] text-white rounded-lg hover:bg-[#2a3529] transition-colors text-left"
              >
                <div className="font-medium mb-1">
                  Option A (Für Einsteiger): Mich durch die Simulation führen lassen
                </div>
                <div className="text-sm opacity-80">
                  Empfohlen, um die Zusammenhänge Schritt für Schritt zu verstehen.
                </div>
              </button>

              <button
                onClick={onClose}
                className="w-full py-4 px-6 bg-white border-2 border-[#1b251d] text-[#1b251d] rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="font-medium mb-1">Option B (Für Erfahrene): Selbstständig erkunden</div>
                <div className="text-sm opacity-80">Ich bin mit Anlageparametern vertraut.</div>
              </button>
            </div>

            <p className="text-sm text-gray-600 mt-6">
              Sie können mich jederzeit über die Klingel am unteren rechten Rand rufen.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
