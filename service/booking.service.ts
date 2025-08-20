import { http } from "@/utils/http";
import {
  CreateBookingRequest,
  BookingResponse,
  UpdateBookingRequest,
} from "@/type/booking";

const ServiceId = {
  BOOKING: "/bookings",
};

const createBooking = async (
  bookingData: CreateBookingRequest
): Promise<BookingResponse> => {
  try {
    const result = await http.post(ServiceId.BOOKING, bookingData);
    return result?.data?.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

const getAllBookings = async () => {
  try {
    const result = await http.get(`${ServiceId.BOOKING}`);
    return result?.data?.data || [];
  } catch (error) {
    console.error("Error fetching payments:", error);
  }
};

const getBookingById = async (bookingId: string): Promise<BookingResponse> => {
  try {
    const result = await http.get(`${ServiceId.BOOKING}/${bookingId}`);
    return result?.data?.data;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};

const updateBooking = async (
  bookingId: string,
  bookingData: UpdateBookingRequest
): Promise<BookingResponse> => {
  try {
    const result = await http.put(
      `${ServiceId.BOOKING}/${bookingId}`, // Fixed template literal syntax
      bookingData
    );
    return result?.data?.data;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

const deleteBooking = async (bookingId: string): Promise<void> => {
  try {
    await http.delete(`${ServiceId.BOOKING}/${bookingId}`); // Fixed template literal syntax
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};

const bookingService = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};

export default bookingService;
