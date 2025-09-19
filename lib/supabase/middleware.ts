import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  if (isDemoMode || !supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
    console.log("[v0] Demo mode - Supabase not configured, allowing access to demo pages")
    const pathname = request.nextUrl.pathname
    
    // In demo mode, allow access to all pages
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  console.log("[v0] Middleware - User:", user?.email || "none")
  console.log("[v0] Middleware - Auth error:", error?.message || "none")

  const pathname = request.nextUrl.pathname

  const publicRoutes = ["/", "/student-login", "/authority-login", "/auth", "/api"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  const isApiRoute = pathname.startsWith("/api")

  // Skip middleware for API routes to avoid redirect loops
  if (isApiRoute) {
    return supabaseResponse
  }

  // If accessing public routes and authenticated, redirect to dashboard
  if (isPublicRoute && user) {
    if (pathname === "/" || pathname === "/student-login" || pathname === "/authority-login") {
      console.log("[v0] Authenticated user on login page, redirecting to dashboard")
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  // If accessing protected routes without authentication, redirect to login
  if (!isPublicRoute && !user) {
    console.log("[v0] No authentication found, redirecting to login")
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  if (user && !isPublicRoute) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role, first_name, last_name, is_first_login")
        .eq("id", user.id)
        .single()

      if (profileError) {
        console.error("[v0] Profile fetch error:", profileError.message)
        // If profile doesn't exist, redirect to setup
        const url = request.nextUrl.clone()
        url.pathname = "/auth/setup-profile"
        return NextResponse.redirect(url)
      }

      const userRole = profile?.role || "student"
      console.log("[v0] User role from database:", userRole)

      const roleDashboards = {
        student: "/student/dashboard",
        faculty: "/faculty-dashboard",
        hostel: "/hostel-dashboard",
        hostel_authority: "/hostel-dashboard",
        admin: "/admin/dashboard",
        accountant: "/accountant-dashboard",
        hod: "/hod-dashboard",
        librarian: "/librarian-dashboard",
        tnp: "/tnp-dashboard",
        sports: "/authority/sports/dashboard",
      }

      // Handle /dashboard route - redirect to role-specific dashboard
      if (pathname === "/dashboard") {
        const dashboardPath = roleDashboards[userRole as keyof typeof roleDashboards]
        if (dashboardPath) {
          const url = request.nextUrl.clone()
          url.pathname = dashboardPath
          console.log("[v0] Redirecting to role dashboard:", dashboardPath)
          return NextResponse.redirect(url)
        } else {
          console.log("[v0] Unknown role, defaulting to student dashboard")
          const url = request.nextUrl.clone()
          url.pathname = "/student/dashboard"
          return NextResponse.redirect(url)
        }
      }

      const roleRouteMap = {
        student: ["/student"],
        faculty: ["/faculty", "/faculty-dashboard", "/shared"],
        hostel: ["/authority/hostel", "/hostel-dashboard", "/shared"],
        hostel_authority: ["/authority/hostel", "/hostel-dashboard", "/shared"],
        accountant: ["/authority/accounts", "/accountant-dashboard", "/shared"],
        admin: ["/admin", "/faculty", "/authority", "/student", "/shared"],
        hod: ["/authority/hod", "/hod-dashboard", "/faculty", "/shared"],
        librarian: ["/authority/library", "/librarian-dashboard", "/shared"],
        tnp: ["/authority/tnp", "/tnp-dashboard", "/shared"],
        sports: ["/authority/sports", "/shared"],
      }

      const allowedRoutes = roleRouteMap[userRole as keyof typeof roleRouteMap] || ["/student"]
      const isAuthorizedRoute = allowedRoutes.some((route) => pathname.startsWith(route))

      // If user is trying to access a route they're not authorized for
      if (!isAuthorizedRoute && !pathname.startsWith("/auth")) {
        console.log(`[v0] Cross-portal access denied: ${userRole} trying to access ${pathname}`)
        const dashboardPath = roleDashboards[userRole as keyof typeof roleDashboards] || "/student/dashboard"
        const url = request.nextUrl.clone()
        url.pathname = dashboardPath
        return NextResponse.redirect(url)
      }

      if (profile.is_first_login && !pathname.startsWith("/auth/setup-password")) {
        console.log("[v0] First-time login detected, redirecting to password setup")
        const url = request.nextUrl.clone()
        url.pathname = "/auth/setup-password"
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error("[v0] Error fetching user role:", error)
      // Default to student dashboard if role fetch fails
      if (pathname === "/dashboard") {
        const url = request.nextUrl.clone()
        url.pathname = "/student/dashboard"
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
