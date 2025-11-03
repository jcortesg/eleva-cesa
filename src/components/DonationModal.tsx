import { Donation } from '@/domain/Donation';
import { translations } from '@/lib/translations';
import { formatCurrency } from '@/lib/currency';
import StatusLabel from './StatusLabel';
import '../app/admin-donations/admin-donations.css';

interface DonationModalProps {
  donation: Donation;
  onClose: () => void;
}

const t = translations.es;

export default function DonationModal({ donation, onClose }: DonationModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{t.donationDetails}</h2>
        <div className="modal-grid">
          <div>
            <p><strong>{t.firstName}:</strong> {donation.firstName}</p>
            <p><strong>{t.lastName}:</strong> {donation.lastName}</p>
            <p><strong>{t.email}:</strong> {donation.email}</p>
            <p><strong>{t.mobile}:</strong> {donation.mobile}</p>
            <p><strong>{t.idType}:</strong> {donation.idType}</p>
            <p><strong>{t.idNumber}:</strong> {donation.idNumber}</p>
            <p><strong>{t.country}:</strong> {donation.country}</p>
            <p><strong>{t.city}:</strong> {donation.city}</p>
            <p><strong>{t.address}:</strong> {donation.address}</p>
          </div>
          <div>
            <p><strong>{t.amount}:</strong> {formatCurrency(donation.amount)}</p>
            <p><strong>{t.status}:</strong> <StatusLabel status={donation.status} /></p>
            <p><strong>{t.reference}:</strong> {donation.reference}</p>
            <p><strong>{t.destination}:</strong> {donation.destination}</p>
            <p><strong>{t.affiliation}:</strong> {donation.affiliation}</p>
            <p><strong>{t.createdAt}:</strong> {new Date(donation.createdAt).toLocaleString()}</p>
            <p><strong>{t.updatedAt}:</strong> {new Date(donation.updatedAt).toLocaleString()}</p>
            <p><strong>{t.paymentUrl}:</strong> <a href={donation.paymentUrl} target="_blank" rel="noopener noreferrer">{t.link}</a></p>
            <p><strong>{t.ticketId}:</strong> {donation.ticketId}</p>
            <p><strong>{t.comments}:</strong> {donation.comments}</p>
            <p><strong>{t.termsAndConditions}:</strong> {donation.termsAndConditions ? t.accepted : t.notAccepted}</p>
          </div>
        </div>
        <button onClick={onClose}>{t.close}</button>
      </div>
    </div>
  );
}
