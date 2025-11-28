"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface ConciergeOverlayProps {
  onStartGuided: () => void
  onStartSelfGuided: () => void
}

export function ConciergeOverlay({ onStartGuided, onStartSelfGuided }: ConciergeOverlayProps) {
  const [show, setShow] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const hasSeenOverlay = sessionStorage.getItem("hasSeenConciergeOverlay")
    if (!hasSeenOverlay) {
      setTimeout(() => setShow(true), 800)
    }
  }, [])

  useEffect(() => {
    const handleOpen = () => {
      setShow(true)
    }
    window.addEventListener("openConcierge", handleOpen)
    return () => window.removeEventListener("openConcierge", handleOpen)
  }, [])

  const handleChoice = (guided: boolean) => {
    setIsAnimating(true)
    sessionStorage.setItem("hasSeenConciergeOverlay", "true")

    setTimeout(() => {
      if (guided) {
        onStartGuided()
      } else {
        onStartSelfGuided()
      }
      setShow(false)
    }, 600)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, x: 100 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.95, opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-lg w-full p-8 ml-auto mr-8 border border-[#ede9e1]"
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 4,
                ease: "easeInOut",
              }}
              className="absolute -top-16 left-8 w-28 h-28"
            >
              <Image src="/images/1.svg" alt="Ihr digitaler Begleiter" fill className="object-contain" />
            </motion.div>

            <div className="mt-12">
              <h2 className="text-2xl font-serif text-[#1b251d] mb-3">Herzlich willkommen im Marktsimulator</h2>

              <p className="text-base text-gray-700 mb-6 leading-relaxed">
                Ich bin Ihr digitaler Begleiter. Mein Ziel ist es, Ihnen ein Gefühl dafür zu geben, wie sich Vermögen
                über die Zeit und durch verschiedene Marktphasen entwickelt.
              </p>

              <div className="space-y-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice(true)}
                  disabled={isAnimating}
                  className="w-full bg-[#8B4513] hover:bg-[#6B3410] text-white rounded-lg p-5 text-left transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <div className="text-xs font-semibold text-[#ebf151] mb-1">Option A – Für Einsteiger</div>
                  <div className="text-base font-bold mb-1">Mich durch die Simulation führen lassen</div>
                  <div className="text-sm opacity-90">
                    Empfohlen, um die Zusammenhänge Schritt für Schritt zu verstehen.
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice(false)}
                  disabled={isAnimating}
                  className="w-full bg-[#f8f3ef] hover:bg-[#ede9e1] text-gray-900 rounded-lg p-5 text-left transition-all shadow-md hover:shadow-lg disabled:opacity-50 border border-[#ede9e1]"
                >
                  <div className="text-xs font-semibold text-[#8B4513] mb-1">Option B – Für Erfahrene</div>
                  <div className="text-base font-bold mb-1">Selbstständig erkunden</div>
                  <div className="text-sm opacity-75">Ich bin mit Anlageparametern vertraut.</div>
                </motion.button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Sie können mich jederzeit über die Glocke in der linken Seitenleiste um Hilfe bitten.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
