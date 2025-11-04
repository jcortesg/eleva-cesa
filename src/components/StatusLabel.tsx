import { translations } from '@/lib/translations';

interface StatusLabelProps {
  status: string;
}

const t = translations.es;

const statusStyles: { [key: string]: { color: string; backgroundColor: string } } = {
  // Estados de éxito
  approved: {
    color: '#1a5d1a', // Dark green text
    backgroundColor: '#c8e6c9', // Light green background
  },
  APPROVED: {
    color: '#1a5d1a',
    backgroundColor: '#c8e6c9',
  },
  COMPLETED: {
    color: '#1a5d1a',
    backgroundColor: '#c8e6c9',
  },

  // Estados pendientes/procesando
  pending: {
    color: '#b26a00', // Dark yellow/orange text
    backgroundColor: '#ffecb3', // Light yellow background
  },
  PENDING: {
    color: '#b26a00',
    backgroundColor: '#ffecb3',
  },
  processing: {
    color: '#0277bd', // Dark blue text
    backgroundColor: '#b3e5fc', // Light blue background
  },
  PROCESSING: {
    color: '#0277bd',
    backgroundColor: '#b3e5fc',
  },
  created: {
    color: '#5d4037', // Dark brown text
    backgroundColor: '#d7ccc8', // Light brown background
  },
  CREATED: {
    color: '#5d4037',
    backgroundColor: '#d7ccc8',
  },

  // Estados de error/rechazo
  rejected: {
    color: '#b71c1c', // Dark red text
    backgroundColor: '#ffcdd2', // Light red background
  },
  REJECTED: {
    color: '#b71c1c',
    backgroundColor: '#ffcdd2',
  },
  declined: {
    color: '#b71c1c',
    backgroundColor: '#ffcdd2',
  },
  DECLINED: {
    color: '#b71c1c',
    backgroundColor: '#ffcdd2',
  },
  failed: {
    color: '#b71c1c',
    backgroundColor: '#ffcdd2',
  },
  FAILED: {
    color: '#b71c1c',
    backgroundColor: '#ffcdd2',
  },
  error: {
    color: '#b71c1c',
    backgroundColor: '#ffcdd2',
  },
  ERROR: {
    color: '#b71c1c',
    backgroundColor: '#ffcdd2',
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
