import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface StatCardV2Props {
  title: string
  value: number
  icon: LucideIcon
  accentColor: string
  href: string
}

export function StatCardV2({ title, value, icon: Icon, accentColor, href }: StatCardV2Props) {
  return (
    <Link href={href}>
      <div className="v2-glass v2-border-animate p-6 cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Icon className="w-5 h-5 transition-transform group-hover:scale-110" style={{ color: accentColor }} />
          </div>
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
        </div>
        <div className="text-3xl font-bold text-white v2-stat-glow">{value}</div>
        <div className="text-sm text-white/60 mt-1">{title}</div>
      </div>
    </Link>
  )
}
