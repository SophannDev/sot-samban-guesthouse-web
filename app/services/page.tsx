"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  ArrowLeft,
  Filter,
  Utensils,
  Car,
  Shirt,
  Wifi,
  Coffee,
  Dumbbell,
} from "lucide-react"
import Link from "next/link"

interface Service {
  service_id: string
  service_name: string
  service_price: number
  description: string
  category: "Food & Beverage" | "Transportation" | "Laundry" | "Recreation" | "Business"
  availability: "Available" | "Unavailable"
  duration_minutes?: number
}

interface BookingService {
  id: string
  booking_id: string
  service_id: string
  quantity: number
  guest_name: string
  room_number: string
  service_name: string
  unit_price: number
  total_price: number
  status: "Requested" | "In Progress" | "Completed" | "Cancelled"
  requested_date: string
}

// Mock data for demonstration
const mockServices: Service[] = [
  {
    service_id: "SV001",
    service_name: "Breakfast",
    service_price: 15,
    description: "Continental breakfast served in your room or dining area",
    category: "Food & Beverage",
    availability: "Available",
    duration_minutes: 30,
  },
  {
    service_id: "SV002",
    service_name: "Laundry Service",
    service_price: 25,
    description: "Professional laundry and dry cleaning service",
    category: "Laundry",
    availability: "Available",
    duration_minutes: 240,
  },
  {
    service_id: "SV003",
    service_name: "Airport Pickup",
    service_price: 45,
    description: "Private transportation to/from airport",
    category: "Transportation",
    availability: "Available",
    duration_minutes: 60,
  },
  {
    service_id: "SV004",
    service_name: "Room Service Dinner",
    service_price: 35,
    description: "Gourmet dinner delivered to your room",
    category: "Food & Beverage",
    availability: "Available",
    duration_minutes: 45,
  },
  {
    service_id: "SV005",
    service_name: "Gym Access",
    service_price: 10,
    description: "24-hour access to fitness center",
    category: "Recreation",
    availability: "Available",
  },
  {
    service_id: "SV006",
    service_name: "Business Center",
    service_price: 20,
    description: "Access to computers, printer, and meeting room",
    category: "Business",
    availability: "Unavailable",
  },
]

const mockBookingServices: BookingService[] = [
  {
    id: "BS001",
    booking_id: "B001",
    service_id: "SV001",
    quantity: 2,
    guest_name: "John Smith",
    room_number: "101",
    service_name: "Breakfast",
    unit_price: 15,
    total_price: 30,
    status: "Completed",
    requested_date: "2024-01-21",
  },
  {
    id: "BS002",
    booking_id: "B002",
    service_id: "SV003",
    quantity: 1,
    guest_name: "Sarah Johnson",
    room_number: "202",
    service_name: "Airport Pickup",
    unit_price: 45,
    total_price: 45,
    status: "In Progress",
    requested_date: "2024-01-23",
  },
  {
    id: "BS003",
    booking_id: "B001",
    service_id: "SV002",
    quantity: 1,
    guest_name: "John Smith",
    room_number: "101",
    service_name: "Laundry Service",
    unit_price: 25,
    total_price: 25,
    status: "Requested",
    requested_date: "2024-01-22",
  },
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices)
  const [bookingServices, setBookingServices] = useState<BookingService[]>(mockBookingServices)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"services" | "orders">("services")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    service_name: "",
    service_price: 0,
    description: "",
    category: "Food & Beverage" as const,
    availability: "Available" as const,
    duration_minutes: 0,
  })

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter
    const matchesAvailability = availabilityFilter === "all" || service.availability === availabilityFilter
    return matchesSearch && matchesCategory && matchesAvailability
  })

  const handleAddService = () => {
    const newService: Service = {
      service_id: `SV${String(services.length + 1).padStart(3, "0")}`,
      ...formData,
    }
    setServices([...services, newService])
    setFormData({
      service_name: "",
      service_price: 0,
      description: "",
      category: "Food & Beverage",
      availability: "Available",
      duration_minutes: 0,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setFormData({
      service_name: service.service_name,
      service_price: service.service_price,
      description: service.description,
      category: service.category,
      availability: service.availability,
      duration_minutes: service.duration_minutes || 0,
    })
  }

  const handleUpdateService = () => {
    if (editingService) {
      setServices(
        services.map((service) =>
          service.service_id === editingService.service_id ? { ...service, ...formData } : service,
        ),
      )
      setEditingService(null)
      setFormData({
        service_name: "",
        service_price: 0,
        description: "",
        category: "Food & Beverage",
        availability: "Available",
        duration_minutes: 0,
      })
    }
  }

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter((service) => service.service_id !== serviceId))
  }

  const handleAvailabilityChange = (serviceId: string, newAvailability: Service["availability"]) => {
    setServices(
      services.map((service) =>
        service.service_id === serviceId ? { ...service, availability: newAvailability } : service,
      ),
    )
  }

  const handleOrderStatusChange = (orderId: string, newStatus: BookingService["status"]) => {
    setBookingServices(bookingServices.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const getCategoryIcon = (category: Service["category"]) => {
    switch (category) {
      case "Food & Beverage":
        return <Utensils className="h-4 w-4" />
      case "Transportation":
        return <Car className="h-4 w-4" />
      case "Laundry":
        return <Shirt className="h-4 w-4" />
      case "Recreation":
        return <Dumbbell className="h-4 w-4" />
      case "Business":
        return <Wifi className="h-4 w-4" />
      default:
        return <Coffee className="h-4 w-4" />
    }
  }

  const getAvailabilityColor = (availability: Service["availability"]) => {
    return availability === "Available" ? "secondary" : "destructive"
  }

  const getOrderStatusColor = (status: BookingService["status"]) => {
    switch (status) {
      case "Requested":
        return "outline"
      case "In Progress":
        return "default"
      case "Completed":
        return "secondary"
      case "Cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const serviceStats = {
    total: services.length,
    available: services.filter((s) => s.availability === "Available").length,
    unavailable: services.filter((s) => s.availability === "Unavailable").length,
    totalOrders: bookingServices.length,
    activeOrders: bookingServices.filter((o) => o.status === "Requested" || o.status === "In Progress").length,
    completedOrders: bookingServices.filter((o) => o.status === "Completed").length,
    totalRevenue: bookingServices.filter((o) => o.status === "Completed").reduce((sum, o) => sum + o.total_price, 0),
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
                <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
                <p className="text-gray-600">Manage guest services and additional offerings</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Service</DialogTitle>
                  <DialogDescription>Enter the service details below.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="service_name">Service Name</Label>
                    <Input
                      id="service_name"
                      value={formData.service_name}
                      onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                      placeholder="e.g., Room Service, Spa Treatment"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the service..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="service_price">Price ($)</Label>
                      <Input
                        id="service_price"
                        type="number"
                        value={formData.service_price}
                        onChange={(e) => setFormData({ ...formData, service_price: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration_minutes}
                        onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: Service["category"]) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Laundry">Laundry</SelectItem>
                        <SelectItem value="Recreation">Recreation</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value: Service["availability"]) =>
                        setFormData({ ...formData, availability: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddService} className="w-full">
                    Add Service
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Service Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{serviceStats.total}</div>
              <p className="text-xs text-muted-foreground">Total Services</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{serviceStats.available}</div>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{serviceStats.activeOrders}</div>
              <p className="text-xs text-muted-foreground">Active Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">${serviceStats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">Service Revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button variant={activeTab === "services" ? "default" : "outline"} onClick={() => setActiveTab("services")}>
            Services
          </Button>
          <Button variant={activeTab === "orders" ? "default" : "outline"} onClick={() => setActiveTab("orders")}>
            Service Orders
          </Button>
        </div>

        {activeTab === "services" && (
          <>
            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search services by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Laundry">Laundry</SelectItem>
                      <SelectItem value="Recreation">Recreation</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="secondary">{filteredServices.length} services</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => (
                <Card key={service.service_id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        {getCategoryIcon(service.category)}
                        <span className="ml-2">{service.service_name}</span>
                      </CardTitle>
                      <Badge variant={getAvailabilityColor(service.availability)}>{service.availability}</Badge>
                    </div>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="font-semibold">${service.service_price}</span>
                      </div>
                      <Badge variant="outline">{service.category}</Badge>
                    </div>

                    {service.duration_minutes && (
                      <div className="text-sm text-muted-foreground">Duration: {service.duration_minutes} minutes</div>
                    )}

                    <div className="flex flex-col gap-2">
                      <Select
                        value={service.availability}
                        onValueChange={(value: Service["availability"]) =>
                          handleAvailabilityChange(service.service_id, value)
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Unavailable">Unavailable</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditService(service)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteService(service.service_id)}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <div className="grid gap-4">
            {bookingServices.map((order) => (
              <Card key={order.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        {getCategoryIcon(
                          services.find((s) => s.service_id === order.service_id)?.category || "Food & Beverage",
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{order.service_name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Order: {order.id}</span>
                          <span>Guest: {order.guest_name}</span>
                          <span>Room: {order.room_number}</span>
                          <span>Quantity: {order.quantity}</span>
                          <span>Date: {order.requested_date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">${order.total_price}</div>
                        <div className="text-xs text-gray-500">
                          ${order.unit_price} × {order.quantity}
                        </div>
                      </div>
                      <Badge variant={getOrderStatusColor(order.status)}>{order.status}</Badge>
                      <Select
                        value={order.status}
                        onValueChange={(value: BookingService["status"]) => handleOrderStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Requested">Requested</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Service Dialog */}
        <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>Update the service details below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_service_name">Service Name</Label>
                <Input
                  id="edit_service_name"
                  value={formData.service_name}
                  onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_description">Description</Label>
                <Textarea
                  id="edit_description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_service_price">Price ($)</Label>
                  <Input
                    id="edit_service_price"
                    type="number"
                    value={formData.service_price}
                    onChange={(e) => setFormData({ ...formData, service_price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_duration">Duration (minutes)</Label>
                  <Input
                    id="edit_duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit_category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: Service["category"]) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Laundry">Laundry</SelectItem>
                    <SelectItem value="Recreation">Recreation</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_availability">Availability</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value: Service["availability"]) => setFormData({ ...formData, availability: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdateService} className="w-full">
                Update Service
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
