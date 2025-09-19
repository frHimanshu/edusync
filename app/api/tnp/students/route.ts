import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const department = searchParams.get("department") || ""
    const year = searchParams.get("year") || ""

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is T&P officer
    const { data: profile, error: profileError } = await supabase
      .from("authorities")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (profileError || profile?.role !== "tnp") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    let query = supabase
      .from("students")
      .select("id, student_id, name, email, phone, department, semester, cgpa, attendance_percentage")
      .order("name")

    // Apply filters
    if (search.trim()) {
      query = query.or(`name.ilike.%${search}%,student_id.ilike.%${search}%,email.ilike.%${search}%`)
    }

    if (department) {
      query = query.eq("department", department)
    }

    if (year) {
      const semesterRange = getSemesterRange(year)
      query = query.gte("semester", semesterRange.min).lte("semester", semesterRange.max)
    }

    const { data: students, error } = await query

    if (error) {
      console.error("Error fetching students:", error)
      return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
    }

    return NextResponse.json({ data: students || [] })
  } catch (error) {
    console.error("Error in T&P students API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getSemesterRange(year: string) {
  switch (year) {
    case "1":
      return { min: 1, max: 2 }
    case "2":
      return { min: 3, max: 4 }
    case "3":
      return { min: 5, max: 6 }
    case "4":
      return { min: 7, max: 8 }
    default:
      return { min: 1, max: 8 }
  }
}
