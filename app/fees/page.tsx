"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { AccessControl } from "@/components/auth/access-control"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, DollarSign, Receipt, AlertTriangle, CheckCircle, Download, Calendar } from "lucide-react"

// Mock fee data
const mockFeeData = {
  currentSemester: {
    semester: "6th Semester",
    academicYear: "2023-24",
    totalFees: 85000,
    paidAmount: 60000,
    pendingAmount: 25000,
    dueDate: "2024-03-31",
    status: "partial",
  },
  feeBreakdown: [
    { category: "Tuition Fee", amount: 50000, status: "paid", dueDate: "2024-01-31" },
    { category: "Laboratory Fee", amount: 8000, status: "paid", dueDate: "2024-01-31" },
    { category: "Library Fee", amount: 2000, status: "paid", dueDate: "2024-01-31" },
    { category: "Examination Fee", amount: 5000, status: "pending", dueDate: "2024-03-31" },
    { category: "Development Fee", amount: 10000, status: "pending", dueDate: "2024-03-31" },
    { category: "Sports Fee", amount: 3000, status: "pending", dueDate: "2024-03-31" },
    { category: "Medical Fee", amount: 2000, status: "pending", dueDate: "2024-03-31" },
    { category: "Miscellaneous", amount: 5000, status: "pending", dueDate: "2024-03-31" },
  ],
  paymentHistory: [
    {
      id: "PAY001",
      date: "2024-01-15",
      amount: 60000,
      method: "Online Banking",
      status: "completed",
      transactionId: "TXN123456789",
      description: "Semester Fee Payment - Partial",
      receipt: true,
    },
    {
      id: "PAY002",
      date: "2023-08-20",
      amount: 85000,
      method: "Credit Card",
      status: "completed",
      transactionId: "TXN987654321",
      description: "5th Semester Fee Payment - Full",
      receipt: true,
    },
    {
      id: "PAY003",
      date: "2023-01-25",
      amount: 80000,
      method: "Debit Card",
      status: "completed",
      transactionId: "TXN456789123",
      description: "4th Semester Fee Payment - Full",
      receipt: true,
    },
  ],
  scholarships: [
    {
      id: 1,
      name: "Merit Scholarship",
      amount: 15000,
      status: "approved",
      appliedDate: "2023-12-01",
      disbursedDate: "2024-01-10",
    },
    {
      id: 2,
      name: "Need-based Scholarship",
      amount: 10000,
      status: "pending",
      appliedDate: "2024-02-15",
    },
  ],
  installmentPlans: [
    {
      id: 1,
      totalAmount: 25000,
      installments: 3,
      amountPerInstallment: 8334,
      nextDueDate: "2024-03-31",
      status: "available",
    },
    {
      id: 2,
      totalAmount: 25000,
      installments: 5,
      amountPerInstallment: 5000,
      nextDueDate: "2024-03-31",
      status: "available",
    },
  ],
}

export default function Fees() {
  const [feeData] = useState(mockFeeData)
  const [userType] = useState<"student" | "teacher" | "admin" | "hostel">("student")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [selectedFees, setSelectedFees] = useState<string[]>([])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
      case "approved":
        return "secondary"
      case "pending":
        return "destructive"
      case "partial":
        return "default"
      case "available":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
      case "partial":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const handlePayment = () => {
    console.log("[v0] Processing payment:", { paymentMethod, selectedFees })
    // In real app, would integrate with payment gateway
  }

  const handleDownloadReceipt = (paymentId: string) => {
    console.log("[v0] Downloading receipt for payment:", paymentId)
    // In real app, would generate and download PDF receipt
  }

  const getTotalSelectedAmount = () => {
    return feeData.feeBreakdown
      .filter((fee) => selectedFees.includes(fee.category) && fee.status === "pending")
      .reduce((total, fee) => total + fee.amount, 0)
  }

  return (
    <AccessControl userType={userType} allowedRoles={["student", "teacher", "admin"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType={userType} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Fee Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage your fee payments, view history, and download receipts
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    ₹{feeData.currentSemester.totalFees.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">{feeData.currentSemester.semester}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    ₹{feeData.currentSemester.paidAmount.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((feeData.currentSemester.paidAmount / feeData.currentSemester.totalFees) * 100)}%
                    completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    ₹{feeData.currentSemester.pendingAmount.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Due: {feeData.currentSemester.dueDate}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Scholarships</CardTitle>
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    ₹
                    {feeData.scholarships
                      .filter((s) => s.status === "approved")
                      .reduce((sum, s) => sum + s.amount, 0)
                      .toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Applied</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="current-fees" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="current-fees">Current Fees</TabsTrigger>
                <TabsTrigger value="payment-history">Payment History</TabsTrigger>
                <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
                <TabsTrigger value="installments">Installments</TabsTrigger>
                <TabsTrigger value="receipts">Receipts</TabsTrigger>
              </TabsList>

              <TabsContent value="current-fees">
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Current Semester Fees</CardTitle>
                        <CardDescription>
                          {feeData.currentSemester.semester} - {feeData.currentSemester.academicYear}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(feeData.currentSemester.status) as any}>
                        {feeData.currentSemester.status}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">Select</TableHead>
                            <TableHead>Fee Category</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {feeData.feeBreakdown.map((fee) => (
                            <TableRow key={fee.category}>
                              <TableCell>
                                {fee.status === "pending" && (
                                  <input
                                    type="checkbox"
                                    checked={selectedFees.includes(fee.category)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedFees([...selectedFees, fee.category])
                                      } else {
                                        setSelectedFees(selectedFees.filter((f) => f !== fee.category))
                                      }
                                    }}
                                  />
                                )}
                              </TableCell>
                              <TableCell className="font-medium">{fee.category}</TableCell>
                              <TableCell>₹{fee.amount.toLocaleString()}</TableCell>
                              <TableCell>{fee.dueDate}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(fee.status) as any}>
                                  {getStatusIcon(fee.status)}
                                  <span className="ml-1">{fee.status}</span>
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {selectedFees.length > 0 && (
                        <div className="mt-6 p-4 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="font-semibold">Selected Fees</div>
                              <div className="text-sm text-muted-foreground">
                                {selectedFees.length} item(s) selected
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                ₹{getTotalSelectedAmount().toLocaleString()}
                              </div>
                              <div className="text-sm text-muted-foreground">Total Amount</div>
                            </div>
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="w-full">Proceed to Payment</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Payment Details</DialogTitle>
                                <DialogDescription>
                                  Choose your payment method and complete the transaction
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="amount">Amount to Pay</Label>
                                  <Input
                                    id="amount"
                                    value={`₹${getTotalSelectedAmount().toLocaleString()}`}
                                    disabled
                                    className="font-semibold"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="payment-method">Payment Method</Label>
                                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="credit-card">Credit Card</SelectItem>
                                      <SelectItem value="debit-card">Debit Card</SelectItem>
                                      <SelectItem value="net-banking">Net Banking</SelectItem>
                                      <SelectItem value="upi">UPI</SelectItem>
                                      <SelectItem value="wallet">Digital Wallet</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <div className="text-sm font-medium">Selected Fees:</div>
                                  {selectedFees.map((feeCategory) => {
                                    const fee = feeData.feeBreakdown.find((f) => f.category === feeCategory)
                                    return (
                                      <div key={feeCategory} className="flex justify-between text-sm">
                                        <span>{feeCategory}</span>
                                        <span>₹{fee?.amount.toLocaleString()}</span>
                                      </div>
                                    )
                                  })}
                                </div>
                                <Button onClick={handlePayment} className="w-full" disabled={!paymentMethod}>
                                  <CreditCard className="h-4 w-4 mr-2" />
                                  Pay Now
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="payment-history">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>View all your previous fee payments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Payment ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Receipt</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {feeData.paymentHistory.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.id}</TableCell>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                            <TableCell>{payment.method}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(payment.status) as any}>{payment.status}</Badge>
                            </TableCell>
                            <TableCell>
                              {payment.receipt && (
                                <Button variant="outline" size="sm" onClick={() => handleDownloadReceipt(payment.id)}>
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scholarships">
                <Card>
                  <CardHeader>
                    <CardTitle>Scholarships & Financial Aid</CardTitle>
                    <CardDescription>Track your scholarship applications and disbursements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {feeData.scholarships.map((scholarship) => (
                        <div key={scholarship.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(scholarship.status)}
                            <div>
                              <div className="font-medium">{scholarship.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Applied: {scholarship.appliedDate}
                                {scholarship.disbursedDate && ` • Disbursed: ${scholarship.disbursedDate}`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-semibold">₹{scholarship.amount.toLocaleString()}</div>
                              <Badge variant={getStatusColor(scholarship.status) as any}>{scholarship.status}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="installments">
                <Card>
                  <CardHeader>
                    <CardTitle>Installment Plans</CardTitle>
                    <CardDescription>Available payment plans for pending fees</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {feeData.installmentPlans.map((plan) => (
                        <div key={plan.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-semibold">{plan.installments} Installments Plan</div>
                              <div className="text-sm text-muted-foreground">
                                ₹{plan.amountPerInstallment.toLocaleString()} per installment
                              </div>
                            </div>
                            <Badge variant={getStatusColor(plan.status) as any}>{plan.status}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Total Amount</div>
                              <div className="font-medium">₹{plan.totalAmount.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Next Due Date</div>
                              <div className="font-medium">{plan.nextDueDate}</div>
                            </div>
                          </div>
                          <Button variant="outline" className="w-full mt-3 bg-transparent">
                            <Calendar className="h-4 w-4 mr-2" />
                            Select This Plan
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="receipts">
                <Card>
                  <CardHeader>
                    <CardTitle>Fee Receipts</CardTitle>
                    <CardDescription>Download and manage your payment receipts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {feeData.paymentHistory
                        .filter((payment) => payment.receipt)
                        .map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                              <Receipt className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-medium">{payment.description}</div>
                                <div className="text-sm text-muted-foreground">
                                  {payment.date} • ₹{payment.amount.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" onClick={() => handleDownloadReceipt(payment.id)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AccessControl>
  )
}
