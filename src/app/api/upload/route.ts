import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { nanoid } from "nanoid"
import { getSessionPayload } from "@/lib/auth/session"

export async function POST(req: NextRequest) {
  // Auth check via session cookie (Next.js cookies() reads request cookies)
  const payload = await getSessionPayload()
  if (!payload) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 })
  if (payload.role !== "admin") {
    return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "Keine Datei." }, { status: 400 })

  const ext = path.extname(file.name)
  const filename = `${nanoid()}${ext}`
  const uploadsDir = path.join(process.cwd(), "public", "uploads")

  await mkdir(uploadsDir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadsDir, filename), buffer)

  return NextResponse.json({ path: filename, size: file.size, mimeType: file.type })
}
