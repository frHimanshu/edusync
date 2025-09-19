import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const studentId = params.id

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is hostel authority
    const { data: profile, error: profileError } = await supabase
      .from("authorities")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (profileError || profile?.role !== "hostel") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get limited student information (only what hostel authority needs)
    const { data: student, error } = await supabase
      .from("students")
      .select("id, student_id, name, fee_status")
      .eq("id", studentId)
      .contains("tags", ["hostel_resident"])
      .single()

    if (error || !student) {
      return NextResponse.json({ error: "Student not found or not a hostel resident" }, { status: 404 })
    }

    // Get room assignment if exists
    const { data: roomData } = await supabase
      .from("hostel_rooms")
      .select("room_number")
      .contains("occupied_by", [studentId])
      .single()

    const studentProfile = {
      ...student,
      room_number: roomData?.room_number || null,
    }

    return NextResponse.json({ data: studentProfile })
  } catch (error) {
    console.error("Error fetching student profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
