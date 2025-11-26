"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useSettings } from "@/lib/settings-context"
import { useTranslation } from "@/lib/i18n"

interface AnimatedConciergeProps {
  message: string
  onNext?: () => void
  onSkip?: () => void
  onDismiss?: () => void
  showOptions?: boolean
  position?: "left" | "right" | "center" | "top-right"
}

export function AnimatedConcierge({
  message,
  onNext,
  onSkip,
  onDismiss,
  showOptions,
  position = "left",
}: AnimatedConciergeProps) {
  const [isBlinking, setIsBlinking] = useState(false)
  const [isGesturing, setIsGesturing] = useState(false)
  const { language } = useSettings()
  const t = useTranslation(language)

  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 200)
      },
      3000 + Math.random() * 2000,
    )

    const gestureInterval = setInterval(
      () => {
        setIsGesturing(true)
        setTimeout(() => setIsGesturing(false), 800)
      },
      5000 + Math.random() * 3000,
    )

    return () => {
      clearInterval(blinkInterval)
      clearInterval(gestureInterval)
    }
  }, [])

  const positionClasses = {
    left: "left-4 md:left-8 bottom-24",
    right: "right-4 md:right-12 lg:right-16 bottom-24",
    center: "left-1/2 -translate-x-1/2 bottom-24",
    "top-right": "right-4 md:right-12 lg:right-16 top-32",
  }[position]

  const bubbleOnLeft = position === "right" || position === "top-right"

  return (
    <div className={`fixed ${positionClasses} z-40 flex items-start gap-4 max-w-md`}>
      {bubbleOnLeft && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 border-[#8B4513] dark:border-[#d4a574] rounded-2xl shadow-xl p-4 max-w-xs"
            style={{
              filter: "drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15))",
            }}
          >
            <div className="absolute -right-3 top-8 w-6 h-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-r-2 border-t-2 border-[#8B4513] dark:border-[#d4a574] transform rotate-45" />

            <p className="text-sm md:text-base text-gray-800 dark:text-gray-100 leading-relaxed mb-3">{message}</p>

            {showOptions && (
              <div className="flex gap-2 mt-4">
                {onNext && (
                  <button
                    onClick={onNext}
                    className="flex-1 bg-[#8B4513] hover:bg-[#6B3410] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {t.concierge.guidedOption.split(" ")[0]}
                  </button>
                )}
                {onSkip && (
                  <button
                    onClick={onSkip}
                    className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {language === "de"
                      ? "Überspringen"
                      : language === "fr"
                        ? "Passer"
                        : language === "it"
                          ? "Salta"
                          : "Skip"}
                  </button>
                )}
              </div>
            )}

            {onDismiss && (
              <button
                onClick={onDismiss}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300"
                title={
                  language === "de"
                    ? "Schließen"
                    : language === "fr"
                      ? "Fermer"
                      : language === "it"
                        ? "Chiudi"
                        : "Close"
                }
              >
                ×
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <motion.div
        animate={{
          y: isGesturing ? [-5, 5, -5] : [0, -3, 0],
          rotate: isGesturing ? [0, 3, -3, 0] : 0,
        }}
        transition={{
          y: { repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" },
          rotate: { duration: 0.8 },
        }}
        className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0"
      >
        <Image
          src="/images/1.svg"
          alt="Concierge"
          fill
          className="object-contain"
          style={{
            filter: isBlinking ? "brightness(0.8)" : "brightness(1)",
          }}
        />

        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 3,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-br from-yellow-200/20 to-transparent rounded-full blur-lg"
        />
      </motion.div>

      {!bubbleOnLeft && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 border-[#8B4513] dark:border-[#d4a574] rounded-2xl shadow-xl p-4 max-w-sm"
            style={{
              filter: "drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15))",
            }}
          >
            <div className="absolute -bottom-3 left-8 w-6 h-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-r-2 border-b-2 border-[#8B4513] dark:border-[#d4a574] transform rotate-45" />

            <p className="text-sm md:text-base text-gray-800 dark:text-gray-100 leading-relaxed mb-3">{message}</p>

            {showOptions && (
              <div className="flex gap-2 mt-4">
                {onNext && (
                  <button
                    onClick={onNext}
                    className="flex-1 bg-[#8B4513] hover:bg-[#6B3410] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {t.concierge.guidedOption.split(" ")[0]}
                  </button>
                )}
                {onSkip && (
                  <button
                    onClick={onSkip}
                    className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {language === "de"
                      ? "Überspringen"
                      : language === "fr"
                        ? "Passer"
                        : language === "it"
                          ? "Salta"
                          : "Skip"}
                  </button>
                )}
              </div>
            )}

            {onDismiss && (
              <button
                onClick={onDismiss}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300"
                title={
                  language === "de"
                    ? "Schließen"
                    : language === "fr"
                      ? "Fermer"
                      : language === "it"
                        ? "Chiudi"
                        : "Close"
                }
              >
                ×
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
