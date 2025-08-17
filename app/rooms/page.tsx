"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Bed,
  DollarSign,
  ArrowLeft,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { useRooms } from "@/hooks/use-room";

interface Room {
  room_id: string;
  room_number: string;
  room_type: "single" | "double" | "suite";
  price_per_night: number;
  status: "Available" | "Occupied" | "Maintenance";
  current_guest?: string;
  check_out_date?: string;
}

// Mock data for demonstration
const mockRooms: Room[] = [
  {
    room_id: "R001",
    room_number: "101",
    room_type: "single",
    price_per_night: 80,
    status: "Occupied",
    current_guest: "John Smith",
    check_out_date: "2024-01-25",
  },
  {
    room_id: "R002",
    room_number: "102",
    room_type: "double",
    price_per_night: 120,
    status: "Available",
  },
  {
    room_id: "R003",
    room_number: "103",
    room_type: "suite",
    price_per_night: 200,
    status: "Maintenance",
  },
  {
    room_id: "R004",
    room_number: "201",
    room_type: "single",
    price_per_night: 85,
    status: "Available",
  },
  {
    room_id: "R005",
    room_number: "202",
    room_type: "double",
    price_per_night: 125,
    status: "Occupied",
    current_guest: "Sarah Johnson",
    check_out_date: "2024-01-23",
  },
  {
    room_id: "R006",
    room_number: "203",
    room_type: "suite",
    price_per_night: 220,
    status: "Available",
  },
];

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    room_number: "",
    room_type: "single" as const,
    price_per_night: 0,
    status: "Available" as const,
  });

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.room_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || room.status === statusFilter;
    const matchesType = typeFilter === "all" || room.room_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddRoom = () => {
    const newRoom: Room = {
      room_id: `R${String(rooms.length + 1).padStart(3, "0")}`,
      ...formData,
    };
    setRooms([...rooms, newRoom]);
    setFormData({
      room_number: "",
      room_type: "single",
      price_per_night: 0,
      status: "Available",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      room_number: room.room_number,
      room_type: room.room_type,
      price_per_night: room.price_per_night,
      status: room.status,
    });
  };

  const handleUpdateRoom = () => {
    if (editingRoom) {
      setRooms(
        rooms.map((room) =>
          room.room_id === editingRoom.room_id ? { ...room, ...formData } : room
        )
      );
      setEditingRoom(null);
      setFormData({
        room_number: "",
        room_type: "single",
        price_per_night: 0,
        status: "Available",
      });
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter((room) => room.room_id !== roomId));
  };

  const handleStatusChange = (roomId: string, newStatus: Room["status"]) => {
    setRooms(
      rooms.map((room) =>
        room.room_id === roomId
          ? {
              ...room,
              status: newStatus,
              ...(newStatus !== "Occupied" && {
                current_guest: undefined,
                check_out_date: undefined,
              }),
            }
          : room
      )
    );
  };

  const getStatusColor = (status: Room["status"]) => {
    switch (status) {
      case "Available":
        return "secondary";
      case "Occupied":
        return "destructive";
      case "Maintenance":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getRoomTypeLabel = (type: Room["room_type"]) => {
    switch (type) {
      case "single":
        return "Single";
      case "double":
        return "Double";
      case "suite":
        return "Suite";
      default:
        return type;
    }
  };

  const roomStats = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === "Available").length,
    occupied: rooms.filter((r) => r.status === "Occupied").length,
    maintenance: rooms.filter((r) => r.status === "Maintenance").length,
  };

  const {
    data: room,
    isLoading: isRoomsLoading,
    isError: isRoomsError,
  } = useRooms();

  console.log("room", room);

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
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Rooms
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Manage room status and pricing
                </p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Room</DialogTitle>
                  <DialogDescription>
                    Enter the room details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="room_number">Room Number</Label>
                    <Input
                      id="room_number"
                      value={formData.room_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          room_number: e.target.value,
                        })
                      }
                      placeholder="e.g., 101, 202"
                    />
                  </div>
                  <div>
                    <Label htmlFor="room_type">Room Type</Label>
                    <Select
                      value={formData.room_type}
                      onValueChange={(value: Room["room_type"]) =>
                        setFormData({ ...formData, room_type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="double">Double</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price_per_night">Price per Night ($)</Label>
                    <Input
                      id="price_per_night"
                      type="number"
                      value={formData.price_per_night}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price_per_night: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: Room["status"]) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Occupied">Occupied</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddRoom} className="w-full">
                    Add Room
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
                {roomStats.total}
              </div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {roomStats.available}
              </div>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                {roomStats.occupied}
              </div>
              <p className="text-xs text-muted-foreground">Occupied</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">
                {roomStats.maintenance}
              </div>
              <p className="text-xs text-muted-foreground">Maintenance</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-4 sm:mb-6">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Occupied">Occupied</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant="secondary" className="self-center">
                  {filteredRooms.length} rooms
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredRooms.map((room) => (
            <Card key={room.room_id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg">
                    Room {room.room_number}
                  </CardTitle>
                  <Badge
                    variant={getStatusColor(room.status)}
                    className="text-xs"
                  >
                    {room.status}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {getRoomTypeLabel(room.room_type)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-semibold">
                      ${room.price_per_night}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /night
                    </span>
                  </div>
                  <Bed className="h-4 w-4 text-muted-foreground" />
                </div>

                {room.status === "Occupied" && room.current_guest && (
                  <div className="text-sm">
                    <p className="font-medium truncate">
                      Guest: {room.current_guest}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Check-out: {room.check_out_date}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Select
                    value={room.status}
                    onValueChange={(value: Room["status"]) =>
                      handleStatusChange(room.room_id, value)
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Occupied">Occupied</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditRoom(room)}
                      className="flex-1 text-xs"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRoom(room.room_id)}
                      className="flex-1 text-xs"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Room Dialog */}
        <Dialog open={!!editingRoom} onOpenChange={() => setEditingRoom(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Room</DialogTitle>
              <DialogDescription>
                Update the room details below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_room_number">Room Number</Label>
                <Input
                  id="edit_room_number"
                  value={formData.room_number}
                  onChange={(e) =>
                    setFormData({ ...formData, room_number: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit_room_type">Room Type</Label>
                <Select
                  value={formData.room_type}
                  onValueChange={(value: Room["room_type"]) =>
                    setFormData({ ...formData, room_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_price_per_night">
                  Price per Night ($)
                </Label>
                <Input
                  id="edit_price_per_night"
                  type="number"
                  value={formData.price_per_night}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_per_night: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit_status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Room["status"]) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Occupied">Occupied</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdateRoom} className="w-full">
                Update Room
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
