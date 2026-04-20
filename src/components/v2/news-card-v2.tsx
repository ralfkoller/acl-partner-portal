import Link from "next/link"
import { format } from "date-fns"
import { de } from "date-fns/locale"

interface NewsCardV2Props {
  id: string
  title: string
  excerpt: string | null
  publishedAt: string | null
}

export function NewsCardV2({ id, title, excerpt, publishedAt }: NewsCardV2Props) {
  return (
    <div className="v2-glass v2-border-animate p-6 group">
      <div className="flex items-center gap-3 mb-3">
        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-acl-orange/10 text-acl-orange">
          Neuigkeit
        </span>
        {publishedAt && (
          <span className="text-xs text-white/50">
            {format(new Date(publishedAt), "dd. MMMM yyyy", { locale: de })}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-acl-orange transition-colors">
        {title}
      </h3>
      {excerpt && (
        <p className="text-sm text-white/50 line-clamp-2 mb-3">{excerpt}</p>
      )}
      <Link
        href={`/news/${id}`}
        className="text-sm text-acl-orange font-medium hover:underline"
      >
        Weiterlesen →
      </Link>
    </div>
  )
}
