import { http } from "@/utils/http";

const ServiceId = {
  GUEST: "/guests",
};

const getAllGuests = async () => {
  const result = await http.get(ServiceId.GUEST);
  return result?.data?.data;
};

const guestService = {
  getAllGuests,
};

export default guestService;
