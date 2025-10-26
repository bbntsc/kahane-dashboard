import type React from "react"
import { BarChart2, FileText, Home, PieChart, Settings, TrendingUp } from "lucide-react"
import Link from "next/link"

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-[#ede9e1] bg-[#f8f3ef]">
      <div className="flex h-16 items-center border-b border-[#ede9e1] px-6">
        <h1 className="text-xl font-semibold tracking-tight text-[#1b251d]">Kahune</h1>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          <NavItem href="/" icon={<Home className="h-5 w-5" />}>
            Dashboard
          </NavItem>
          <NavItem href="/simulation" icon={<BarChart2 className="h-5 w-5" />} active>
            Simulation
          </NavItem>
          <NavItem href="/portfolio" icon={<PieChart className="h-5 w-5" />}>
            Portfolio
          </NavItem>
          <NavItem href="/performance" icon={<TrendingUp className="h-5 w-5" />}>
            Performance
          </NavItem>
          <NavItem href="/reports" icon={<FileText className="h-5 w-5" />}>
            Reports
          </NavItem>
        </nav>
      </div>
      <div className="border-t border-[#ede9e1] p-4">
        <nav className="space-y-1">
          <NavItem href="/settings" icon={<Settings className="h-5 w-5" />}>
            Settings
          </NavItem>
        </nav>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean
}

function NavItem({ href, icon, children, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
        active ? "bg-[#1b251d] text-white" : "text-[#1b251d] hover:bg-[#ede9e1]"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </Link>
  )
}
