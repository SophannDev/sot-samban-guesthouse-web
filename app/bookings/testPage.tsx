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
  CalendarIcon,
  User,
  Bed,
  DollarSign,
  ArrowLeft,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import bookingService from "@/service/booking.service";
import { toast } from "sonner"; // or your preferred toast library

interface Booking {
  booking_id: string;
  guest_id: string;
  guest_name: string;
  room_id: string;
  room_number: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  booking_status: string;
  nights: number;
  notes?: string;
}

interface CreateBookingRequest {
  actual_check_in: string;
  actual_check_out: string;
  booking_status: string;
  total_amount: number;
  notes?: string;
  guest_ids: number;
  room_ids: number;
}

// Mock data for guests and rooms (these should ideally come from API as well)
const mockGuests = [
  { guest_id: "1", name: "John Smith" },
  { guest_id: "2", name: "Sarah Johnson" },
  { guest_id: "3", name: "Michael Brown" },
  { guest_id: "4", name: "Emma Wilson" },
];

const mockRooms = [
  {
    room_id: "1",
    room_number: "101",
    room_type: "single",
    price: 80,
    available: true,
  },
  {
    room_id: "2",
    room_number: "102",
    room_type: "double",
    price: 120,
    available: true,
  },
  {
    room_id: "3",
    room_number: "103",
    room_type: "suite",
    price: 200,
    available: true,
  },
  {
    room_id: "4",
    room_number: "201",
    room_type: "single",
    price: 85,
    available: true,
  },
];

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [formData, setFormData] = useState({
    guest_id: "",
    room_id: "",
    booking_status: "1", // Using "1" as per your API format
    notes: "",
  });

  // Fetch all bookings using React Query
  const {
    data: bookings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: bookingService.getAllBookings,
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking created successfully!");
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
    },
  });

  // Update booking mutation
  const updateBookingMutation = useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: CreateBookingRequest;
    }) => bookingService.updateBooking(bookingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking updated successfully!");
      setEditingBooking(null);
      resetForm();
    },
    onError: (error) => {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking. Please try again.");
    },
  });

  // Delete booking mutation
  const deleteBookingMutation = useMutation({
    mutationFn: bookingService.deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking. Please try again.");
    },
  });

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.booking_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.booking_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateTotal = (roomId: string, checkIn: Date, checkOut: Date) => {
    const room = mockRooms.find((r) => r.room_id === roomId);
    if (!room || !checkIn || !checkOut) return 0;
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    return room.price * nights;
  };

  const calculateNights = (checkIn: Date, checkOut: Date) => {
    if (!checkIn || !checkOut) return 0;
    return Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const formatDateForAPI = (date: Date) => {
    return format(date, "yyyyMMdd");
  };

  const resetForm = () => {
    setFormData({ guest_id: "", room_id: "", booking_status: "1", notes: "" });
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
  };

  const handleAddBooking = () => {
    if (
      !checkInDate ||
      !checkOutDate ||
      !formData.guest_id ||
      !formData.room_id
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const total = calculateTotal(formData.room_id, checkInDate, checkOutDate);

    const bookingData: CreateBookingRequest = {
      actual_check_in: formatDateForAPI(checkInDate),
      actual_check_out: formatDateForAPI(checkOutDate),
      booking_status: formData.booking_status,
      total_amount: total,
      notes: formData.notes || undefined,
      guest_ids: parseInt(formData.guest_id),
      room_ids: parseInt(formData.room_id),
    };

    createBookingMutation.mutate(bookingData);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData({
      guest_id: booking.guest_id,
      room_id: booking.room_id,
      booking_status: booking.booking_status,
      notes: booking.notes || "",
    });
    setCheckInDate(new Date(booking.check_in_date));
    setCheckOutDate(new Date(booking.check_out_date));
  };

  const handleUpdateBooking = () => {
    if (!editingBooking || !checkInDate || !checkOutDate) return;

    const total = calculateTotal(formData.room_id, checkInDate, checkOutDate);

    const bookingData: CreateBookingRequest = {
      actual_check_in: formatDateForAPI(checkInDate),
      actual_check_out: formatDateForAPI(checkOutDate),
      booking_status: formData.booking_status,
      total_amount: total,
      notes: formData.notes || undefined,
      guest_ids: parseInt(formData.guest_id),
      room_ids: parseInt(formData.room_id),
    };

    updateBookingMutation.mutate({
      bookingId: editingBooking.booking_id,
      data: bookingData,
    });
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      deleteBookingMutation.mutate(bookingId);
    }
  };

  // Map booking status numbers to display names
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "1":
        return "Confirmed";
      case "2":
        return "Completed";
      case "3":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "1":
        return "default";
      case "2":
        return "secondary";
      case "3":
        return "destructive";
      default:
        return "default";
    }
  };

  const bookingStats = {
    total: bookings.length,
    confirmed: bookings.filter((b: any) => b.booking_status === "1").length,
    completed: bookings.filter((b: any) => b.booking_status === "2").length,
    cancelled: bookings.filter((b: any) => b.booking_status === "3").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading bookings</p>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["bookings"] })
            }
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNav />

      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="sm:hidden">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Bookings
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Manage reservations and guest bookings
                </p>
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
                  <DialogDescription>
                    Enter the booking details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="guest">Guest</Label>
                    <Select
                      value={formData.guest_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, guest_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select guest" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockGuests.map((guest) => (
                          <SelectItem
                            key={guest.guest_id}
                            value={guest.guest_id}
                          >
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
                      onValueChange={(value) =>
                        setFormData({ ...formData, room_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockRooms
                          .filter((room) => room.available)
                          .map((room) => (
                            <SelectItem key={room.room_id} value={room.room_id}>
                              Room {room.room_number} - {room.room_type} ($
                              {room.price}/night)
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
                              !checkInDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkInDate
                              ? format(checkInDate, "PPP")
                              : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={checkInDate}
                            onSelect={setCheckInDate}
                            initialFocus
                          />
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
                              !checkOutDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOutDate
                              ? format(checkOutDate, "PPP")
                              : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={checkOutDate}
                            onSelect={setCheckOutDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Input
                      id="notes"
                      placeholder="Add booking notes..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                    />
                  </div>
                  {checkInDate && checkOutDate && formData.room_id && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Nights:</span>
                          <span>
                            {calculateNights(checkInDate, checkOutDate)}
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>
                            $
                            {calculateTotal(
                              formData.room_id,
                              checkInDate,
                              checkOutDate
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <Button
                    onClick={handleAddBooking}
                    className="w-full"
                    disabled={createBookingMutation.isPending}
                  >
                    {createBookingMutation.isPending
                      ? "Creating..."
                      : "Create Booking"}
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
              <div className="text-xl sm:text-2xl font-bold">
                {bookingStats.total}
              </div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {bookingStats.confirmed}
              </div>
              <p className="text-xs text-muted-foreground">Confirmed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {bookingStats.completed}
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                {bookingStats.cancelled}
              </div>
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
                    <SelectItem value="1">Confirmed</SelectItem>
                    <SelectItem value="2">Completed</SelectItem>
                    <SelectItem value="3">Cancelled</SelectItem>
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
          {filteredBookings.map((booking: any) => (
            <Card key={booking.booking_id}>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-xs sm:text-sm">
                        {booking.booking_id.toString().slice(-3)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold truncate">
                        {booking.guest_name}
                      </h3>
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
                    <Badge
                      variant={getStatusColor(booking.booking_status)}
                      className="text-xs"
                    >
                      {getStatusDisplay(booking.booking_status)}
                    </Badge>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 text-xs sm:text-sm text-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                        {booking.check_in_date} to {booking.check_out_date}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                        ${booking.total_amount} ({booking.nights} nights)
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBooking(booking)}
                        disabled={updateBookingMutation.isPending}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBooking(booking.booking_id)}
                        disabled={deleteBookingMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {booking.notes && (
                    <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 p-2 rounded">
                      <span className="font-medium">Notes:</span>{" "}
                      {booking.notes}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog
          open={!!editingBooking}
          onOpenChange={() => setEditingBooking(null)}
        >
          <DialogContent className="mx-4 max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Booking</DialogTitle>
              <DialogDescription>
                Update the booking details below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_guest">Guest</Label>
                <Select
                  value={formData.guest_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, guest_id: value })
                  }
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
                  onValueChange={(value) =>
                    setFormData({ ...formData, room_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRooms.map((room) => (
                      <SelectItem key={room.room_id} value={room.room_id}>
                        Room {room.room_number} - {room.room_type} ($
                        {room.price}/night)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_status">Status</Label>
                <Select
                  value={formData.booking_status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, booking_status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Confirmed</SelectItem>
                    <SelectItem value="2">Completed</SelectItem>
                    <SelectItem value="3">Cancelled</SelectItem>
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
                          !checkInDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkInDate ? format(checkInDate, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={setCheckInDate}
                        initialFocus
                      />
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
                          !checkOutDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOutDate
                          ? format(checkOutDate, "PPP")
                          : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={setCheckOutDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label htmlFor="edit_notes">Notes</Label>
                <Input
                  id="edit_notes"
                  placeholder="Add booking notes..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
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
                      <span>
                        $
                        {calculateTotal(
                          formData.room_id,
                          checkInDate,
                          checkOutDate
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <Button
                onClick={handleUpdateBooking}
                className="w-full"
                disabled={updateBookingMutation.isPending}
              >
                {updateBookingMutation.isPending
                  ? "Updating..."
                  : "Update Booking"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
