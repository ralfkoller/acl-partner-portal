interface GlassCardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
}

export function GlassCard({ children, className = "", glow = false }: GlassCardProps) {
  return (
    <div className={`${glow ? "v2-glass-glow" : "v2-glass"} v2-border-animate ${className}`}>
      {children}
    </div>
  )
}
