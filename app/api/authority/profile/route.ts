import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("id")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .in("role", ["hostel", "hostel_authority", "accountant", "administrator", "hod", "librarian", "tnp"])
      .single()

    if (error || !user) {
      return NextResponse.json({ error: "Authority user not found" }, { status: 404 })
    }

    // Return authority-specific data
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      employee_id: user.employee_id,
      department: user.department || "Administration",
      phone: user.phone,
      role: user.role,
    })
  } catch (error) {
    console.error("Error fetching authority profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
