'use client';

import { useEffect, useState } from 'react';
import { getDonations } from './donations/actions';
import { Donation } from '@/domain/Donation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { translations } from '@/lib/translations';
import { formatCurrency } from '@/lib/currency';

const t = translations.es;

export default function AdminDashboardPage() {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Fetch all donations for dashboard statistics (using a large page size)
      const { donations: donationData } = await getDonations(1, 1000);
      setDonations(donationData);
    }
    fetchData();
  }, []);

  const totalDonations = donations.reduce((acc, donation) => acc + donation.amount, 0);
  const donationsByStatus = donations.reduce((acc, donation) => {
    acc[donation.status] = (acc[donation.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const lastMonthDonations = donations.filter(donation => {
    const donationDate = new Date(donation.createdAt);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return donationDate > lastMonth;
  });

  const lastMonthChartData = lastMonthDonations.reduce((acc, donation) => {
    const date = new Date(donation.createdAt).toLocaleDateString();
    const existingEntry = acc.find(entry => entry.date === date);
    if (existingEntry) {
      existingEntry.amount += donation.amount;
    } else {
      acc.push({ date, amount: donation.amount });
    }
    return acc;
  }, [] as { date: string; amount: number }[]);

  return (
    <div>
      <h1>{t.adminDashboard}</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <h2>{t.totalDonations}</h2>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{formatCurrency(totalDonations)}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <h2>{t.donationsByStatus}</h2>
          <ul>
            {Object.entries(donationsByStatus).map(([status, count]) => (
              <li key={status}>
                {t.donationStatus[status as keyof typeof t.donationStatus] || status}: {count}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h2>{t.donationsLast30Days}</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={lastMonthChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" name={t.amount} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}