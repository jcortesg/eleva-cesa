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
}
