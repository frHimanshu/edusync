import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

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

    // Verify user is accountant
    const { data: profile, error: profileError } = await supabase
      .from("authorities")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (profileError || profile?.role !== "accountant") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      email,
      phone,
      department,
      semester,
      student_id,
      address,
      guardian_name,
      guardian_phone,
      fee_amount,
      hostel_resident,
    } = body

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !department || !semester || !student_id?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if student ID already exists
    const { data: existingStudent } = await supabase
      .from("students")
      .select("id")
      .eq("student_id", student_id.trim())
      .single()

    if (existingStudent) {
      return NextResponse.json({ error: "Student ID already exists" }, { status: 400 })
    }

    // Create student record
    const { data: student, error: studentError } = await supabase
      .from("students")
      .insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        department,
        semester: Number.parseInt(semester),
        student_id: student_id.trim(),
        address: address?.trim() || null,
        guardian_name: guardian_name?.trim() || null,
        guardian_phone: guardian_phone?.trim() || null,
        fee_status: fee_amount ? "unpaid" : "paid",
        tags: hostel_resident ? ["hostel_resident"] : [],
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (studentError) {
      console.error("Error creating student:", studentError)
      return NextResponse.json({ error: "Failed to register student" }, { status: 500 })
    }

    // Create initial wallet transaction if fee amount is provided
    if (fee_amount && Number.parseFloat(fee_amount) > 0) {
      await supabase.from("wallet_transactions").insert({
        student_id: student.id,
        amount: -Number.parseFloat(fee_amount),
        type: "debit",
        description: "Semester fee due",
        status: "pending",
        created_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({ data: student })
  } catch (error) {
    console.error("Error in register student API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
