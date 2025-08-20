"use client";

import { useState, useEffect } from "react";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import roomService from "@/service/room.service";

interface Room {
  room_id: string;
  room_number: string;
  room_type: string;
  price_per_night: number;
  status: string;
  current_guest?: string;
  check_out_date?: string;
  status_label: string;
}

// Validation schema
const roomSchema = z.object({
  room_number: z.string().min(1, "Room number is required"),
  room_type_id: z.coerce.number().min(1, "Room type is required"),
  price_per_night: z.coerce
    .number()
    .min(1, "Price per night must be at least $1"),
  status: z.string().min(1, "Status is required"),
});

type RoomFormValues = z.infer<typeof roomSchema>;

// Helper functions to convert between API and display formats
const roomTypeToId = (type: string): number => {
  switch (type) {
    case "single":
      return 1;
    case "double":
      return 2;
    case "suite":
      return 3;
    default:
      return 1;
  }
};

const roomTypeFromId = (id: number): string => {
  switch (id) {
    case 1:
      return "single";
    case 2:
      return "double";
    case 3:
      return "suite";
    default:
      return "single";
  }
};

const statusToId = (status: string): string => {
  switch (status) {
    case "Available":
      return "1";
    case "Occupied":
      return "2";
    case "Maintenance":
      return "3";
    default:
      return "1";
  }
};

const statusFromId = (id: string): string => {
  switch (id) {
    case "1":
      return "Available";
    case "2":
      return "Occupied";
    case "3":
      return "Maintenance";
    default:
      return "Available";
  }
};

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Mark component as client-rendered
  useEffect(() => {
    setIsClient(true);
  }, []);
  // Form for adding new rooms
  const addForm = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      room_number: "",
      room_type_id: 1,
      price_per_night: 0,
      status: "1",
    },
  });

  // Form for editing existing rooms
  const editForm = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      room_number: "",
      room_type_id: 1,
      price_per_night: 0,
      status: "1",
    },
  });

  const queryClient = useQueryClient();
  const { data: roomsData, isLoading } = useRooms();
  const rooms = roomsData?.rooms ?? [];

  // Mark component as client-rendered
  useEffect(() => {
    setIsClient(true);
  }, []);

  const createRoomMutation = useMutation({
    mutationFn: (data: RoomFormValues) => roomService.createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      addForm.reset();
      setIsAddDialogOpen(false);
    },
    onError: (error: any) => {
      console.error("Failed to create room:", error?.message || error);
    },
  });

  const updateRoomMutation = useMutation({
    mutationFn: ({ roomId, data }: { roomId: string; data: RoomFormValues }) =>
      roomService.updateRoom(roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      editForm.reset();
      setEditingRoom(null);
    },
    onError: (error: any) => {
      console.error("Failed to update room:", error?.message || error);
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: (roomId: string) => roomService.deleteRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: any) => {
      console.error("Failed to delete room:", error?.message || error);
    },
  });

  const handleAddRoom = (data: RoomFormValues) => {
    createRoomMutation.mutate(data);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    editForm.reset({
      room_number: room.room_number,
      room_type_id: roomTypeToId(room.room_type),
      price_per_night: room.price_per_night,
      status: statusToId(room.status),
    });
  };

  const handleUpdateRoom = (data: RoomFormValues) => {
    if (editingRoom) {
      updateRoomMutation.mutate({
        roomId: editingRoom.room_id,
        data,
      });
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    deleteRoomMutation.mutate(roomId);
  };

  const handleStatusChange = (roomId: string, newStatus: string) => {
    // This would typically be handled by a separate API call
    // For now, we'll use the update mutation
    const room = rooms.find((r: Room) => r.room_id === roomId);
    if (room) {
      updateRoomMutation.mutate({
        roomId,
        data: {
          room_number: room.room_number,
          room_type_id: roomTypeToId(room.room_type),
          price_per_night: room.price_per_night,
          status: statusToId(newStatus),
        },
      });
    }
  };

  const filteredRooms = rooms.filter((room: Room) => {
    const matchesSearch =
      room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.room_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || room.status === statusFilter;
    const matchesType = typeFilter === "all" || room.room_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
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

  const getRoomTypeLabel = (type: string) => {
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
    available: rooms.filter((r: Room) => r.status === "Available").length,
    occupied: rooms.filter((r: Room) => r.status === "Occupied").length,
    maintenance: rooms.filter((r: Room) => r.status === "Maintenance").length,
  };

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
                <Form {...addForm}>
                  <form
                    onSubmit={addForm.handleSubmit(handleAddRoom)}
                    className="space-y-4"
                  >
                    <FormField
                      control={addForm.control}
                      name="room_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 101, 202" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="room_type_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Type</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            value={String(field.value)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select room type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1" defaultValue={"Single"}>
                                Single
                              </SelectItem>
                              <SelectItem value="2">Double</SelectItem>
                              <SelectItem value="3">Suite</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="price_per_night"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per Night ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1" defaultValue={"Available"}>
                                Available
                              </SelectItem>
                              <SelectItem value="2">Occupied</SelectItem>
                              <SelectItem value="3">Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createRoomMutation.isPending}
                    >
                      {createRoomMutation.isPending ? "Adding..." : "Add Room"}
                    </Button>
                  </form>
                </Form>
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
          {filteredRooms.map((room: any) => (
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
                    {room.status_label}
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
                    onValueChange={(value: string) =>
                      handleStatusChange(room.room_id, value)
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Available</SelectItem>
                      <SelectItem value="2">Occupied</SelectItem>
                      <SelectItem value="3">Maintenance</SelectItem>
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
                      disabled={deleteRoomMutation.isPending}
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
            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit(handleUpdateRoom)}
                className="space-y-4"
              >
                <FormField
                  control={editForm.control}
                  name="room_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="room_type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Single</SelectItem>
                          <SelectItem value="2">Double</SelectItem>
                          <SelectItem value="3">Suite</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="price_per_night"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Night ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Available</SelectItem>
                          <SelectItem value="2">Occupied</SelectItem>
                          <SelectItem value="3">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={updateRoomMutation.isPending}
                >
                  {updateRoomMutation.isPending ? "Updating..." : "Update Room"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
