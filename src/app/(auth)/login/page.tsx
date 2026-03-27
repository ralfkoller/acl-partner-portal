"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { login, resetPassword } from "@/lib/actions/auth"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isResetMode, setIsResetMode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetSuccess, setResetSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleLogin(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  async function handleReset(formData: FormData) {
    setError(null)
    setResetSuccess(null)
    startTransition(async () => {
      const result = await resetPassword(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setResetSuccess(result.success)
      }
    })
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-acl-dark relative overflow-hidden flex-col items-center justify-center p-12">
        {/* SVG Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="relative z-10 text-center">
          {/* ACL Logo */}
          <Image
            src="/acl-logo.png"
            alt="ACL Logo"
            width={80}
            height={80}
            className="mx-auto mb-8"
            priority
          />
          <h1 className="text-4xl font-bold text-white mb-4">Partner Portal</h1>
          <p className="text-white/50 text-lg max-w-md">
            Ihr Zugang zu exklusiven Ressourcen, aktuellen Neuigkeiten und gemeinsamen Projekten.
          </p>
        </div>

        {/* Bottom branding */}
        <div className="absolute bottom-8 text-white/30 text-sm">
          ACL advanced commerce labs GmbH
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Image
              src="/acl-logo.png"
              alt="ACL Logo"
              width={40}
              height={40}
            />
            <span className="text-lg font-bold text-acl-dark">ACL Partner Portal</span>
          </div>

          {!isResetMode ? (
            <>
              <h2 className="text-2xl font-bold text-acl-dark mb-2">Willkommen</h2>
              <p className="text-acl-gray text-sm mb-8">
                Melden Sie sich an, um auf das Partner Portal zuzugreifen.
              </p>

              <form action={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-acl-dark">
                    E-Mail-Adresse
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-acl-gray" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@unternehmen.at"
                      required
                      className="pl-11 py-3 rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-acl-dark">
                    Passwort
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-acl-gray" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="pl-11 pr-11 py-3 rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-acl-gray hover:text-acl-dark transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" className="border-gray-300 data-[state=checked]:bg-acl-orange data-[state=checked]:border-acl-orange" />
                    <Label htmlFor="remember" className="text-sm text-acl-gray cursor-pointer">
                      Angemeldet bleiben
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-sm text-acl-orange hover:text-acl-orange-hover transition-colors"
                  >
                    Passwort vergessen?
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 border border-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 px-6 bg-acl-orange hover:bg-acl-orange-hover text-white font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Anmeldung..." : "Anmelden"}
                </button>
              </form>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => { setIsResetMode(false); setError(null); setResetSuccess(null) }}
                className="flex items-center gap-2 text-sm text-acl-gray hover:text-acl-dark mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Zurück zur Anmeldung
              </button>

              <h2 className="text-2xl font-bold text-acl-dark mb-2">Passwort zurücksetzen</h2>
              <p className="text-acl-gray text-sm mb-8">
                Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link zum Zurücksetzen.
              </p>

              <form action={handleReset} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-sm font-medium text-acl-dark">
                    E-Mail-Adresse
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-acl-gray" />
                    <Input
                      id="reset-email"
                      name="email"
                      type="email"
                      placeholder="name@unternehmen.at"
                      required
                      className="pl-11 py-3 rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 border border-red-200">
                    {error}
                  </div>
                )}

                {resetSuccess && (
                  <div className="bg-emerald-50 text-emerald-600 text-sm rounded-xl p-3 border border-emerald-200">
                    {resetSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 px-6 bg-acl-orange hover:bg-acl-orange-hover text-white font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Wird gesendet..." : "Link senden"}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-xs text-acl-gray mt-8">
            Noch keinen Zugang? Kontaktieren Sie uns unter{" "}
            <a href="mailto:partner@acl.co" className="text-acl-orange hover:text-acl-orange-hover transition-colors">
              partner@acl.co
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
