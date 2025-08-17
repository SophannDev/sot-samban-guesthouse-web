// Type for the request payload
export interface GuestPayload {
  first_name: string
  last_name: string
  email: string
  phone: string
  id_document_number: string
}

// Type for the guest returned from API
export interface Guest extends GuestPayload {
  guest_id: string
  total_bookings: number
  last_visit: string
  updated_at: string
}