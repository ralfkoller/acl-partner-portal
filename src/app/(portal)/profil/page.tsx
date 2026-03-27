import { getUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/portal/profile-form"

export const metadata = {
  title: "Profil",
}

export default async function ProfilPage() {
  const user = await getUser()
  if (!user) redirect("/login")

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-acl-dark">Mein Profil</h1>
        <p className="text-sm text-acl-gray mt-1">Verwalten Sie Ihre persönlichen Daten.</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100/80">
        <ProfileForm user={user} />
      </div>
    </div>
  )
}
