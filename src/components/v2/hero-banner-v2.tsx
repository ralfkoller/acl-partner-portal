import Image from "next/image"

interface HeroBannerV2Props {
  userName: string
}

export function HeroBannerV2({ userName }: HeroBannerV2Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-8 h-[220px] lg:h-[260px]">
      {/* Background image */}
      <Image
        src="/v2/hero-banner.jpg"
        alt="ACL Commerce Platform"
        fill
        className="object-cover"
        priority
      />

      {/* Dark gradient overlay — strong from left, transparent on right */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/90 via-[#080808]/60 to-[#080808]/30" />

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#080808]/80 to-transparent" />

      {/* Orange glow border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-acl-orange/60 via-acl-orange/20 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center px-8 lg:px-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image src="/acl-logo.png" alt="ACL Logo" width={36} height={36} />
            <div className="h-5 w-px bg-white/15" />
            <span className="text-[11px] text-white/40 uppercase tracking-[0.15em]">Partner Portal</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Willkommen, <span className="v2-gradient-text">{userName.split(" ")[0]}</span>
          </h1>
          <p className="text-white/50 text-sm max-w-lg">
            Hier finden Sie die neuesten Updates, Ressourcen und Tools für Ihre Projekte.
          </p>
        </div>
      </div>
    </div>
  )
}
