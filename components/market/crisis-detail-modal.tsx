"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { TrendingUp } from "lucide-react"

interface Crisis {
  id: string
  year: number
  name: string
  color: string
  description: string
  impact: string[]
  recovery: string[]
  recoveryTime: string
  dos: string[]
  donts: string[]
}

interface CrisisDetailModalProps {
  crisis: Crisis
  isOpen: boolean
  onClose: () => void
}

export function CrisisDetailModal({ crisis, isOpen, onClose }: CrisisDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto bg-white p-0 sm:rounded-lg">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute left-6 top-6 rounded-md bg-white/90 backdrop-blur px-4 py-2 text-sm font-medium text-[#1b251d] hover:bg-white border border-[#ede9e1] transition-colors z-10"
          >
            ← Zurück
          </button>

          <div className="bg-gradient-to-br from-[#668273] to-[#5a7268] p-12 text-center text-white">
            <h2 className="text-3xl font-serif mb-2">Aus Krisen lernen</h2>
            <p className="text-white/90 text-sm">Erkenntnisse für Ihre Anlagestrategie</p>
          </div>

          <div className="p-8 bg-[#f8f3ef]">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Crisis Overview */}
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-serif mb-2 text-[#1b251d]">
                  {crisis.year} – {crisis.name}
                </h3>
                <div className="h-px bg-[#ede9e1] my-6" />

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-3 text-[#1b251d]">Was ist passiert?</h4>
                    <p className="text-[#6b7280] leading-relaxed">{crisis.description}</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-3 text-[#1b251d]">Verlauf der Krise</h4>
                    <ul className="space-y-2">
                      {crisis.impact.map((item, index) => (
                        <li key={`impact-${index}`} className="flex gap-3 text-[#6b7280]">
                          <span className="text-[#668273] mt-1">•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#e8f4e8] rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-[#668273]" />
                      <h4 className="text-lg font-medium text-[#1b251d]">Die Erholungsphase</h4>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {crisis.recovery.map((item, index) => (
                        <li key={`recovery-${index}`} className="flex gap-3 text-[#1b251d]">
                          <span className="text-[#668273] mt-1">✓</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="bg-white rounded p-4 border border-[#668273]/20">
                      <span className="text-sm text-[#6b7280]">Dauer bis zur vollständigen Erholung:</span>
                      <p className="text-xl font-medium text-[#668273] mt-1">{crisis.recoveryTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learnings */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#e8f4e8] flex items-center justify-center text-[#668273] text-xl">
                      ✓
                    </div>
                    <h4 className="text-lg font-medium text-[#1b251d]">Was sich bewährt hat</h4>
                  </div>
                  <ul className="space-y-3">
                    {crisis.dos.map((item, index) => (
                      <li key={`do-${index}`} className="flex gap-3 text-[#6b7280] leading-relaxed">
                        <span className="text-[#668273] mt-1 flex-shrink-0">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#fef2f2] flex items-center justify-center text-[#b91c1c] text-xl">
                      ✗
                    </div>
                    <h4 className="text-lg font-medium text-[#1b251d]">Was vermieden werden sollte</h4>
                  </div>
                  <ul className="space-y-3">
                    {crisis.donts.map((item, index) => (
                      <li key={`dont-${index}`} className="flex gap-3 text-[#6b7280] leading-relaxed">
                        <span className="text-[#b91c1c] mt-1 flex-shrink-0">×</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
