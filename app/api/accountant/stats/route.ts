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

    // Verify user is accountant
    const { data: profile, error: profileError } = await supabase
      .from("authorities")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (profileError || profile?.role !== "accountant") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get financial statistics
    const [studentsResult, transactionsResult] = await Promise.all([
      // Total students
      supabase
        .from("students")
        .select("id, fee_status"),

      // Wallet transactions for revenue calculation
      supabase
        .from("wallet_transactions")
        .select("amount, type")
        .eq("type", "credit"),
    ])

    const students = studentsResult.data || []
    const transactions = transactionsResult.data || []

    // Calculate statistics
    const totalStudents = students.length
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0)

    // Calculate pending fees (students with unpaid status)
    const unpaidStudents = students.filter((s) => s.fee_status === "unpaid")
    const pendingFees = unpaidStudents.length * 50000 // Assuming average fee of 50k

    // Calculate collection rate
    const paidStudents = students.filter((s) => s.fee_status === "paid")
    const feeCollectionRate = totalStudents > 0 ? Math.round((paidStudents.length / totalStudents) * 100) : 0

    const stats = {
      totalStudents,
      totalRevenue,
      pendingFees,
      newRegistrations: Math.floor(totalStudents * 0.1), // Mock: 10% are new
      feeCollectionRate,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching accountant stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
