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
        students (
          student_id,
          department_id,
          semester,
          year_of_admission,
          cgpa,
          departments (
            name,
            code
          )
        ),
        hostel_assignments (
          room_number,
          hostels (
            name,
            block
          )
        )
      `)
      .eq("id", userId)
      .eq("role", "student")
      .single()

    if (error || !user) {
      console.error("Student fetch error:", error)
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const student = user.students?.[0]
    const hostelAssignment = user.hostel_assignments?.[0]
    const department = student?.departments

    // Return student-specific data
    return NextResponse.json({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`.trim() || user.email?.split("@")[0],
      email: user.email,
      student_id: student?.student_id || "N/A",
      department: department?.name || "Not Assigned",
      department_code: department?.code || "N/A",
      year: student?.year_of_admission ? new Date().getFullYear() - student.year_of_admission + 1 : 1,
      semester: student?.semester || 1,
      cgpa: student?.cgpa || 0.0,
      hostel_room: hostelAssignment ? `${hostelAssignment.hostels?.block}-${hostelAssignment.room_number}` : null,
      phone: user.phone,
      is_first_login: user.is_first_login,
    })
  } catch (error) {
    console.error("Error fetching student profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
