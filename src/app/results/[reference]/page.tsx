
import Link from 'next/link';
import Image from 'next/image';
import { donationRepository } from '@/data/donations';
import '../../styles/ResultPage.css';

async function getDonation(reference: string) {
  return await donationRepository.getByReference(reference);
}

export default async function ResultPage({ params }: { params: { reference: string } }) {
  const donation = await getDonation(params.reference);

  if (!donation) {
    return <div className="result-container">Donación no encontrada.</div>;
  }

  const statusClasses: { [key: string]: string } = {
    approved: 'status-approved',
    rejected: 'status-rejected',
    pending: 'status-pending',
  };

  const statusMessages: { [key: string]: string } = {
    approved: 'Aprobada',
    rejected: 'Rechazada',
    pending: 'Pendiente',
    processing: 'Procesando',
    error: 'Error',
  };

  return (
    <div className="result-container">
        <div className="logo-container">
            <Image src="/logos/cesa.png" alt="CESA Logo" className="logo-cesa" width={150} height={50} />
            <Image src="/logos/eleva-cesa.png" alt="Eleva CESA Logo" className="logo-eleva" width={150} height={50} />
      </div>
      <h1>Resultado de la Donación</h1>
      <p><strong>Referencia:</strong> {donation.reference}</p>
      <p><strong>Monto de la donación (COP):</strong> ${new Intl.NumberFormat('es-CO').format(donation.amount)}</p>
      <p>
        <strong>Estado:</strong>
        <span className={`status ${statusClasses[donation.status] || ''}`}>
          {statusMessages[donation.status] || donation.status}
        </span>
      </p>
      <Link href="https://eleva.cesa.edu.co/gracias" className="result-button">
        Volver
      </Link>
    </div>
  );
}
