"use client"

import { X } from "lucide-react"

interface TutorialModalProps {
  onClose: () => void
}

export function TutorialModal({ onClose }: TutorialModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl p-12 max-w-2xl mx-4 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-serif text-[#1b251d] mb-8">Möchten Sie eine Führung durch unser Haus?</h2>

          <button
            onClick={onClose}
            className="px-8 py-3 bg-[#668273] text-white rounded-full hover:bg-[#576b61] transition-colors text-sm font-medium"
          >
            Tutorial starten
          </button>
        </div>
      </div>
    </div>
  )
}
