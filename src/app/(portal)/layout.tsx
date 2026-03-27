import { redirect } from "next/navigation"
import { getUser } from "@/lib/actions/auth"
import { Sidebar } from "@/components/portal/sidebar"

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
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 lg:ml-[260px]">
        <div className="animate-fade-in p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
