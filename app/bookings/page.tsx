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
import { Search, Plus, Edit, Trash2, CalendarIcon, User, Bed, DollarSign, ArrowLeft, Filter } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { MobileNav } from "@/components/mobile-nav"

interface Booking {
  booking_id: string
  guest_id: string
  guest_name: string
  room_id: string
  room_number: string
  room_type: string
  check_in_date: string
  check_out_date: string
  total_amount: number
  booking_status: "Confirmed" | "Cancelled" | "Completed"
  nights: number
}

// Mock data for demonstration
const mockBookings: Booking[] = [
  {
    booking_id: "B001",
    guest_id: "G001",
    guest_name: "John Smith",
    room_id: "R001",
    room_number: "101",
    room_type: "single",
    check_in_date: "2024-01-20",
    check_out_date: "2024-01-25",
    total_amount: 400,
    booking_status: "Confirmed",
    nights: 5,
  },
  {
    booking_id: "B002",
    guest_id: "G002",
    guest_name: "Sarah Johnson",
    room_id: "R005",
    room_number: "202",
    room_type: "double",
    check_in_date: "2024-01-22",
    check_out_date: "2024-01-24",
    total_amount: 250,
    booking_status: "Confirmed",
    nights: 2,
  },
  {
    booking_id: "B003",
    guest_id: "G003",
    guest_name: "Michael Brown",
    room_id: "R003",
    room_number: "103",
    room_type: "suite",
    check_in_date: "2024-01-15",
    check_out_date: "2024-01-18",
    total_amount: 600,
    booking_status: "Completed",
    nights: 3,
  },
]

const mockGuests = [
  { guest_id: "G001", name: "John Smith" },
  { guest_id: "G002", name: "Sarah Johnson" },
  { guest_id: "G003", name: "Michael Brown" },
  { guest_id: "G004", name: "Emma Wilson" },
]

const mockRooms = [
  { room_id: "R001", room_number: "101", room_type: "single", price: 80, available: false },
  { room_id: "R002", room_number: "102", room_type: "double", price: 120, available: true },
  { room_id: "R003", room_number: "103", room_type: "suite", price: 200, available: true },
  { room_id: "R004", room_number: "201", room_type: "single", price: 85, available: true },
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [formData, setFormData] = useState({
    guest_id: "",
    room_id: "",
    booking_status: "Confirmed" as const,
  })

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.booking_id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.booking_status === statusFilter
    return matchesSearch && matchesStatus
  })

  const calculateTotal = (roomId: string, checkIn: Date, checkOut: Date) => {
    const room = mockRooms.find((r) => r.room_id === roomId)
    if (!room || !checkIn || !checkOut) return 0
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    return room.price * nights
  }

  const calculateNights = (checkIn: Date, checkOut: Date) => {
    if (!checkIn || !checkOut) return 0
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  }

  const handleAddBooking = () => {
    if (!checkInDate || !checkOutDate || !formData.guest_id || !formData.room_id) return

    const selectedGuest = mockGuests.find((g) => g.guest_id === formData.guest_id)
    const selectedRoom = mockRooms.find((r) => r.room_id === formData.room_id)

    if (!selectedGuest || !selectedRoom) return

    const nights = calculateNights(checkInDate, checkOutDate)
    const total = calculateTotal(formData.room_id, checkInDate, checkOutDate)

    const newBooking: Booking = {
      booking_id: `B${String(bookings.length + 1).padStart(3, "0")}`,
      guest_id: formData.guest_id,
      guest_name: selectedGuest.name,
      room_id: formData.room_id,
      room_number: selectedRoom.room_number,
      room_type: selectedRoom.room_type,
      check_in_date: format(checkInDate, "yyyy-MM-dd"),
      check_out_date: format(checkOutDate, "yyyy-MM-dd"),
      total_amount: total,
      booking_status: formData.booking_status,
      nights,
    }

    setBookings([...bookings, newBooking])
    setFormData({ guest_id: "", room_id: "", booking_status: "Confirmed" })
    setCheckInDate(undefined)
    setCheckOutDate(undefined)
    setIsAddDialogOpen(false)
  }

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking)
    setFormData({
      guest_id: booking.guest_id,
      room_id: booking.room_id,
      booking_status: booking.booking_status,
    })
    setCheckInDate(new Date(booking.check_in_date))
    setCheckOutDate(new Date(booking.check_out_date))
  }

  const handleUpdateBooking = () => {
    if (!editingBooking || !checkInDate || !checkOutDate) return

    const selectedGuest = mockGuests.find((g) => g.guest_id === formData.guest_id)
    const selectedRoom = mockRooms.find((r) => r.room_id === formData.room_id)

    if (!selectedGuest || !selectedRoom) return

    const nights = calculateNights(checkInDate, checkOutDate)
    const total = calculateTotal(formData.room_id, checkInDate, checkOutDate)

    setBookings(
      bookings.map((booking) =>
        booking.booking_id === editingBooking.booking_id
          ? {
              ...booking,
              guest_id: formData.guest_id,
              guest_name: selectedGuest.name,
              room_id: formData.room_id,
              room_number: selectedRoom.room_number,
              room_type: selectedRoom.room_type,
              check_in_date: format(checkInDate, "yyyy-MM-dd"),
              check_out_date: format(checkOutDate, "yyyy-MM-dd"),
              total_amount: total,
              booking_status: formData.booking_status,
              nights,
            }
          : booking,
      ),
    )
    setEditingBooking(null)
    setFormData({ guest_id: "", room_id: "", booking_status: "Confirmed" })
    setCheckInDate(undefined)
    setCheckOutDate(undefined)
  }

  const handleDeleteBooking = (bookingId: string) => {
    setBookings(bookings.filter((booking) => booking.booking_id !== bookingId))
  }

  const handleStatusChange = (bookingId: string, newStatus: Booking["booking_status"]) => {
    setBookings(
      bookings.map((booking) =>
        booking.booking_id === bookingId ? { ...booking, booking_status: newStatus } : booking,
      ),
    )
  }

  const getStatusColor = (status: Booking["booking_status"]) => {
    switch (status) {
      case "Confirmed":
        return "default"
      case "Completed":
        return "secondary"
      case "Cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  const bookingStats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.booking_status === "Confirmed").length,
    completed: bookings.filter((b) => b.booking_status === "Completed").length,
    cancelled: bookings.filter((b) => b.booking_status === "Cancelled").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNav />

      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Bookings</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Manage reservations and guest bookings</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  New Booking
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Booking</DialogTitle>
                  <DialogDescription>Enter the booking details below.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="guest">Guest</Label>
                    <Select
                      value={formData.guest_id}
                      onValueChange={(value) => setFormData({ ...formData, guest_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select guest" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockGuests.map((guest) => (
                          <SelectItem key={guest.guest_id} value={guest.guest_id}>
                            {guest.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="room">Room</Label>
                    <Select
                      value={formData.room_id}
                      onValueChange={(value) => setFormData({ ...formData, room_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockRooms
                          .filter((room) => room.available)
                          .map((room) => (
                            <SelectItem key={room.room_id} value={room.room_id}>
                              Room {room.room_number} - {room.room_type} (${room.price}/night)
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Check-in Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkInDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkInDate ? format(checkInDate, "PPP") : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={checkInDate} onSelect={setCheckInDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>Check-out Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkOutDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOutDate ? format(checkOutDate, "PPP") : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={checkOutDate} onSelect={setCheckOutDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  {checkInDate && checkOutDate && formData.room_id && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Nights:</span>
                          <span>{calculateNights(checkInDate, checkOutDate)}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>${calculateTotal(formData.room_id, checkInDate, checkOutDate)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <Button onClick={handleAddBooking} className="w-full">
                    Create Booking
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 sm:pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold">{bookingStats.total}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{bookingStats.confirmed}</div>
              <p className="text-xs text-muted-foreground">Confirmed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{bookingStats.completed}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold text-red-600">{bookingStats.cancelled}</div>
              <p className="text-xs text-muted-foreground">Cancelled</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-4 sm:mb-6">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant="secondary" className="self-center">
                  {filteredBookings.length} bookings
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 sm:space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.booking_id}>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-xs sm:text-sm">
                        {booking.booking_id.slice(-3)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold truncate">{booking.guest_name}</h3>
                      <div className="flex flex-col space-y-1 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{booking.booking_id}</span>
                        </div>
                        <div className="flex items-center">
                          <Bed className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                          Room {booking.room_number} ({booking.room_type})
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(booking.booking_status)} className="text-xs">
                      {booking.booking_status}
                    </Badge>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 text-xs sm:text-sm text-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                        {booking.check_in_date} to {booking.check_out_date}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />${booking.total_amount} (
                        {booking.nights} nights)
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Select
                        value={booking.booking_status}
                        onValueChange={(value: Booking["booking_status"]) =>
                          handleStatusChange(booking.booking_id, value)
                        }
                      >
                        <SelectTrigger className="w-28 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={() => handleEditBooking(booking)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteBooking(booking.booking_id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={!!editingBooking} onOpenChange={() => setEditingBooking(null)}>
          <DialogContent className="mx-4 max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Booking</DialogTitle>
              <DialogDescription>Update the booking details below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_guest">Guest</Label>
                <Select
                  value={formData.guest_id}
                  onValueChange={(value) => setFormData({ ...formData, guest_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGuests.map((guest) => (
                      <SelectItem key={guest.guest_id} value={guest.guest_id}>
                        {guest.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_room">Room</Label>
                <Select
                  value={formData.room_id}
                  onValueChange={(value) => setFormData({ ...formData, room_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRooms.map((room) => (
                      <SelectItem key={room.room_id} value={room.room_id}>
                        Room {room.room_number} - {room.room_type} (${room.price}/night)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Check-in Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkInDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkInDate ? format(checkInDate, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={checkInDate} onSelect={setCheckInDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Check-out Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOutDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOutDate ? format(checkOutDate, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={checkOutDate} onSelect={setCheckOutDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {checkInDate && checkOutDate && formData.room_id && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Nights:</span>
                      <span>{calculateNights(checkInDate, checkOutDate)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${calculateTotal(formData.room_id, checkInDate, checkOutDate)}</span>
                    </div>
                  </div>
                </div>
              )}
              <Button onClick={handleUpdateBooking} className="w-full">
                Update Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
