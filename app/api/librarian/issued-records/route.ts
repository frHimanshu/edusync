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

    // Verify user is librarian
    const { data: profile, error: profileError } = await supabase
      .from("authorities")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (profileError || profile?.role !== "librarian") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const query = supabase
      .from("book_issuances")
      .select(`
        id,
        issue_date,
        due_date,
        returned_at,
        library_books (
          title,
          author
        ),
        students (
          name,
          student_id
        )
      `)
      .order("issue_date", { ascending: false })

    const { data: issuances, error } = await query

    if (error) {
      console.error("Error fetching issued records:", error)
      return NextResponse.json({ error: "Failed to fetch issued records" }, { status: 500 })
    }

    // Filter by search if provided
    let filteredIssuances = issuances || []
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filteredIssuances = filteredIssuances.filter(
        (issuance) =>
          issuance.library_books?.title?.toLowerCase().includes(searchLower) ||
          issuance.students?.name?.toLowerCase().includes(searchLower) ||
          issuance.students?.student_id?.toLowerCase().includes(searchLower),
      )
    }

    return NextResponse.json({ data: filteredIssuances })
  } catch (error) {
    console.error("Error in librarian issued records API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
