"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DollarSign, Search, Filter, Plus, Eye, Receipt, Calendar, Users, TrendingUp, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface FeeRecord {
  id: string
  student_id: string
  student_name: string
  student_id_number: string
  semester: number
  department_name: string
  fee_type: string
  amount: number
  paid_amount: number
  due_date: string
  payment_date?: string
  status: string
  payment_method?: string
  receipt_number?: string
  created_at: string
}

interface Student {
  id: string
  student_id: string
  first_name: string
  last_name: string
  semester: number
  department_name: string
}

const FEE_TYPES = [
  "Tuition Fee",
  "Hostel Fee",
  "Library Fee",
  "Lab Fee",
  "Examination Fee",
  "Development Fee",
  "Other"
]

const PAYMENT_METHODS = [
  "Cash",
  "Bank Transfer",
  "Cheque",
  "Online Payment",
  "Card Payment"
]

const STATUS_OPTIONS = [
  "Pending",
  "Paid",
  "Overdue",
  "Partial"
]

export default function FeesManagement() {
  const { user } = useAuth()
  const [fees, setFees] = useState<FeeRecord[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedFeeType, setSelectedFeeType] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null)

  // Form state
  const [selectedStudent, setSelectedStudent] = useState("")
  const [feeType, setFeeType] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Payment form state
  const [paidAmount, setPaidAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [receiptNumber, setReceiptNumber] = useState("")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Mock data for demo
        const mockFees: FeeRecord[] = [
          {
            id: "fee1",
            student_id: "student1",
            student_name: "John Doe",
            student_id_number: "STU2024001",
            semester: 3,
            department_name: "Computer Science Engineering",
            fee_type: "Tuition Fee",
            amount: 50000,
            paid_amount: 50000,
            due_date: "2024-02-15",
            payment_date: "2024-02-10",
            status: "Paid",
            payment_method: "Bank Transfer",
            receipt_number: "RCP001",
            created_at: "2024-01-15T00:00:00Z"
          },
          {
            id: "fee2",
            student_id: "student2",
            student_name: "Sarah Johnson",
            student_id_number: "STU2024002",
            semester: 5,
            department_name: "Electronics Engineering",
            fee_type: "Tuition Fee",
            amount: 50000,
            paid_amount: 25000,
            due_date: "2024-02-15",
            status: "Partial",
            created_at: "2024-01-15T00:00:00Z"
          },
          {
            id: "fee3",
            student_id: "student3",
            student_name: "Michael Brown",
            student_id_number: "STU2024003",
            semester: 7,
            department_name: "Mechanical Engineering",
            fee_type: "Hostel Fee",
            amount: 15000,
            paid_amount: 0,
            due_date: "2024-02-10",
            status: "Overdue",
            created_at: "2024-01-10T00:00:00Z"
          }
        ]

        const mockStudents: Student[] = [
          { id: "student1", student_id: "STU2024001", first_name: "John", last_name: "Doe", semester: 3, department_name: "Computer Science Engineering" },
          { id: "student2", student_id: "STU2024002", first_name: "Sarah", last_name: "Johnson", semester: 5, department_name: "Electronics Engineering" },
          { id: "student3", student_id: "STU2024003", first_name: "Michael", last_name: "Brown", semester: 7, department_name: "Mechanical Engineering" }
        ]

        setFees(mockFees)
        setStudents(mockStudents)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load fee data")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const handleCreateFee = async () => {
    if (!selectedStudent || !feeType || !amount || !dueDate) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const student = students.find(s => s.id === selectedStudent)
      if (!student) {
        toast.error("Invalid student selection")
        return
      }

      const newFee: FeeRecord = {
        id: Date.now().toString(),
        student_id: selectedStudent,
        student_name: `${student.first_name} ${student.last_name}`,
        student_id_number: student.student_id,
        semester: student.semester,
        department_name: student.department_name,
        fee_type: feeType,
        amount: parseInt(amount),
        paid_amount: 0,
        due_date: dueDate,
        status: "Pending",
        created_at: new Date().toISOString()
      }

      setFees(prev => [newFee, ...prev])
      toast.success("Fee record created successfully")
      setCreateOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creating fee:", error)
      toast.error("Failed to create fee record")
    } finally {
      setSubmitting(false)
    }
  }

  const handleRecordPayment = async () => {
    if (!selectedFee || !paidAmount || !paymentMethod) {
      toast.error("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      const paymentAmount = parseInt(paidAmount)
      const newPaidAmount = selectedFee.paid_amount + paymentAmount
      const newStatus = newPaidAmount >= selectedFee.amount ? "Paid" : "Partial"

      const updatedFee = {
        ...selectedFee,
        paid_amount: newPaidAmount,
        status: newStatus,
        payment_date: paymentDate,
        payment_method: paymentMethod,
        receipt_number: receiptNumber || `RCP${Date.now()}`
      }

      setFees(prev => prev.map(fee => 
        fee.id === selectedFee.id ? updatedFee : fee
      ))
      
      toast.success("Payment recorded successfully")
      setPaymentOpen(false)
      setSelectedFee(null)
      resetPaymentForm()
    } catch (error) {
      console.error("Error recording payment:", error)
      toast.error("Failed to record payment")
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedStudent("")
    setFeeType("")
    setAmount("")
    setDueDate("")
    setDescription("")
  }

  const resetPaymentForm = () => {
    setPaidAmount("")
    setPaymentMethod("")
    setReceiptNumber("")
    setPaymentDate(new Date().toISOString().split('T')[0])
  }

  const openPaymentDialog = (fee: FeeRecord) => {
    setSelectedFee(fee)
    setPaidAmount((fee.amount - fee.paid_amount).toString())
    setPaymentOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "partial":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredFees = fees.filter(fee => {
    const matchesSearch = 
      fee.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.student_id_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.fee_type.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !selectedStatus || fee.status === selectedStatus
    const matchesFeeType = !selectedFeeType || fee.fee_type === selectedFeeType
    
    return matchesSearch && matchesStatus && matchesFeeType
  })

  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0)
  const totalPaid = fees.reduce((sum, fee) => sum + fee.paid_amount, 0)
  const totalPending = totalFees - totalPaid
  const overdueCount = fees.filter(fee => fee.status === "Overdue").length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fees Management</h1>
          <p className="text-gray-600">Manage student fees and payments</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Fee Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Fee Record</DialogTitle>
              <DialogDescription>
                Add a new fee record for a student
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="student">Student *</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.first_name} {student.last_name} ({student.student_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="feeType">Fee Type *</Label>
                <Select value={feeType} onValueChange={setFeeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    {FEE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="50000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Additional notes (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateFee}
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? "Creating..." : "Create Fee Record"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalFees)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Fees</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by student, ID, or fee type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="statusFilter">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="feeTypeFilter">Fee Type</Label>
              <Select value={selectedFeeType} onValueChange={setSelectedFeeType}>
                <SelectTrigger>
                  <SelectValue placeholder="All fee types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All fee types</SelectItem>
                  {FEE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fees List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Fee Records ({filteredFees.length})
          </CardTitle>
          <CardDescription>All student fee records and payments</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFees.length > 0 ? (
            <div className="space-y-4">
              {filteredFees.map((fee) => (
                <div key={fee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{fee.student_name}</h4>
                        <p className="text-sm text-gray-600">{fee.student_id_number}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{fee.department_name}</span>
                          <span>Sem {fee.semester}</span>
                          <span>{fee.fee_type}</span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due: {formatDate(fee.due_date)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatCurrency(fee.amount)}</div>
                        <div className="text-sm text-gray-600">
                          Paid: {formatCurrency(fee.paid_amount)}
                        </div>
                        {fee.paid_amount < fee.amount && (
                          <div className="text-sm text-red-600">
                            Balance: {formatCurrency(fee.amount - fee.paid_amount)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Badge className={getStatusColor(fee.status)}>
                      {fee.status}
                    </Badge>
                    {fee.status !== "Paid" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openPaymentDialog(fee)}
                      >
                        <Receipt className="h-4 w-4 mr-1" />
                        Record Payment
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No fee records found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedStatus || selectedFeeType
                  ? "Try adjusting your filters to see more fee records."
                  : "No fee records have been created yet. Create your first fee record to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record payment for {selectedFee?.student_name}
            </DialogDescription>
          </DialogHeader>
          {selectedFee && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Total Amount:</span>
                  <span className="font-medium">{formatCurrency(selectedFee.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Already Paid:</span>
                  <span className="font-medium">{formatCurrency(selectedFee.paid_amount)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span>Remaining:</span>
                  <span>{formatCurrency(selectedFee.amount - selectedFee.paid_amount)}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="paidAmount">Amount Paid *</Label>
                <Input
                  id="paidAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentDate">Payment Date</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="receiptNumber">Receipt Number</Label>
                  <Input
                    id="receiptNumber"
                    placeholder="Auto-generated if empty"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setPaymentOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleRecordPayment}
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? "Recording..." : "Record Payment"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
