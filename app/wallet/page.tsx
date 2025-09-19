"use client"

import React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { AccessControl } from "@/components/auth/access-control"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  ShoppingCart,
  Coffee,
  Book,
  CreditCard,
  Smartphone,
  QrCode,
  TrendingUp,
} from "lucide-react"

// Mock wallet data
const mockWalletData = {
  balance: 2500,
  totalEarned: 15000,
  totalSpent: 12500,
  monthlyLimit: 5000,
  monthlySpent: 1200,
  transactions: [
    {
      id: "TXN001",
      type: "credit",
      amount: 500,
      description: "Event participation reward",
      category: "reward",
      date: "2024-03-12",
      time: "2:30 PM",
      status: "completed",
    },
    {
      id: "TXN002",
      type: "debit",
      amount: 150,
      description: "Canteen purchase",
      category: "food",
      date: "2024-03-12",
      time: "1:15 PM",
      status: "completed",
    },
    {
      id: "TXN003",
      type: "debit",
      amount: 200,
      description: "Library fine payment",
      category: "academic",
      date: "2024-03-11",
      time: "4:45 PM",
      status: "completed",
    },
    {
      id: "TXN004",
      type: "credit",
      amount: 1000,
      description: "Wallet top-up",
      category: "topup",
      date: "2024-03-10",
      time: "10:00 AM",
      status: "completed",
    },
    {
      id: "TXN005",
      type: "debit",
      amount: 75,
      description: "Photocopy services",
      category: "academic",
      date: "2024-03-10",
      time: "9:30 AM",
      status: "completed",
    },
    {
      id: "TXN006",
      type: "debit",
      amount: 300,
      description: "Event registration fee",
      category: "events",
      date: "2024-03-09",
      time: "3:20 PM",
      status: "completed",
    },
  ],
  rewards: [
    {
      id: 1,
      title: "Academic Excellence",
      description: "Earned for maintaining GPA above 8.5",
      amount: 500,
      earnedDate: "2024-03-12",
      category: "academic",
    },
    {
      id: 2,
      title: "Event Participation",
      description: "Participated in Tech Fest 2024",
      amount: 200,
      earnedDate: "2024-03-08",
      category: "events",
    },
    {
      id: 3,
      title: "Community Service",
      description: "Volunteered for blood donation camp",
      amount: 300,
      earnedDate: "2024-03-05",
      category: "social",
    },
  ],
  quickActions: [
    { id: 1, name: "Canteen", icon: Coffee, category: "food" },
    { id: 2, name: "Library", icon: Book, category: "academic" },
    { id: 3, name: "Events", icon: Gift, category: "events" },
    { id: 4, name: "Shopping", icon: ShoppingCart, category: "shopping" },
  ],
  spendingCategories: [
    { category: "food", amount: 800, percentage: 40, color: "bg-blue-500" },
    { category: "academic", amount: 400, percentage: 20, color: "bg-green-500" },
    { category: "events", amount: 600, percentage: 30, color: "bg-purple-500" },
    { category: "shopping", amount: 200, percentage: 10, color: "bg-orange-500" },
  ],
}

export default function DigitalWallet() {
  const [walletData] = useState(mockWalletData)
  const [userType] = useState<"student" | "teacher" | "admin" | "hostel">("student")
  const [topupAmount, setTopupAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [transferAmount, setTransferAmount] = useState("")
  const [recipientId, setRecipientId] = useState("")

  const getTransactionIcon = (type: string, category: string) => {
    if (type === "credit") {
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />
    }

    switch (category) {
      case "food":
        return <Coffee className="h-4 w-4 text-orange-500" />
      case "academic":
        return <Book className="h-4 w-4 text-blue-500" />
      case "events":
        return <Gift className="h-4 w-4 text-purple-500" />
      case "shopping":
        return <ShoppingCart className="h-4 w-4 text-pink-500" />
      default:
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "reward":
      case "topup":
        return "secondary"
      case "food":
        return "default"
      case "academic":
        return "outline"
      case "events":
        return "secondary"
      default:
        return "outline"
    }
  }

  const handleTopup = () => {
    console.log("[v0] Processing wallet top-up:", { topupAmount, paymentMethod })
    // In real app, would integrate with payment gateway
    setTopupAmount("")
    setPaymentMethod("")
  }

  const handleTransfer = () => {
    console.log("[v0] Processing wallet transfer:", { transferAmount, recipientId })
    // In real app, would process peer-to-peer transfer
    setTransferAmount("")
    setRecipientId("")
  }

  const handleQuickPayment = (merchant: string) => {
    console.log("[v0] Quick payment to:", merchant)
    // In real app, would process quick payment
  }

  return (
    <AccessControl userType={userType} allowedRoles={["student", "teacher", "admin"]}>
      <div className="flex h-screen bg-background">
        <Sidebar userType={userType} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Digital Wallet</h1>
              <p className="text-muted-foreground mt-1">Manage your campus payments, rewards, and transactions</p>
            </div>

            {/* Wallet Balance Card */}
            <Card className="mb-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm opacity-90">Available Balance</div>
                    <div className="text-4xl font-bold">₹{walletData.balance.toLocaleString()}</div>
                    <div className="text-sm opacity-90 mt-2">
                      Monthly spent: ₹{walletData.monthlySpent} / ₹{walletData.monthlyLimit}
                    </div>
                  </div>
                  <div className="text-right">
                    <Wallet className="h-12 w-12 opacity-80 mb-2" />
                    <div className="text-sm opacity-90">Student ID: STU2024001</div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Money
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Money to Wallet</DialogTitle>
                        <DialogDescription>Top up your digital wallet for campus payments</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="topup-amount">Amount</Label>
                          <Input
                            id="topup-amount"
                            type="number"
                            placeholder="Enter amount"
                            value={topupAmount}
                            onChange={(e) => setTopupAmount(e.target.value)}
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
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          {[500, 1000, 2000, 5000].map((amount) => (
                            <Button
                              key={amount}
                              variant="outline"
                              size="sm"
                              onClick={() => setTopupAmount(amount.toString())}
                            >
                              ₹{amount}
                            </Button>
                          ))}
                        </div>
                        <Button onClick={handleTopup} className="w-full" disabled={!topupAmount || !paymentMethod}>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Add ₹{topupAmount || 0}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" className="flex-1">
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Transfer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Transfer Money</DialogTitle>
                        <DialogDescription>Send money to another student's wallet</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="recipient-id">Recipient Student ID</Label>
                          <Input
                            id="recipient-id"
                            placeholder="Enter student ID"
                            value={recipientId}
                            onChange={(e) => setRecipientId(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="transfer-amount">Amount</Label>
                          <Input
                            id="transfer-amount"
                            type="number"
                            placeholder="Enter amount"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleTransfer} className="w-full" disabled={!transferAmount || !recipientId}>
                          <Smartphone className="h-4 w-4 mr-2" />
                          Transfer ₹{transferAmount || 0}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="secondary">
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Pay
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">₹{walletData.totalEarned.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This semester</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">₹{walletData.totalSpent.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This semester</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rewards Earned</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{walletData.rewards.length}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Quick Payments</CardTitle>
                <CardDescription>Pay for campus services instantly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {walletData.quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      className="h-20 flex-col gap-2 bg-transparent"
                      onClick={() => handleQuickPayment(action.name)}
                    >
                      {React.createElement(action.icon, { className: "h-6 w-6" })}
                      <span className="text-sm">{action.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue="transactions" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="transactions">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest wallet activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {walletData.transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            {getTransactionIcon(transaction.type, transaction.category)}
                            <div>
                              <div className="font-medium">{transaction.description}</div>
                              <div className="text-sm text-muted-foreground">
                                {transaction.date} at {transaction.time}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div
                                className={`font-semibold ${
                                  transaction.type === "credit" ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
                              </div>
                              <Badge variant={getCategoryColor(transaction.category) as any}>
                                {transaction.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rewards">
                <Card>
                  <CardHeader>
                    <CardTitle>Rewards & Cashback</CardTitle>
                    <CardDescription>Earn rewards for academic achievements and campus activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {walletData.rewards.map((reward) => (
                        <div key={reward.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <Gift className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">{reward.title}</div>
                              <div className="text-sm text-muted-foreground">{reward.description}</div>
                              <div className="text-sm text-muted-foreground">Earned on {reward.earnedDate}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-lg font-semibold text-green-600">+₹{reward.amount}</div>
                              <Badge variant="secondary">{reward.category}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Spending Analytics</CardTitle>
                      <CardDescription>Track your spending patterns and budget</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Monthly Budget Usage</span>
                            <span>{Math.round((walletData.monthlySpent / walletData.monthlyLimit) * 100)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(walletData.monthlySpent / walletData.monthlyLimit) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-4">Spending by Category</h3>
                          <div className="space-y-3">
                            {walletData.spendingCategories.map((category) => (
                              <div key={category.category} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded ${category.color}`}></div>
                                  <span className="capitalize">{category.category}</span>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">₹{category.amount}</div>
                                  <div className="text-sm text-muted-foreground">{category.percentage}%</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Wallet Settings</CardTitle>
                    <CardDescription>Manage your wallet preferences and security</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">Monthly Spending Limit</div>
                          <div className="text-sm text-muted-foreground">Set a limit for your monthly expenses</div>
                        </div>
                        <Button variant="outline">₹{walletData.monthlyLimit.toLocaleString()}</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">Transaction Notifications</div>
                          <div className="text-sm text-muted-foreground">Get notified for all transactions</div>
                        </div>
                        <Button variant="outline">Enabled</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">Auto Top-up</div>
                          <div className="text-sm text-muted-foreground">
                            Automatically add money when balance is low
                          </div>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">PIN Security</div>
                          <div className="text-sm text-muted-foreground">Change your wallet PIN</div>
                        </div>
                        <Button variant="outline">Change PIN</Button>
                      </div>
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
