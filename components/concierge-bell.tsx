"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Bell } from "lucide-react"

interface ConciergeBellProps {
  onHelp: () => void
}

export function ConciergeBell({ onHelp }: ConciergeBellProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isRinging, setIsRinging] = useState(false)

  const handleClick = () => {
    setIsRinging(true)
    setTimeout(() => setIsRinging(false), 600)
    onHelp()
  }

  return (
    <>
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          rotate: isRinging ? [0, -15, 15, -15, 15, 0] : 0,
        }}
        transition={{
          rotate: { duration: 0.6, ease: "easeInOut" },
        }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#ebf151] rounded-full shadow-xl flex items-center justify-center hover:bg-[#d9df47] transition-colors z-40"
        aria-label="Concierge rufen"
      >
        <motion.div
          animate={{
            scale: isRinging ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Bell className="w-7 h-7 text-[#1b251d]" />
        </motion.div>

        {/* Pulse effect when hovering */}
        {isHovered && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            className="absolute inset-0 bg-[#ebf151] rounded-full"
          />
        )}
      </motion.button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-28 right-8 bg-white px-4 py-2 rounded-lg shadow-lg text-sm text-[#1b251d] z-40 whitespace-nowrap border border-gray-200"
          >
            Brauchen Sie Hilfe?
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
