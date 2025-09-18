
export interface Donation {
  id: string;
  reference: string;
  docType: string;
  docNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  amount: number;
  status: 'approved' | 'rejected' | 'pending' | 'processing' | 'error';
  created_at: Date;
  updated_at: Date;
  ticket_id: string;
}

export type CreateDonationDTO = Omit<Donation, 'id' | 'created_at' | 'updated_at'>;
