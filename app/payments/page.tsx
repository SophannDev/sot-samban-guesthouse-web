"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  ArrowLeft,
  Filter,
  Receipt,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePayment } from "@/hooks/use-payment";

interface PaymentResponse {
  id: number;
  booking_id: number;
  amount_paid: string;
  payment_method: string;
  payment_method_name: string;
  payment_status: string;
  payment_status_name: string;
  notes: string;
  guest_first_name: string;
  guest_last_name: string;
  payment_date: string;
  room_num: string;
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentResponse | null>(
    null
  );
  const [paymentDate, setPaymentDate] = useState<Date>();
  const [formData, setFormData] = useState({
    booking_id: "",
    amount_paid: 0,
    payment_method: "1", // Cash
    payment_status: "2", // Completed
  });

  // Use the custom hook
  const { data: apiResponse, isLoading, error } = usePayment();

  // Extract payments from API response
  const payments: PaymentResponse[] = apiResponse?.data || [];

  console.log("API Response:", apiResponse);
  console.log("Payments:", payments);

  // Filter payments based on search and filters
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      !searchTerm ||
      payment.guest_first_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.guest_last_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.room_num?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id?.toString().includes(searchTerm) ||
      payment.booking_id?.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || payment.payment_status === statusFilter;
    const matchesMethod =
      methodFilter === "all" || payment.payment_method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "2": // Completed
      case "Completed":
        return "default";
      case "1": // Pending
      case "Pending":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "1":
      case "Cash":
        return "💵";
      case "2":
      case "Credit Card":
        return "💳";
      case "3":
      case "Bank Transfer":
        return "🏦";
      default:
        return "💰";
    }
  };

  // Calculate payment statistics
  const paymentStats = {
    total: payments.length,
    paid: payments.filter(
      (p) => p.payment_status === "2" || p.payment_status_name === "Completed"
    ).length,
    pending: payments.filter(
      (p) => p.payment_status === "1" || p.payment_status_name === "Pending"
    ).length,
    totalRevenue: payments
      .filter(
        (p) => p.payment_status === "2" || p.payment_status_name === "Completed"
      )
      .reduce((sum, p) => sum + parseFloat(p.amount_paid || "0"), 0),
    pendingAmount: payments
      .filter(
        (p) => p.payment_status === "1" || p.payment_status_name === "Pending"
      )
      .reduce((sum, p) => sum + parseFloat(p.amount_paid || "0"), 0),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading payments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">
          Error loading payments: {error.message}
        </div>
      </div>
    );
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
                <h1 className="text-3xl font-bold text-gray-900">
                  Payment Tracking
                </h1>
                <p className="text-gray-600">
                  Manage payments and financial transactions
                </p>
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
                  <DialogDescription>
                    Enter the payment details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Add your form fields here */}
                  <div>
                    <Label htmlFor="booking">Booking ID</Label>
                    <Input
                      id="booking"
                      value={formData.booking_id}
                      onChange={(e) =>
                        setFormData({ ...formData, booking_id: e.target.value })
                      }
                      placeholder="Enter booking ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount Paid ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount_paid}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amount_paid: Number(e.target.value),
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="method">Payment Method</Label>
                    <Select
                      value={formData.payment_method}
                      onValueChange={(value) =>
                        setFormData({ ...formData, payment_method: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Cash</SelectItem>
                        <SelectItem value="2">Credit Card</SelectItem>
                        <SelectItem value="3">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Process Payment</Button>
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
              <div className="text-2xl font-bold text-green-600">
                {paymentStats.paid}
              </div>
              <p className="text-xs text-muted-foreground">Paid</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {paymentStats.pending}
              </div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                ${paymentStats.totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">
                ${paymentStats.pendingAmount.toFixed(2)}
              </div>
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
                  <SelectItem value="1">Pending</SelectItem>
                  <SelectItem value="2">Completed</SelectItem>
                  <SelectItem value="3">Failed</SelectItem>
                  <SelectItem value="4">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="1">Cash</SelectItem>
                  <SelectItem value="2">Credit Card</SelectItem>
                  <SelectItem value="3">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary">
                {filteredPayments.length} payments
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <div className="grid gap-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Receipt className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {payment.guest_first_name} {payment.guest_last_name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="mr-1">ID: {payment.id}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">
                            Booking: {payment.booking_id}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">Room {payment.room_num}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {payment.payment_date}
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">
                            {getMethodIcon(payment.payment_method)}{" "}
                            {payment.payment_method_name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        ${payment.amount_paid}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.notes && `Note: ${payment.notes}`}
                      </div>
                    </div>
                    <Badge variant={getStatusColor(payment.payment_status)}>
                      {payment.payment_status_name}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPayment(payment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Handle delete
                          console.log("Delete payment:", payment.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show message if no payments */}
        {filteredPayments.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No payments found
                </h3>
                <p className="text-gray-600">
                  {payments.length === 0
                    ? "No payments have been processed yet."
                    : "No payments match your current filters."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
