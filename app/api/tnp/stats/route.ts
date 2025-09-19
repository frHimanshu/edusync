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

    // Verify user is T&P officer
    const { data: profile, error: profileError } = await supabase
      .from("authorities")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (profileError || profile?.role !== "tnp") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get T&P statistics
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("id, semester, cgpa, department")

    if (studentsError) {
      console.error("Error fetching students:", studentsError)
      return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
    }

    const allStudents = students || []

    // Calculate placement statistics (mock data for now)
    const eligibleStudents = allStudents.filter((s) => s.semester >= 6 && s.cgpa >= 6.0)
    const placedStudents = Math.floor(eligibleStudents.length * 0.75) // Mock: 75% placement rate
    const upcomingDrives = 8 // Mock data
    const activeApplications = Math.floor(eligibleStudents.length * 0.6) // Mock: 60% applying

    const stats = {
      totalStudents: allStudents.length,
      eligibleStudents: eligibleStudents.length,
      placedStudents,
      upcomingDrives,
      activeApplications,
      placementRate: eligibleStudents.length > 0 ? Math.round((placedStudents / eligibleStudents.length) * 100) : 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching T&P stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
