import { Guest, GuestPayload } from "@/type/guest";
import { http } from "@/utils/http";

const ServiceId = {
  GUEST: "/guests",
};

const createGuest = async (guestData: GuestPayload): Promise<Guest> => {
  const result = await http.post(ServiceId.GUEST, guestData);
  return result?.data?.data;
};

const getAllGuests = async () => {
  const result = await http.get(ServiceId.GUEST);
  return result?.data?.data;
};

const guestService = {
  getAllGuests,
  createGuest,
};

export default guestService;
