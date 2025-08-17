"use client";
import { useQuery } from "@tanstack/react-query";
import guestService from "@/service/guest.service";

// export const useGuests = () => {
//   return useQuery({
//     queryKey: ["guests"],
//     queryFn: guestService.getAllGuests,
//     retry: 1,
//     staleTime: 5 * 60 * 1000,
//     refetchOnWindowFocus: false,
//   });
// };

export const useGuests = () => {
  return useQuery({
    queryKey: ["guests"],
    queryFn: async () => {
      try {
        const result = await guestService.getAllGuests();
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

