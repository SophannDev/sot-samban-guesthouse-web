import { http } from "@/utils/http";

const ServiceId = {
  PAYMENT: "/payments",
};

const getAllPayments = async () => {
  try {
    const result = await http.get(`${ServiceId.PAYMENT}`);
    return result?.data?.data || [];
  } catch (error) {
    console.error("Error fetching payments:", error);
  }
};

const paymentService = {
  getAllPayments,
};

export default paymentService;
