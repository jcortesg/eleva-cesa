export interface Donation {
    id?: string;
    reference: string;
    amount: number;
    destination: string;
    first_name: string;
    last_name: string;
    email: string;
    id_type: string;
    id_number: string;
    country: string;
    city: string;
    address: string;
    mobile: string;
    phone?: string;
    affiliation: string;
    comments?: string;
    payment_id?: string;
    payment_url?: string;
    status: 'pending' | 'approved' | 'rejected' | 'refunded' | 'chargeback' | 'processing' | 'error';
    created_at?: Date;
    updated_at?: Date;
  }
  