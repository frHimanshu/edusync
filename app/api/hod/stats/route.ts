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

    // Get department statistics
    const [studentsResult, attendanceResult] = await Promise.all([
      // Total students in department
      supabase
        .from("students")
        .select("id, cgpa")
        .eq("department", department),

      // Average attendance for department
      supabase
        .from("attendance")
        .select("student_id, status")
        .in("student_id", supabase.from("students").select("id").eq("department", department)),
    ])

    const students = studentsResult.data || []
    const attendanceRecords = attendanceResult.data || []

    // Calculate statistics
    const totalStudents = students.length
    const averageCGPA = students.length > 0 ? students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length : 0

    // Calculate attendance percentage
    const presentCount = attendanceRecords.filter((a) => a.status === "present").length
    const totalAttendanceRecords = attendanceRecords.length
    const averageAttendance = totalAttendanceRecords > 0 ? (presentCount / totalAttendanceRecords) * 100 : 0

    // Mock additional statistics (in a real app, these would come from actual data)
    const passRate = 92 // Could be calculated from actual grade data
    const placementRate = 85 // Could be calculated from placement records

    const stats = {
      totalStudents,
      averageAttendance: Math.round(averageAttendance * 10) / 10,
      passRate,
      averageCGPA: Math.round(averageCGPA * 100) / 100,
      placementRate,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching HOD stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
