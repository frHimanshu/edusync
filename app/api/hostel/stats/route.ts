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

    // Get hostel statistics
    const [roomsResult, studentsResult] = await Promise.all([
      // Total hostel rooms
      supabase
        .from("hostel_rooms")
        .select("id, capacity, occupied_by"),

      // Students with hostel_resident tag
      supabase
        .from("students")
        .select("id, tags")
        .contains("tags", ["hostel_resident"]),
    ])

    const rooms = roomsResult.data || []
    const hostelStudents = studentsResult.data || []

    // Calculate statistics
    const totalRooms = rooms.length
    const occupiedRooms = rooms.filter((room) => room.occupied_by && room.occupied_by.length > 0).length
    const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0)
    const currentOccupancy = rooms.reduce((sum, room) => sum + (room.occupied_by?.length || 0), 0)

    const stats = {
      totalRooms,
      occupiedRooms,
      availableRooms: totalRooms - occupiedRooms,
      totalCapacity,
      currentOccupancy,
      occupancyRate: totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 0,
      hostelStudents: hostelStudents.length,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching hostel stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
