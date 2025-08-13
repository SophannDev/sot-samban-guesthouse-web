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
import { Search, Plus, Edit, Trash2, Phone, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MobileNav } from "@/components/mobile-nav"

interface Guest {
  guest_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  id_card_number: string
  total_bookings: number
  last_visit: string
}

// Mock data for demonstration
const mockGuests: Guest[] = [
  {
    guest_id: "G001",
    first_name: "John",
    last_name: "Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0123",
    id_card_number: "ID123456789",
    total_bookings: 3,
    last_visit: "2024-01-15",
  },
  {
    guest_id: "G002",
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.j@email.com",
    phone: "+1-555-0456",
    id_card_number: "ID987654321",
    total_bookings: 1,
    last_visit: "2024-01-20",
  },
  {
    guest_id: "G003",
    first_name: "Michael",
    last_name: "Brown",
    email: "m.brown@email.com",
    phone: "+1-555-0789",
    id_card_number: "ID456789123",
    total_bookings: 5,
    last_visit: "2024-01-18",
  },
]

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>(mockGuests)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    id_card_number: "",
  })

  const filteredGuests = guests.filter(
    (guest) =>
      `${guest.first_name} ${guest.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm),
  )

  const handleAddGuest = () => {
    const newGuest: Guest = {
      guest_id: `G${String(guests.length + 1).padStart(3, "0")}`,
      ...formData,
      total_bookings: 0,
      last_visit: "Never",
    }
    setGuests([...guests, newGuest])
    setFormData({ first_name: "", last_name: "", email: "", phone: "", id_card_number: "" })
    setIsAddDialogOpen(false)
  }

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest)
    setFormData({
      first_name: guest.first_name,
      last_name: guest.last_name,
      email: guest.email,
      phone: guest.phone,
      id_card_number: guest.id_card_number,
    })
  }

  const handleUpdateGuest = () => {
    if (editingGuest) {
      setGuests(guests.map((guest) => (guest.guest_id === editingGuest.guest_id ? { ...guest, ...formData } : guest)))
      setEditingGuest(null)
      setFormData({ first_name: "", last_name: "", email: "", phone: "", id_card_number: "" })
    }
  }

  const handleDeleteGuest = (guestId: string) => {
    setGuests(guests.filter((guest) => guest.guest_id !== guestId))
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
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Guests</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Manage all guest information</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guest
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Guest</DialogTitle>
                  <DialogDescription>Enter the guest's information below.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="id_card_number">ID Card Number</Label>
                    <Input
                      id="id_card_number"
                      value={formData.id_card_number}
                      onChange={(e) => setFormData({ ...formData, id_card_number: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddGuest} className="w-full">
                    Add Guest
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 sm:pb-8">
        <Card className="mb-4 sm:mb-6">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search guests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary" className="self-center">
                {filteredGuests.length} guests
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 sm:space-y-4">
          {filteredGuests.map((guest) => (
            <Card key={guest.guest_id}>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm sm:text-base">
                        {guest.first_name[0]}
                        {guest.last_name[0]}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold truncate">
                        {guest.first_name} {guest.last_name}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-0">
                        <div className="flex items-center truncate">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{guest.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                          {guest.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{guest.total_bookings} bookings</div>
                      <div className="text-xs text-gray-500">Last: {guest.last_visit}</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditGuest(guest)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteGuest(guest.guest_id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Guest Dialog */}
        <Dialog open={!!editingGuest} onOpenChange={() => setEditingGuest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Guest</DialogTitle>
              <DialogDescription>Update the guest's information below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_first_name">First Name</Label>
                  <Input
                    id="edit_first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_last_name">Last Name</Label>
                  <Input
                    id="edit_last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit_email">Email</Label>
                <Input
                  id="edit_email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_phone">Phone</Label>
                <Input
                  id="edit_phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_id_card_number">ID Card Number</Label>
                <Input
                  id="edit_id_card_number"
                  value={formData.id_card_number}
                  onChange={(e) => setFormData({ ...formData, id_card_number: e.target.value })}
                />
              </div>
              <Button onClick={handleUpdateGuest} className="w-full">
                Update Guest
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
