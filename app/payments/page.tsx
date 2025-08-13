"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Plus, Edit, Trash2, CalendarIcon, ArrowLeft, Filter, Receipt } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Payment {
  payment_id: string
  booking_id: string
  guest_name: string
  room_number: string
  payment_date: string
  amount_paid: number
  payment_method: "Cash" | "Credit" | "Bank Transfer"
  payment_status: "Paid" | "Pending"
  booking_total: number
  remaining_balance: number
}

// Mock data for demonstration
const mockPayments: Payment[] = [
  {
    payment_id: "P001",
    booking_id: "B001",
    guest_name: "John Smith",
    room_number: "101",
    payment_date: "2024-01-20",
    amount_paid: 400,
    payment_method: "Credit",
    payment_status: "Paid",
    booking_total: 400,
    remaining_balance: 0,
  },
  {
    payment_id: "P002",
    booking_id: "B002",
    guest_name: "Sarah Johnson",
    room_number: "202",
    payment_date: "2024-01-22",
    amount_paid: 125,
    payment_method: "Cash",
    payment_status: "Paid",
    booking_total: 250,
    remaining_balance: 125,
  },
  {
    payment_id: "P003",
    booking_id: "B003",
    guest_name: "Michael Brown",
    room_number: "103",
    payment_date: "2024-01-15",
    amount_paid: 600,
    payment_method: "Bank Transfer",
    payment_status: "Paid",
    booking_total: 600,
    remaining_balance: 0,
  },
  {
    payment_id: "P004",
    booking_id: "B004",
    guest_name: "Emma Wilson",
    room_number: "201",
    payment_date: "2024-01-25",
    amount_paid: 0,
    payment_method: "Credit",
    payment_status: "Pending",
    booking_total: 340,
    remaining_balance: 340,
  },
]

const mockBookings = [
  { booking_id: "B001", guest_name: "John Smith", room_number: "101", total_amount: 400 },
  { booking_id: "B002", guest_name: "Sarah Johnson", room_number: "202", total_amount: 250 },
  { booking_id: "B003", guest_name: "Michael Brown", room_number: "103", total_amount: 600 },
  { booking_id: "B004", guest_name: "Emma Wilson", room_number: "201", total_amount: 340 },
  { booking_id: "B005", guest_name: "David Lee", room_number: "301", total_amount: 180 },
]

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [paymentDate, setPaymentDate] = useState<Date>()
  const [formData, setFormData] = useState({
    booking_id: "",
    amount_paid: 0,
    payment_method: "Cash" as const,
    payment_status: "Paid" as const,
  })

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.booking_id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.payment_status === statusFilter
    const matchesMethod = methodFilter === "all" || payment.payment_method === methodFilter
    return matchesSearch && matchesStatus && matchesMethod
  })

  const handleAddPayment = () => {
    if (!paymentDate || !formData.booking_id) return

    const selectedBooking = mockBookings.find((b) => b.booking_id === formData.booking_id)
    if (!selectedBooking) return

    const existingPayment = payments.find((p) => p.booking_id === formData.booking_id)
    const previouslyPaid = existingPayment ? existingPayment.amount_paid : 0
    const remainingBalance = selectedBooking.total_amount - previouslyPaid - formData.amount_paid

    const newPayment: Payment = {
      payment_id: `P${String(payments.length + 1).padStart(3, "0")}`,
      booking_id: formData.booking_id,
      guest_name: selectedBooking.guest_name,
      room_number: selectedBooking.room_number,
      payment_date: format(paymentDate, "yyyy-MM-dd"),
      amount_paid: formData.amount_paid,
      payment_method: formData.payment_method,
      payment_status: formData.payment_status,
      booking_total: selectedBooking.total_amount,
      remaining_balance: Math.max(0, remainingBalance),
    }

    setPayments([...payments, newPayment])
    setFormData({ booking_id: "", amount_paid: 0, payment_method: "Cash", payment_status: "Paid" })
    setPaymentDate(undefined)
    setIsAddDialogOpen(false)
  }

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment)
    setFormData({
      booking_id: payment.booking_id,
      amount_paid: payment.amount_paid,
      payment_method: payment.payment_method,
      payment_status: payment.payment_status,
    })
    setPaymentDate(new Date(payment.payment_date))
  }

  const handleUpdatePayment = () => {
    if (!editingPayment || !paymentDate) return

    const selectedBooking = mockBookings.find((b) => b.booking_id === formData.booking_id)
    if (!selectedBooking) return

    const remainingBalance = selectedBooking.total_amount - formData.amount_paid

    setPayments(
      payments.map((payment) =>
        payment.payment_id === editingPayment.payment_id
          ? {
              ...payment,
              booking_id: formData.booking_id,
              guest_name: selectedBooking.guest_name,
              room_number: selectedBooking.room_number,
              payment_date: format(paymentDate, "yyyy-MM-dd"),
              amount_paid: formData.amount_paid,
              payment_method: formData.payment_method,
              payment_status: formData.payment_status,
              booking_total: selectedBooking.total_amount,
              remaining_balance: Math.max(0, remainingBalance),
            }
          : payment,
      ),
    )
    setEditingPayment(null)
    setFormData({ booking_id: "", amount_paid: 0, payment_method: "Cash", payment_status: "Paid" })
    setPaymentDate(undefined)
  }

  const handleDeletePayment = (paymentId: string) => {
    setPayments(payments.filter((payment) => payment.payment_id !== paymentId))
  }

  const handleStatusChange = (paymentId: string, newStatus: Payment["payment_status"]) => {
    setPayments(
      payments.map((payment) =>
        payment.payment_id === paymentId ? { ...payment, payment_status: newStatus } : payment,
      ),
    )
  }

  const getStatusColor = (status: Payment["payment_status"]) => {
    switch (status) {
      case "Paid":
        return "secondary"
      case "Pending":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getMethodIcon = (method: Payment["payment_method"]) => {
    switch (method) {
      case "Cash":
        return "💵"
      case "Credit":
        return "💳"
      case "Bank Transfer":
        return "🏦"
      default:
        return "💰"
    }
  }

  const paymentStats = {
    total: payments.length,
    paid: payments.filter((p) => p.payment_status === "Paid").length,
    pending: payments.filter((p) => p.payment_status === "Pending").length,
    totalRevenue: payments.filter((p) => p.payment_status === "Paid").reduce((sum, p) => sum + p.amount_paid, 0),
    pendingAmount: payments
      .filter((p) => p.payment_status === "Pending")
      .reduce((sum, p) => sum + p.remaining_balance, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment Tracking</h1>
                <p className="text-gray-600">Manage payments and financial transactions</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Process Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Process Payment</DialogTitle>
                  <DialogDescription>Enter the payment details below.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="booking">Booking</Label>
                    <Select
                      value={formData.booking_id}
                      onValueChange={(value) => setFormData({ ...formData, booking_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select booking" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockBookings.map((booking) => (
                          <SelectItem key={booking.booking_id} value={booking.booking_id}>
                            {booking.booking_id} - {booking.guest_name} (Room {booking.room_number}) - $
                            {booking.total_amount}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount Paid ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount_paid}
                      onChange={(e) => setFormData({ ...formData, amount_paid: Number(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="method">Payment Method</Label>
                    <Select
                      value={formData.payment_method}
                      onValueChange={(value: Payment["payment_method"]) =>
                        setFormData({ ...formData, payment_method: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Credit">Credit Card</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Payment Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !paymentDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {paymentDate ? format(paymentDate, "PPP") : "Pick date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={paymentDate} onSelect={setPaymentDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="status">Payment Status</Label>
                    <Select
                      value={formData.payment_status}
                      onValueChange={(value: Payment["payment_status"]) =>
                        setFormData({ ...formData, payment_status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddPayment} className="w-full">
                    Process Payment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{paymentStats.total}</div>
              <p className="text-xs text-muted-foreground">Total Payments</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{paymentStats.paid}</div>
              <p className="text-xs text-muted-foreground">Paid</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{paymentStats.pending}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">${paymentStats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">${paymentStats.pendingAmount}</div>
              <p className="text-xs text-muted-foreground">Pending Amount</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search payments by guest, room, or payment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Credit">Credit Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary">{filteredPayments.length} payments</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <div className="grid gap-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.payment_id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Receipt className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{payment.guest_name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="mr-1">{payment.payment_id}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">Booking: {payment.booking_id}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">Room {payment.room_number}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {payment.payment_date}
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">
                            {getMethodIcon(payment.payment_method)} {payment.payment_method}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">${payment.amount_paid}</div>
                      <div className="text-xs text-gray-500">Total: ${payment.booking_total}</div>
                      {payment.remaining_balance > 0 && (
                        <div className="text-xs text-red-500">Balance: ${payment.remaining_balance}</div>
                      )}
                    </div>
                    <Badge variant={getStatusColor(payment.payment_status)}>{payment.payment_status}</Badge>
                    <Select
                      value={payment.payment_status}
                      onValueChange={(value: Payment["payment_status"]) =>
                        handleStatusChange(payment.payment_id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditPayment(payment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeletePayment(payment.payment_id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Payment Dialog */}
        <Dialog open={!!editingPayment} onOpenChange={() => setEditingPayment(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Payment</DialogTitle>
              <DialogDescription>Update the payment details below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_booking">Booking</Label>
                <Select
                  value={formData.booking_id}
                  onValueChange={(value) => setFormData({ ...formData, booking_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBookings.map((booking) => (
                      <SelectItem key={booking.booking_id} value={booking.booking_id}>
                        {booking.booking_id} - {booking.guest_name} (Room {booking.room_number}) - $
                        {booking.total_amount}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_amount">Amount Paid ($)</Label>
                <Input
                  id="edit_amount"
                  type="number"
                  value={formData.amount_paid}
                  onChange={(e) => setFormData({ ...formData, amount_paid: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="edit_method">Payment Method</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value: Payment["payment_method"]) =>
                    setFormData({ ...formData, payment_method: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Credit">Credit Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !paymentDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {paymentDate ? format(paymentDate, "PPP") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={paymentDate} onSelect={setPaymentDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="edit_status">Payment Status</Label>
                <Select
                  value={formData.payment_status}
                  onValueChange={(value: Payment["payment_status"]) =>
                    setFormData({ ...formData, payment_status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdatePayment} className="w-full">
                Update Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
