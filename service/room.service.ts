import { http } from "@/utils/http";

const ServiceId = {
  ROOM: "/room",
};

const getAllRooms = async () => {
  const result = await http.get(ServiceId.ROOM);
  return result?.data?.data;
};

const roomService = {
  getAllRooms,
};

export default roomService;
