"use client"

import { Bell } from "lucide-react"
import { useState } from "react"

interface ConciergeBellProps {
  onHelp: () => void
}

export function ConciergeBell({ onHelp }: ConciergeBellProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <button
        onClick={onHelp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#ebf151] rounded-full shadow-lg flex items-center justify-center hover:bg-[#d9df47] transition-all z-40 group"
        aria-label="Concierge rufen"
      >
        <Bell className="w-7 h-7 text-[#1b251d]" />
      </button>

      {isHovered && (
        <div className="fixed bottom-28 right-8 bg-white px-4 py-2 rounded-lg shadow-lg text-sm text-[#1b251d] z-40 whitespace-nowrap">
          Brauchen Sie Hilfe?
        </div>
      )}
    </>
  )
}
