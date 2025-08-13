"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Bed,
  Calendar,
  CreditCard,
  UserCheck,
  Wrench,
  Settings,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { useGuests } from "../hooks/use-guests";
import { useBooking } from "@/hooks/use-booking";
import { useRooms } from "@/hooks/use-room";

export default function Dashboard() {
  const { data: guests, isLoading, isError } = useGuests();
  const {
    data: bookings,
    isLoading: isBookingsLoading,
    isError: isBookingsError,
  } = useBooking();
  const {
    data: rooms,
    isLoading: isRoomsLoading,
    isError: isRoomsError,
  } = useRooms();
  console.log("guests:", guests);
  console.log("bookings:", bookings);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <MobileNav />
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Guest House
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Welcome back! Here's your property overview
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/bookings" className="hidden sm:block">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Booking
                </Button>
              </Link>
              <Link href="/bookings" className="sm:hidden">
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="col-span-2 sm:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Guests
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {guests?.guests?.length}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {rooms?.rooms?.length}
              </div>
              <p className="text-xs text-muted-foreground">of 10 rooms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {bookings?.bookings?.length}
              </div>
              <p className="text-xs text-muted-foreground">8 today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">$2,450</div>
              <p className="text-xs text-muted-foreground">+8% today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              className="flex flex-row items-center justify-between space-y-0 pb-2"
              aria-disabled={true}
            >
              <CardTitle className="text-sm font-medium">Staff</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">on duty</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">rooms</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link href="/guests">
            <Button
              variant="outline"
              className="h-20 sm:h-24 flex flex-col bg-white w-full touch-manipulation"
            >
              <Users className="h-6 w-6 mb-2" />
              <span className="text-xs sm:text-sm">Guests</span>
            </Button>
          </Link>
          <Link href="/rooms">
            <Button
              variant="outline"
              className="h-20 sm:h-24 flex flex-col bg-white w-full touch-manipulation"
            >
              <Bed className="h-6 w-6 mb-2" />
              <span className="text-xs sm:text-sm">Rooms</span>
            </Button>
          </Link>
          <Link href="/bookings">
            <Button
              variant="outline"
              className="h-20 sm:h-24 flex flex-col bg-white w-full touch-manipulation"
            >
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-xs sm:text-sm">Bookings</span>
            </Button>
          </Link>
          <Link href="/payments">
            <Button
              variant="outline"
              className="h-20 sm:h-24 flex flex-col bg-white w-full touch-manipulation"
            >
              <CreditCard className="h-6 w-6 mb-2" />
              <span className="text-xs sm:text-sm">Payments</span>
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest bookings and check-ins</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base truncate">
                    John Smith checked in
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Room 101 • 2 min ago
                  </p>
                </div>
                <Badge variant="secondary" className="ml-2 shrink-0">
                  Check-in
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base truncate">
                    New booking received
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Sarah Johnson • 15 min ago
                  </p>
                </div>
                <Badge variant="outline" className="ml-2 shrink-0">
                  Booking
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base truncate">
                    Payment processed
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    $180 • 1 hour ago
                  </p>
                </div>
                <Badge variant="secondary" className="ml-2 shrink-0">
                  Payment
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Room Status</CardTitle>
              <CardDescription>Current status of all rooms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
                {Array.from({ length: 24 }, (_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center p-2 sm:p-3 border rounded-lg bg-white touch-manipulation"
                  >
                    <div className="text-xs sm:text-sm font-medium mb-1">
                      {101 + i}
                    </div>
                    <Badge
                      variant={
                        i < 8 ? "destructive" : i < 20 ? "secondary" : "outline"
                      }
                      className="text-xs px-1 py-0"
                    >
                      {i < 8
                        ? "Occupied"
                        : i < 20
                        ? "Available"
                        : "Maintenance"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Staff & Services</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Link href="/staff">
                  <Button
                    variant="outline"
                    className="h-16 sm:h-20 flex flex-col bg-white w-full touch-manipulation"
                  >
                    <UserCheck className="h-5 w-5 mb-1" />
                    <span className="text-xs">Staff</span>
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    variant="outline"
                    className="h-16 sm:h-20 flex flex-col bg-white w-full touch-manipulation"
                  >
                    <Settings className="h-5 w-5 mb-1" />
                    <span className="text-xs">Services</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Guest Management",
                  "Room Management",
                  "Booking System",
                  "Payment Tracking",
                ].map((system) => (
                  <div
                    key={system}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">{system}</span>
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
