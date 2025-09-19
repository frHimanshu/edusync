import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("id")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const supabase = await createClient()

    const { data: user, error } = await supabase
      .from("users")
      .select(`
        *,
        faculty (
          employee_id,
          department_id,
          designation,
          specialization,
          experience_years,
          departments (
            name,
            code
          )
        ),
        course_assignments (
          courses (
            id,
            name,
            code,
            credits,
            semester
          )
        )
      `)
      .eq("id", userId)
      .eq("role", "faculty")
      .single()

    if (error || !user) {
      console.error("Faculty fetch error:", error)
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 })
    }

    const faculty = user.faculty?.[0]
    const department = faculty?.departments
    const courses = user.course_assignments?.map((ca) => ca.courses) || []

    // Return faculty-specific data
    return NextResponse.json({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`.trim() || user.email?.split("@")[0],
      email: user.email,
      employee_id: faculty?.employee_id || "N/A",
      department: department?.name || "Not Assigned",
      department_code: department?.code || "N/A",
      designation: faculty?.designation || "Faculty",
      specialization: faculty?.specialization,
      experience_years: faculty?.experience_years || 0,
      courses_teaching: courses,
      phone: user.phone,
      is_first_login: user.is_first_login,
    })
  } catch (error) {
    console.error("Error fetching faculty profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
