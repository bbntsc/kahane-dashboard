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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12"
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
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 md:w-40 md:h-40"
            >
              <Image src="/images/1.svg" alt="Ihr digitaler Begleiter" fill className="object-contain" />
            </motion.div>

            <div className="text-center mt-16 md:mt-20">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Herzlich willkommen im Marktsimulator
              </h2>

              <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed max-w-xl mx-auto">
                Ich bin Ihr digitaler Begleiter. Mein Ziel ist es, Ihnen ein Gefühl dafür zu geben, wie sich Vermögen
                über die Zeit und durch verschiedene Marktphasen entwickelt.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice(true)}
                  disabled={isAnimating}
                  className="bg-[#8B4513] hover:bg-[#6B3410] text-white rounded-xl p-6 text-left transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <div className="text-sm font-semibold text-yellow-200 mb-2">Option A – Für Einsteiger</div>
                  <div className="text-lg font-bold mb-2">Mich durch die Simulation führen lassen</div>
                  <div className="text-sm opacity-90">
                    Empfohlen, um die Zusammenhänge Schritt für Schritt zu verstehen.
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice(false)}
                  disabled={isAnimating}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl p-6 text-left transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <div className="text-sm font-semibold text-[#8B4513] mb-2">Option B – Für Erfahrene</div>
                  <div className="text-lg font-bold mb-2">Selbstständig erkunden</div>
                  <div className="text-sm opacity-75">Ich bin mit Anlageparametern vertraut.</div>
                </motion.button>
              </div>

              <p className="text-sm text-gray-500">
                Keine Sorge – Sie können mich jederzeit über die Glocke unten rechts um Hilfe bitten.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
