import { redirect } from "next/navigation"
import { getUser } from "@/lib/actions/auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen bg-[#080808]">
      {/* Pattern backdrop */}
      <div className="fixed inset-0 -z-20 bg-[#080808]" />
      <div
        className="fixed inset-0 -z-10 opacity-[0.03]"
        style={{ backgroundImage: "url('/v2/pattern.jpg')", backgroundSize: "cover" }}
      />
      <AdminSidebar user={user} />
      <main className="flex-1 lg:ml-[260px]">
        <div className="animate-fade-in p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
