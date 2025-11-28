"use client"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function KahaneLanding() {
  return (
    <div className="min-h-screen bg-[#f8f3ef] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-serif text-[#1b251d] mb-8" style={{ fontFamily: "Bodoni Moda, serif" }}>
          Kahane
        </h1>
        <Link href="/simulation">
          <button className="group inline-flex items-center gap-2 text-lg text-[#1b251d] hover:opacity-70 transition-opacity">
            <span className="font-light">Erlebe investieren</span>
            <div className="w-8 h-8 rounded-full border border-[#1b251d] flex items-center justify-center group-hover:bg-[#1b251d] transition-colors">
              <ArrowRight className="w-4 h-4 group-hover:text-white transition-colors" />
            </div>
          </button>
        </Link>
      </div>
    </div>
  )
}
