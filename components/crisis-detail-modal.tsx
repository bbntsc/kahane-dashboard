"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

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
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-white p-0 sm:rounded-lg">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Zurück
          </button>

          <div className="bg-[#1b251d] p-6 text-center text-white">
            <h2 className="text-2xl font-medium">Aus Krisen Chancen machen - mit Gutmann</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 bg-[#f8f3ef] p-6 md:grid-cols-2">
            <div className="rounded-md bg-[#668273] p-6 text-white">
              <h3 className="mb-4 text-xl font-medium">
                {crisis.year} - {crisis.name}
              </h3>

              <h5 className="mb-2 mt-6 font-medium">Was ist passiert?</h5>
              <p className="text-sm">{crisis.description}</p>

              <div className="mt-6">
                <h5 className="mb-2 font-medium">Verlauf und Erholung</h5>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  {crisis.impact.map((item, index) => (
                    <li key={`impact-${index}`}>{item}</li>
                  ))}
                  {crisis.recovery.map((item, index) => (
                    <li key={`recovery-${index}`}>{item}</li>
                  ))}
                </ul>
                <div className="mt-4 rounded-md bg-white/20 p-3">
                  <span className="font-medium">Erholungszeit bis zum Vorkrisenniveau:</span>{" "}
                  <span className="text-lg">{crisis.recoveryTime}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-md bg-white p-6">
                <div className="mb-4 flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>
                  <h5 className="font-medium">Do's (aus heutiger Sicht):</h5>
                </div>
                <ul className="list-inside list-disc space-y-2 text-sm">
                  {crisis.dos.map((item, index) => (
                    <li key={`do-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-md bg-white p-6">
                <div className="mb-4 flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">
                    ✗
                  </div>
                  <h5 className="font-medium">Don'ts (aus heutiger Sicht):</h5>
                </div>
                <ul className="list-inside list-disc space-y-2 text-sm">
                  {crisis.donts.map((item, index) => (
                    <li key={`dont-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
