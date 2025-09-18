
export interface Donation {
  id: string;
  reference: string;
  amount: number;
  status: 'approved' | 'rejected' | 'pending' | 'processing' | 'error';
  destination: string;

  // Donor info
  firstName: string;
  lastName: string;
  email: string;
  docType: string;
  docNumber: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  affiliation: string;
  comments?: string;

  // Timestamps
  created_at: Date;
  updated_at: Date;
  id_type: string;
  id_number: string;
  // eCollect info
  ticket_id?: string;
  payment_url?: string;
  error_message?: string;
}
