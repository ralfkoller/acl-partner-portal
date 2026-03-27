import { format } from "date-fns"
import { de } from "date-fns/locale"

interface NewsCardProps {
  id: string
  title: string
  excerpt: string | null
  publishedAt: string | null
  accentColor?: string
  badge?: string
  badgeVariant?: "orange" | "blue" | "emerald"
}

const badgeStyles = {
  orange: "bg-acl-orange/10 text-acl-orange",
  blue: "bg-blue-500/10 text-blue-600",
  emerald: "bg-emerald-500/10 text-emerald-600",
}

export function NewsCard({
  title,
  excerpt,
  publishedAt,
  accentColor = "#F0A844",
  badge = "Neuigkeit",
  badgeVariant = "orange",
}: NewsCardProps) {
  return (
    <div
      className="bg-white rounded-xl p-6 border border-gray-100/80 card-hover"
      style={{ borderLeft: `4px solid ${accentColor}` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${badgeStyles[badgeVariant]}`}>
          {badge}
        </span>
        {publishedAt && (
          <span className="text-xs text-acl-gray">
            {format(new Date(publishedAt), "dd. MMMM yyyy", { locale: de })}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-acl-dark mb-2">{title}</h3>
      {excerpt && (
        <p className="text-sm text-acl-gray line-clamp-2 mb-3">{excerpt}</p>
      )}
      <span className="text-sm text-acl-orange font-medium hover:text-acl-orange-hover transition-colors cursor-pointer">
        Weiterlesen →
      </span>
    </div>
  )
}
