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
import { Search, Plus, Edit, Trash2, Phone, Mail, UserCheck, ArrowLeft, Filter } from "lucide-react"
import Link from "next/link"

interface Staff {
  staff_id: string
  first_name: string
  last_name: string
  role: "Receptionist" | "Cleaner" | "Manager"
  phone: string
  email: string
  status: "On Duty" | "Off Duty" | "On Leave"
  hire_date: string
  shift: "Morning" | "Evening" | "Night"
}

// Mock data for demonstration
const mockStaff: Staff[] = [
  {
    staff_id: "S001",
    first_name: "Alice",
    last_name: "Johnson",
    role: "Manager",
    phone: "+1-555-0101",
    email: "alice.johnson@guesthouse.com",
    status: "On Duty",
    hire_date: "2023-01-15",
    shift: "Morning",
  },
  {
    staff_id: "S002",
    first_name: "Bob",
    last_name: "Smith",
    role: "Receptionist",
    phone: "+1-555-0102",
    email: "bob.smith@guesthouse.com",
    status: "On Duty",
    hire_date: "2023-03-20",
    shift: "Evening",
  },
  {
    staff_id: "S003",
    first_name: "Carol",
    last_name: "Davis",
    role: "Cleaner",
    phone: "+1-555-0103",
    email: "carol.davis@guesthouse.com",
    status: "On Duty",
    hire_date: "2023-02-10",
    shift: "Morning",
  },
  {
    staff_id: "S004",
    first_name: "David",
    last_name: "Wilson",
    role: "Receptionist",
    phone: "+1-555-0104",
    email: "david.wilson@guesthouse.com",
    status: "Off Duty",
    hire_date: "2023-04-05",
    shift: "Night",
  },
  {
    staff_id: "S005",
    first_name: "Emma",
    last_name: "Brown",
    role: "Cleaner",
    phone: "+1-555-0105",
    email: "emma.brown@guesthouse.com",
    status: "On Leave",
    hire_date: "2023-05-12",
    shift: "Morning",
  },
  {
    staff_id: "S006",
    first_name: "Frank",
    last_name: "Miller",
    role: "Cleaner",
    phone: "+1-555-0106",
    email: "frank.miller@guesthouse.com",
    status: "On Duty",
    hire_date: "2023-06-18",
    shift: "Evening",
  },
]

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>(mockStaff)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    role: "Receptionist" as const,
    phone: "",
    email: "",
    status: "On Duty" as const,
    shift: "Morning" as const,
  })

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm)
    const matchesRole = roleFilter === "all" || member.role === roleFilter
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleAddStaff = () => {
    const newStaff: Staff = {
      staff_id: `S${String(staff.length + 1).padStart(3, "0")}`,
      ...formData,
      hire_date: new Date().toISOString().split("T")[0],
    }
    setStaff([...staff, newStaff])
    setFormData({
      first_name: "",
      last_name: "",
      role: "Receptionist",
      phone: "",
      email: "",
      status: "On Duty",
      shift: "Morning",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditStaff = (staffMember: Staff) => {
    setEditingStaff(staffMember)
    setFormData({
      first_name: staffMember.first_name,
      last_name: staffMember.last_name,
      role: staffMember.role,
      phone: staffMember.phone,
      email: staffMember.email,
      status: staffMember.status,
      shift: staffMember.shift,
    })
  }

  const handleUpdateStaff = () => {
    if (editingStaff) {
      setStaff(staff.map((member) => (member.staff_id === editingStaff.staff_id ? { ...member, ...formData } : member)))
      setEditingStaff(null)
      setFormData({
        first_name: "",
        last_name: "",
        role: "Receptionist",
        phone: "",
        email: "",
        status: "On Duty",
        shift: "Morning",
      })
    }
  }

  const handleDeleteStaff = (staffId: string) => {
    setStaff(staff.filter((member) => member.staff_id !== staffId))
  }

  const handleStatusChange = (staffId: string, newStatus: Staff["status"]) => {
    setStaff(staff.map((member) => (member.staff_id === staffId ? { ...member, status: newStatus } : member)))
  }

  const getRoleColor = (role: Staff["role"]) => {
    switch (role) {
      case "Manager":
        return "default"
      case "Receptionist":
        return "secondary"
      case "Cleaner":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: Staff["status"]) => {
    switch (status) {
      case "On Duty":
        return "secondary"
      case "Off Duty":
        return "outline"
      case "On Leave":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getRoleIcon = (role: Staff["role"]) => {
    switch (role) {
      case "Manager":
        return "👔"
      case "Receptionist":
        return "🏨"
      case "Cleaner":
        return "🧹"
      default:
        return "👤"
    }
  }

  const staffStats = {
    total: staff.length,
    onDuty: staff.filter((s) => s.status === "On Duty").length,
    offDuty: staff.filter((s) => s.status === "Off Duty").length,
    onLeave: staff.filter((s) => s.status === "On Leave").length,
    managers: staff.filter((s) => s.role === "Manager").length,
    receptionists: staff.filter((s) => s.role === "Receptionist").length,
    cleaners: staff.filter((s) => s.role === "Cleaner").length,
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
                <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
                <p className="text-gray-600">Manage employee information and schedules</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                  <DialogDescription>Enter the staff member's information below.</DialogDescription>
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
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: Staff["role"]) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Receptionist">Receptionist</SelectItem>
                        <SelectItem value="Cleaner">Cleaner</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: Staff["status"]) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="On Duty">On Duty</SelectItem>
                          <SelectItem value="Off Duty">Off Duty</SelectItem>
                          <SelectItem value="On Leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="shift">Shift</Label>
                      <Select
                        value={formData.shift}
                        onValueChange={(value: Staff["shift"]) => setFormData({ ...formData, shift: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Morning">Morning</SelectItem>
                          <SelectItem value="Evening">Evening</SelectItem>
                          <SelectItem value="Night">Night</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleAddStaff} className="w-full">
                    Add Staff Member
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Staff Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{staffStats.total}</div>
              <p className="text-xs text-muted-foreground">Total Staff</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{staffStats.onDuty}</div>
              <p className="text-xs text-muted-foreground">On Duty</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{staffStats.offDuty}</div>
              <p className="text-xs text-muted-foreground">Off Duty</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{staffStats.onLeave}</div>
              <p className="text-xs text-muted-foreground">On Leave</p>
            </CardContent>
          </Card>
        </div>

        {/* Role Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{staffStats.managers}</div>
              <p className="text-xs text-muted-foreground">Managers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{staffStats.receptionists}</div>
              <p className="text-xs text-muted-foreground">Receptionists</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-teal-600">{staffStats.cleaners}</div>
              <p className="text-xs text-muted-foreground">Cleaners</p>
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
                  placeholder="Search staff by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Receptionist">Receptionist</SelectItem>
                  <SelectItem value="Cleaner">Cleaner</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="On Duty">On Duty</SelectItem>
                  <SelectItem value="Off Duty">Off Duty</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary">{filteredStaff.length} staff members</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Staff List */}
        <div className="grid gap-4">
          {filteredStaff.map((staffMember) => (
            <Card key={staffMember.staff_id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {staffMember.first_name[0]}
                        {staffMember.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {staffMember.first_name} {staffMember.last_name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="mr-1">{getRoleIcon(staffMember.role)}</span>
                          {staffMember.role}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {staffMember.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {staffMember.phone}
                        </div>
                        <div className="flex items-center">
                          <UserCheck className="h-4 w-4 mr-1" />
                          {staffMember.shift} Shift
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge variant={getRoleColor(staffMember.role)} className="mb-1">
                        {staffMember.role}
                      </Badge>
                      <div className="text-xs text-gray-500">Hired: {staffMember.hire_date}</div>
                    </div>
                    <Badge variant={getStatusColor(staffMember.status)}>{staffMember.status}</Badge>
                    <Select
                      value={staffMember.status}
                      onValueChange={(value: Staff["status"]) => handleStatusChange(staffMember.staff_id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="On Duty">On Duty</SelectItem>
                        <SelectItem value="Off Duty">Off Duty</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditStaff(staffMember)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteStaff(staffMember.staff_id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Staff Dialog */}
        <Dialog open={!!editingStaff} onOpenChange={() => setEditingStaff(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
              <DialogDescription>Update the staff member's information below.</DialogDescription>
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
                <Label htmlFor="edit_role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: Staff["role"]) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Receptionist">Receptionist</SelectItem>
                    <SelectItem value="Cleaner">Cleaner</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Staff["status"]) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="On Duty">On Duty</SelectItem>
                      <SelectItem value="Off Duty">Off Duty</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit_shift">Shift</Label>
                  <Select
                    value={formData.shift}
                    onValueChange={(value: Staff["shift"]) => setFormData({ ...formData, shift: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning</SelectItem>
                      <SelectItem value="Evening">Evening</SelectItem>
                      <SelectItem value="Night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleUpdateStaff} className="w-full">
                Update Staff Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
