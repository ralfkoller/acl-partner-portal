import { getUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { ProfileFormV2 } from "@/components/v2/profile-form-v2"

export const metadata = {
  title: "Profil",
}

export default async function ProfilPage() {
  const user = await getUser()
  if (!user) redirect("/login")

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Mein Profil</h1>
        <p className="text-sm text-white/60 mt-1">Verwalten Sie Ihre persönlichen Daten.</p>
      </div>

      <div className="v2-glass-glow p-6">
        <ProfileFormV2 user={user} />
      </div>
    </div>
  )
}
