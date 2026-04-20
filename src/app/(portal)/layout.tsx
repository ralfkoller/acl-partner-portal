import { redirect } from "next/navigation"
import { getUser } from "@/lib/actions/auth"
import { TopNav } from "@/components/v2/top-nav"

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="relative min-h-screen bg-[#080808]">
      {/* Solid dark backdrop */}
      <div className="fixed inset-0 bg-[#080808] -z-20" />

      {/* Pattern texture overlay */}
      <div
        className="fixed inset-0 -z-10 opacity-30"
        style={{ backgroundImage: "url(/v2/pattern.jpg)", backgroundSize: "512px 512px", backgroundRepeat: "repeat" }}
      />

      {/* Animated orange glow orbs */}
      <div className="v2-mesh" />

      <TopNav user={user} />
      <main className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
