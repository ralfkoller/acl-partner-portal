import Image from "next/image"

interface HeroBannerProps {
  userName: string
}

export function HeroBanner({ userName }: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-acl-dark via-acl-dark-surface to-acl-dark mb-8">
      {/* Left orange accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-acl-orange to-acl-orange-light" />

      {/* SVG Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      <div className="relative px-8 py-10 flex items-center justify-between">
        <div>
          {/* ACL Logo */}
          <Image
            src="/acl-logo.png"
            alt="ACL Logo"
            width={40}
            height={40}
            className="mb-4"
          />
          <h1 className="text-2xl font-bold text-white mb-2">
            Willkommen zurück, {userName.split(" ")[0]}!
          </h1>
          <p className="text-white/50 text-sm">
            Hier finden Sie die neuesten Updates und Ressourcen für Ihre Projekte.
          </p>
        </div>

        {/* ACL Watermark */}
        <div className="hidden md:block text-right">
          <div className="text-5xl font-bold text-white/[0.15]">ACL</div>
          <div className="text-xs text-white/[0.35] mt-1">We digitize your commerce.</div>
        </div>
      </div>
    </div>
  )
}
