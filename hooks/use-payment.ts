"use client";
import { useQuery } from "@tanstack/react-query";
import paymentService from "@/service/payment.service";

export const usePayment = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      try {
        const result = await paymentService.getAllPayments();
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
