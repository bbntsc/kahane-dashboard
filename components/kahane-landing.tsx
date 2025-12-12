"use client"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSettings } from "@/lib/settings-context" 
import { useTranslation } from "@/lib/i18n" 

export function KahaneLanding() {
  const { language } = useSettings()
  const t = useTranslation(language)

  return (
    <div className="min-h-screen bg-[#f8f3ef] flex items-center justify-center">
      <div className="text-center">
        
        {/* HIER WIRD DIE NEUE SCHRIFTART "Great Vibes" ÜBER font-script EINGESETZT */}
        <h1 className="text-[120px] font-script text-[#1b251d] mb-0 leading-none">
          Gutmann
        </h1>
        
        {/* SEPARATOR ELEMENT */}
        <div className="flex items-center justify-center my-3">
            <div className="w-16 h-px bg-[#1b251d] opacity-50" />
            <div className="w-1 h-1 mx-2 rounded-full bg-[#1b251d] opacity-50" />
            <div className="w-16 h-px bg-[#1b251d] opacity-50" />
        </div>
        
        {/* UNTERZEILE CONCIERGE */}
        <div className="text-base tracking-[0.4em] uppercase text-[#1b251d] mb-12 mt-0">
            CONCIERGE
        </div>
        
        <Link href="/simulation">
          <button className="group inline-flex items-center gap-2 text-lg text-[#1b251d] hover:opacity-70 transition-opacity">
            <span className="font-light">{t.landing.subtitle}</span>
            <div className="w-8 h-8 rounded-full border border-[#1b251d] flex items-center justify-center group-hover:bg-[#1b251d] transition-colors">
              <ArrowRight className="w-4 h-4 group-hover:text-white transition-colors" />
            </div>
          </button>
        </Link>
      </div>
    </div>
  )
}