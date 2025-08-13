"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import guestService from "@/service/guest.service";

export const useGuests = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return useQuery({
    queryKey: ["guests"],
    queryFn: guestService.getAllGuests,
    // ✅ Only run after client-side hydration
    enabled: isClient,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
