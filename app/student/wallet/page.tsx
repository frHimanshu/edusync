"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Wallet, Plus, Minus, History, CreditCard, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface WalletTransaction {
  id: string
  transaction_type: 'credit' | 'debit'
  amount: number
  description: string
  reference_id?: string
  processed_by?: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  created_at: string
  processed_by_name?: string
}

interface StudentWallet {
  balance: number
  student_id: string
}

export default function StudentWallet() {
  const { user } = useAuth()
  const [wallet, setWallet] = useState<StudentWallet | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [addFundsOpen, setAddFundsOpen] = useState(false)
  const [requestAmount, setRequestAmount] = useState("")
  const [requestDescription, setRequestDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user) return

      try {
        const supabase = createClient()

        // Get student wallet balance
        const { data: student, error: studentError } = await supabase
          .from("students")
          .select("ec_wallet_balance, student_id")
          .eq("id", user.id)
          .single()

        if (studentError) {
          console.error("Error fetching student data:", studentError)
          return
        }

        // Get wallet transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from("wallet_transactions")
          .select(`
            *,
            users!wallet_transactions_processed_by_fkey(first_name, last_name)
          `)
          .eq("student_id", user.id)
          .order("created_at", { ascending: false })

        if (transactionsError) {
          console.error("Error fetching transactions:", transactionsError)
        }

        setWallet({
          balance: student.ec_wallet_balance || 0,
          student_id: student.student_id
        })

        if (transactionsData) {
          const formattedTransactions = transactionsData.map(transaction => ({
            ...transaction,
            processed_by_name: transaction.users ? 
              `${transaction.users.first_name} ${transaction.users.last_name}` : 
              'System'
          }))
          setTransactions(formattedTransactions)
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error)
        toast.error("Failed to load wallet data")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchWalletData()
    }
  }, [user])

  const handleAddFundsRequest = async () => {
    if (!user || !requestAmount || !requestDescription) {
      toast.error("Please fill in all fields")
      return
    }

    const amount = parseFloat(requestAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("wallet_transactions")
        .insert({
          student_id: user.id,
          transaction_type: 'credit',
          amount: amount,
          description: requestDescription,
          status: 'pending',
          reference_id: `REQ-${Date.now()}`
        })

      if (error) {
        throw error
      }

      toast.success("Fund request submitted successfully")
      setAddFundsOpen(false)
      setRequestAmount("")
      setRequestDescription("")
      
      // Refresh data
      window.location.reload()
    } catch (error) {
      console.error("Error submitting fund request:", error)
      toast.error("Failed to submit fund request")
    } finally {
      setSubmitting(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    return type === 'credit' ? (
      <Plus className="h-4 w-4 text-green-600" />
    ) : (
      <Minus className="h-4 w-4 text-red-600" />
    )
  }

  const getTransactionColor = (type: string) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
          <h1 className="text-3xl font-bold">Edu-Credits Wallet</h1>
          <p className="text-gray-600">Manage your digital wallet and transactions</p>
        </div>
        <Dialog open={addFundsOpen} onOpenChange={setAddFundsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Request Funds
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Funds</DialogTitle>
              <DialogDescription>
                Submit a request to add funds to your wallet. This will be reviewed by the accounts department.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Reason for fund request (e.g., Library fine payment, Hostel maintenance, etc.)"
                  value={requestDescription}
                  onChange={(e) => setRequestDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setAddFundsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddFundsRequest}
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>

      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="mr-2 h-6 w-6" />
            Current Balance
            </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">₹{wallet?.balance || 0}</div>
          <p className="text-blue-100 mt-2">Student ID: {wallet?.student_id}</p>
        </CardContent>
      </Card>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactions.filter(t => t.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {transactions.length > 0 ? formatDate(transactions[0].created_at) : 'No transactions'}
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
          <CardTitle className="flex items-center">
            <History className="mr-2 h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription>All your wallet transactions and fund requests</CardDescription>
          </CardHeader>
          <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getTransactionIcon(transaction.transaction_type)}
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(transaction.created_at)}
                      </p>
                      {transaction.processed_by_name && (
                        <p className="text-xs text-gray-500">
                          Processed by: {transaction.processed_by_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getTransactionColor(transaction.transaction_type)}`}>
                      {transaction.transaction_type === 'credit' ? '+' : '-'}₹{transaction.amount}
                    </p>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions found</p>
              <p className="text-sm">Your transaction history will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <AlertCircle className="mr-2 h-5 w-5" />
            How Edu-Credits Work
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ul className="space-y-2 text-sm">
            <li>• Edu-Credits are used for various campus services like library fines, hostel maintenance, and other fees</li>
            <li>• You can request funds by clicking "Request Funds" and providing a valid reason</li>
            <li>• All fund requests are reviewed by the accounts department before approval</li>
            <li>• Credits are automatically deducted for approved services and fees</li>
            <li>• You can view your transaction history and current balance at any time</li>
          </ul>
          </CardContent>
        </Card>
    </div>
  )
}