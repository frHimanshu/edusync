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

    let query = supabase.from("library_books").select("*").order("title")

    // Apply search filter if provided
    if (search.trim()) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,isbn.ilike.%${search}%`)
    }

    const { data: books, error } = await query

    if (error) {
      console.error("Error fetching books:", error)
      return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
    }

    return NextResponse.json({ data: books || [] })
  } catch (error) {
    console.error("Error in librarian books API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { title, author, isbn, category, total_copies, available_copies } = body

    // Validate required fields
    if (!title?.trim() || !author?.trim() || !isbn?.trim()) {
      return NextResponse.json({ error: "Title, author, and ISBN are required" }, { status: 400 })
    }

    // Check if ISBN already exists
    const { data: existingBook } = await supabase.from("library_books").select("id").eq("isbn", isbn.trim()).single()

    if (existingBook) {
      return NextResponse.json({ error: "Book with this ISBN already exists" }, { status: 400 })
    }

    // Create book record
    const { data: book, error } = await supabase
      .from("library_books")
      .insert({
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        category: category?.trim() || "General",
        total_copies: Number.parseInt(total_copies) || 1,
        available_copies: Number.parseInt(available_copies) || Number.parseInt(total_copies) || 1,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating book:", error)
      return NextResponse.json({ error: "Failed to add book" }, { status: 500 })
    }

    return NextResponse.json({ data: book })
  } catch (error) {
    console.error("Error in librarian books API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
