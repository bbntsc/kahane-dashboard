"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"

interface AnimatedConciergeProps {
  message: string
  onNext?: () => void
  onSkip?: () => void
  showOptions?: boolean
  position?: "left" | "right" | "center"
}

export function AnimatedConcierge({ message, onNext, onSkip, showOptions, position = "left" }: AnimatedConciergeProps) {
  const [isBlinking, setIsBlinking] = useState(false)
  const [isGesturing, setIsGesturing] = useState(false)

  useEffect(() => {
    // Blink animation every 3-5 seconds
    const blinkInterval = setInterval(
      () => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 200)
      },
      3000 + Math.random() * 2000,
    )

    // Gesture animation every 5-8 seconds
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

  const positionClass = {
    left: "left-4 md:left-8",
    right: "right-4 md:right-12 lg:right-16",
    center: "left-1/2 -translate-x-1/2",
  }[position]

  const bubbleOnLeft = position === "right"

  return (
    <div className={`fixed bottom-24 ${positionClass} z-40 flex items-end gap-4 max-w-md`}>
      {bubbleOnLeft && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white/95 backdrop-blur-sm border-2 border-[#8B4513] rounded-2xl shadow-xl p-4 max-w-xs"
            style={{
              filter: "drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15))",
            }}
          >
            {/* Speech bubble tail pointing right */}
            <div className="absolute -right-3 bottom-8 w-6 h-6 bg-white/95 backdrop-blur-sm border-r-2 border-t-2 border-[#8B4513] transform rotate-45" />

            <p className="text-sm md:text-base text-gray-800 leading-relaxed mb-3">{message}</p>

            {showOptions && (
              <div className="flex gap-2 mt-4">
                {onNext && (
                  <button
                    onClick={onNext}
                    className="flex-1 bg-[#8B4513] hover:bg-[#6B3410] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Verstanden
                  </button>
                )}
                {onSkip && (
                  <button
                    onClick={onSkip}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Überspringen
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Animated Concierge Character */}
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

        {/* Subtle animated highlight */}
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
            className="relative bg-white/95 backdrop-blur-sm border-2 border-[#8B4513] rounded-2xl shadow-xl p-4 max-w-sm"
            style={{
              filter: "drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15))",
            }}
          >
            {/* Speech bubble tail */}
            <div className="absolute -bottom-3 left-8 w-6 h-6 bg-white/95 backdrop-blur-sm border-r-2 border-b-2 border-[#8B4513] transform rotate-45" />

            <p className="text-sm md:text-base text-gray-800 leading-relaxed mb-3">{message}</p>

            {showOptions && (
              <div className="flex gap-2 mt-4">
                {onNext && (
                  <button
                    onClick={onNext}
                    className="flex-1 bg-[#8B4513] hover:bg-[#6B3410] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Verstanden
                  </button>
                )}
                {onSkip && (
                  <button
                    onClick={onSkip}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Überspringen
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
