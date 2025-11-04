// Client-facing interface (camelCase)
export interface Donation {
  id: string;
  address: string;
  affiliation: string;
  amount: number;
  city: string;
  comments?: string;
  country: string;
  createdAt: string;
  destination: string;
  email: string;
  firstName: string;
  idNumber: string;
  idType: string;
  lastName: string;
  mobile: string;
  paymentUrl?: string;
  reference: string;
  status: 'approved' | 'rejected' | 'pending' | 'processing' | 'error';
  termsAndConditions: boolean;
  ticketId?: string;
  updatedAt: string;
  errorMessage?: string;
}

// Firestore document interface (snake_case)
export interface DonationDocument {
  address: string;
  affiliation: string;
  amount: number;
  city: string;
  comments?: string;
  country: string;
  created_at: Date;
  destination: string;
  email: string;
  first_name: string;
  id_number: string;
  id_type: string;
  last_name: string;
  mobile: string;
  payment_url?: string;
  reference: string;
  status: 'approved' | 'rejected' | 'pending' | 'processing' | 'error';
  terms_and_conditions: boolean;
  ticket_id?: string;
  updated_at: Date;
  error_message?: string;
}

export type CreateDonationDTO = Omit<DonationDocument, 'created_at' | 'updated_at'>;
