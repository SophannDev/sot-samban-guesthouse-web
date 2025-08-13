"use client";
import { useQuery } from "@tanstack/react-query";
import roomService from "@/service/room.service";

export const useRooms = () => {
  return useQuery({
    queryKey: ["room"],
    queryFn: async () => {
      try {
        const result = await roomService.getAllRooms();
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
