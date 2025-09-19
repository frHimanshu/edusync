import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is HOD
    const { data: profile, error: profileError } = await supabase
      .from("authorities")
      .select("role, department")
      .eq("user_id", user.id)
      .single()

    if (profileError || profile?.role !== "hod") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const department = profile.department || "Computer Science"

    // Get students in the HOD's department
    const { data: students, error } = await supabase
      .from("students")
      .select(`
        id,
        student_id,
        name,
        email,
        phone,
        department,
        semester,
        cgpa,
        attendance_percentage,
        created_at
      `)
      .eq("department", department)
      .order("name")

    if (error) {
      console.error("Error fetching students:", error)
      return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
    }

    return NextResponse.json({ data: students || [] })
  } catch (error) {
    console.error("Error in HOD students API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
