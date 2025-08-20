import { Room } from "@/type/room";
import { http } from "@/utils/http";

const ServiceId = {
  ROOM: "/room",
};

interface CreateRoomRequest {
  room_number: string;
  room_type_id: number;
  status: string;
  price_per_night: number;
}

interface UpdateRoomRequest {
  room_number: string;
  room_type_id: number;
  status: string;
  price_per_night: number;
}

const createRoom = async (roomData: CreateRoomRequest): Promise<Room> => {
  const result = await http.post(ServiceId.ROOM, roomData);
  return result?.data?.data;
};

const getAllRooms = async () => {
  const result = await http.get(ServiceId.ROOM);
  return result?.data?.data;
};

const updateRoom = async (
  roomId: string,
  roomData: UpdateRoomRequest
): Promise<Room> => {
  const result = await http.put(`${ServiceId.ROOM}/${roomId}`, roomData);
  return result?.data?.data;
};

const deleteRoom = async (roomId: string): Promise<void> => {
  await http.delete(`${ServiceId.ROOM}/${roomId}`);
};

const roomService = {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
};

export default roomService;
