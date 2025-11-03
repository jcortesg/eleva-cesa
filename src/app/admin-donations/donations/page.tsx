'use client';

import { useState, useEffect } from 'react';
import { getDonations } from './actions';
import DonationModal from '@/components/DonationModal';
import { Donation } from '@/domain/Donation';
import { translations } from '@/lib/translations';
import { formatCurrency } from '@/lib/currency';
import StatusLabel from '@/components/StatusLabel';

const t = translations.es;

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  useEffect(() => {
    async function fetchData() {
      const donationData = await getDonations();
      setDonations(donationData);
    }
    fetchData();
  }, []);

  const handleDonationClick = (donation: Donation) => {
    setSelectedDonation(donation);
  };

  const handleCloseModal = () => {
    setSelectedDonation(null);
  };

  return (
    <div>
      <h1>{t.donations}</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>{t.name}</th>
            <th>{t.amount}</th>
            <th>{t.date}</th>
            <th>{t.status}</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id} onClick={() => handleDonationClick(donation)} style={{ cursor: 'pointer' }}>
              <td>{donation.firstName} {donation.lastName}</td>
              <td>{formatCurrency(donation.amount)}</td>
              <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
              <td><StatusLabel status={donation.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedDonation && (
        <DonationModal donation={selectedDonation} onClose={handleCloseModal} />
      )}
    </div>
  );
}