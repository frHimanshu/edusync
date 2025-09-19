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

    // Verify user is librarian
    const { data: profile, error: profileError } = await supabase
      .from("authorities")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (profileError || profile?.role !== "librarian") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get library statistics
    const [booksResult, issuancesResult] = await Promise.all([
      // Total books
      supabase
        .from("library_books")
        .select("id, available_copies"),

      // Book issuances
      supabase
        .from("book_issuances")
        .select("id, due_date, returned_at"),
    ])

    const books = booksResult.data || []
    const issuances = issuancesResult.data || []

    // Calculate statistics
    const totalBooks = books.reduce((sum, book) => sum + book.available_copies, 0)
    const booksIssued = issuances.filter((i) => !i.returned_at).length

    // Calculate overdue books
    const currentDate = new Date()
    const overdueBooks = issuances.filter((i) => !i.returned_at && new Date(i.due_date) < currentDate).length

    const stats = {
      totalBooks,
      booksIssued,
      overdueBooks,
      availableBooks: totalBooks - booksIssued,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching librarian stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
