import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

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

    let query = supabase
      .from("students")
      .select("id, student_id, name, fee_status")
      .contains("tags", ["hostel_resident"])
      .order("name")

    // Apply search filter if provided
    if (search.trim()) {
      query = query.or(`name.ilike.%${search}%,student_id.ilike.%${search}%`)
    }

    const { data: students, error } = await query

    if (error) {
      console.error("Error searching students:", error)
      return NextResponse.json({ error: "Failed to search students" }, { status: 500 })
    }

    return NextResponse.json({ data: students || [] })
  } catch (error) {
    console.error("Error in hostel student search API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
