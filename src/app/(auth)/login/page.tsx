"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShoppingBag, Zap, Shield } from "lucide-react"
import { login } from "@/lib/actions/auth"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleLogin(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.redirect) {
        router.push(result.redirect)
      }
    })
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Branding + Form */}
      <div className="flex-1 flex flex-col justify-between bg-[#080808] relative overflow-hidden p-8 lg:p-12">
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url(/v2/pattern.jpg)", backgroundSize: "512px 512px", backgroundRepeat: "repeat" }}
        />

        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-acl-orange/[0.06] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-acl-orange/[0.03] rounded-full blur-[120px]" />

        {/* Logo top */}
        <div className="relative z-10 flex items-center gap-3">
          <Image src="/acl-logo.png" alt="ACL Logo" width={36} height={36} priority />
          <span className="text-white/80 font-semibold text-sm">
            ACL <span className="text-acl-orange">Portal</span>
          </span>
        </div>

        {/* Center — Form */}
        <div className="relative z-10 w-full max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-white mb-3">
            Willkommen <span className="v2-gradient-text">zurück</span>
          </h1>
          <p className="text-white/50 text-base mb-10">
            Melden Sie sich an, um auf das Partner Portal zuzugreifen.
          </p>

          <form action={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white/70">
                E-Mail-Adresse
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@unternehmen.at"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-white placeholder:text-white/25 focus:border-acl-orange/50 focus:ring-2 focus:ring-acl-orange/15 focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white/70">
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-white placeholder:text-white/25 focus:border-acl-orange/50 focus:ring-2 focus:ring-acl-orange/15 focus:outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/[0.06] text-acl-orange focus:ring-acl-orange/20"
                />
                <span className="text-white/50">Angemeldet bleiben</span>
              </label>
              <span className="text-white/30 text-xs">
                Passwort vergessen? Admin kontaktieren.
              </span>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-400 text-sm rounded-xl p-3.5 border border-red-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-acl-orange to-acl-orange-hover text-white font-semibold rounded-xl v2-glow-sm hover:v2-glow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-base"
            >
              {isPending ? (
                "Anmeldung..."
              ) : (
                <>
                  Anmelden
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Features below form */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { icon: ShoppingBag, label: "Commerce" },
              { icon: Zap, label: "Performance" },
              { icon: Shield, label: "Sicherheit" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Icon className="w-4 h-4 text-acl-orange/70" />
                <span className="text-[10px] text-white/30 uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[11px] text-white/20">ACL advanced commerce labs GmbH</span>
          <a href="mailto:partner@acl.co" className="text-[11px] text-acl-orange/50 hover:text-acl-orange transition-colors">
            partner@acl.co
          </a>
        </div>
      </div>

      {/* Right Panel — Image */}
      <div className="hidden lg:block lg:w-[45%] relative overflow-hidden">
        <Image
          src="/v2/login-bg.jpg"
          alt="ACL Commerce Platform"
          fill
          className="object-cover"
          priority
        />
        {/* Dark gradient overlay from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/40 to-transparent" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808]/60 to-transparent" />
      </div>
    </div>
  )
}
