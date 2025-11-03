import { translations } from '@/lib/translations';

interface StatusLabelProps {
  status: string;
}

const t = translations.es;

const statusStyles: { [key: string]: { color: string; backgroundColor: string } } = {
  COMPLETED: {
    color: '#1a5d1a', // Dark green text
    backgroundColor: '#c8e6c9', // Light green background
  },
  PENDING: {
    color: '#b26a00', // Dark yellow text
    backgroundColor: '#ffecb3', // Light yellow background
  },
  FAILED: {
    color: '#b71c1c', // Dark red text
    backgroundColor: '#ffcdd2', // Light red background
  },
};

export default function StatusLabel({ status }: StatusLabelProps) {
  const style = statusStyles[status] || {};
  const translatedStatus = t.donationStatus[status as keyof typeof t.donationStatus] || status;

  return (
    <span
      style={{
        padding: '3px 8px',
        borderRadius: '12px',
        fontWeight: 'bold',
        ...style,
      }}
    >
      {translatedStatus}
    </span>
  );
}
