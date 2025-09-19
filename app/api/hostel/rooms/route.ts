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

    // Verify user is hostel authority
    const { data: profile, error: profileError } = await supabase
      .from("authorities")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (profileError || profile?.role !== "hostel") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all hostel rooms with occupant details
    const { data: rooms, error } = await supabase
      .from("hostel_rooms")
      .select(`
        id,
        room_number,
        floor,
        capacity,
        occupied_by,
        students!inner (
          id,
          name,
          student_id,
          fee_status
        )
      `)
      .order("room_number")

    if (error) {
      console.error("Error fetching rooms:", error)
      return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
    }

    return NextResponse.json({ data: rooms || [] })
  } catch (error) {
    console.error("Error in hostel rooms API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
