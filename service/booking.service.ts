import { http } from "@/utils/http";

const ServiceId = {
  BOOKING: "/bookings",
};

const getAllBookings = async () => {
  const result = await http.get(ServiceId.BOOKING);
  return result?.data?.data;
};

const bookingService = {
  getAllBookings,
};

export default bookingService;
