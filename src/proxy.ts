import { type NextRequest, NextResponse } from "next/server"
import { verifyJWT } from "@/lib/auth/jwt"

const COOKIE_NAME = "acl_session"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value ?? null
  const session = token ? await verifyJWT(token) : null

  // Öffentliche Routen — immer erlaubt
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/uploads") ||
    pathname === "/favicon.ico" ||
    /\.(?:svg|png|jpg|jpeg|gif|webp)$/.test(pathname)

  if (isPublic) return NextResponse.next()

  // Nicht eingeloggt → Login
  if (!session) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    return NextResponse.redirect(loginUrl)
  }

  // Eingeloggt auf Login-Seite → Dashboard
  if (pathname === "/login") {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = "/dashboard"
    return NextResponse.redirect(dashboardUrl)
  }

  // Admin-Bereich: nur für Admins
  if (pathname.startsWith("/admin") && session.role !== "admin") {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = "/dashboard"
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
