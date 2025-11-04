'use client';

import { useState, useEffect } from 'react';
import { getDonations } from './actions';
import DonationModal from '@/components/DonationModal';
import { Donation } from '@/domain/Donation';
import { translations } from '@/lib/translations';
import { formatCurrency } from '@/lib/currency';
import StatusLabel from '@/components/StatusLabel';

const t = translations.es;

const PAGE_SIZE = 10;

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const { donations: donationData, total } = await getDonations(currentPage, PAGE_SIZE);
      setDonations(donationData);
      setTotalCount(total);
    }
    fetchData();
  }, [currentPage]);

  const handleDonationClick = (donation: Donation) => {
    setSelectedDonation(donation);
  };

  const handleCloseModal = () => {
    setSelectedDonation(null);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
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

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Anterior
          </button>

          <div className="pagination-numbers">
            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => handlePageClick(page)}
                  className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="pagination-ellipsis">{page}</span>
              )
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Siguiente
          </button>
        </div>
      )}

      <div className="pagination-info">
        Mostrando {donations.length > 0 ? ((currentPage - 1) * PAGE_SIZE + 1) : 0} - {Math.min(currentPage * PAGE_SIZE, totalCount)} de {totalCount} donaciones
      </div>

      {selectedDonation && (
        <DonationModal donation={selectedDonation} onClose={handleCloseModal} />
      )}
    </div>
  );
}