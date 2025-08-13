"use client";
import { useQuery } from "@tanstack/react-query";
import bookingService from "@/service/booking.service";

export const useBooking = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      try {
        const result = await bookingService.getAllBookings();
        return result;
      } catch (error: any) {
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
