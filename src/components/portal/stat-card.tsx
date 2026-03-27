import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  accentColor: string
  href: string
}

export function StatCard({ title, value, icon: Icon, accentColor, href }: StatCardProps) {
  return (
    <Link href={href}>
      <div
        className="bg-white rounded-xl p-6 border border-gray-100/80 card-hover cursor-pointer"
        style={{ borderLeft: `4px solid ${accentColor}` }}
      >
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Icon className="w-5 h-5" style={{ color: accentColor }} />
          </div>
        </div>
        <div className="text-2xl font-bold text-acl-dark">{value}</div>
        <div className="text-sm text-acl-gray mt-1">{title}</div>
      </div>
    </Link>
  )
}
