import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewsEditor } from "@/components/admin/news-editor"

export const metadata = {
  title: "Artikel bearbeiten",
}

export default async function AdminNewsEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (id === "new") {
    return <NewsEditor />
  }

  const supabase = await createClient()
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single()

  if (!news) redirect("/admin/news")

  return <NewsEditor news={news} />
}
