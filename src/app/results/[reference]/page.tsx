
import Link from 'next/link';
import Image from 'next/image';
import { sendThankYouEmail } from '@/lib/email';
import '../../styles/ResultsPage.css';
import type { Donation } from '@/domain/Donation';

async function getDonation(reference: string): Promise<Donation | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/donations/${reference}`, {
      cache: "no-store", // Deshabilitar caché para obtener siempre el estado más reciente
    });
    if (!res.ok) {
      console.error(`Error fetching donation ${reference}: ${res.statusText}`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch donation ${reference}:`, error);
    return null;
  }
}

// El tipo para los parámetros de la página
interface ResultPageProps {
  params: { 
    reference: string 
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  // No es necesario esperar `params` aquí, Next.js lo resuelve por nosotros
  // El error se debía a un `await` innecesario en una versión anterior.
  const { reference } = params;
  const donation = await getDonation(reference);

  if (!donation) {
    return <div className="result-container">Donación no encontrada o error al cargar.</div>;
  }

  // Enviar correo de agradecimiento si la donación fue aprobada
  if (donation.status === 'approved') {
    // Usamos un try-catch por si el envío de correo falla, para no bloquear la página
    try {
      await sendThankYouEmail(donation.email, `${donation.firstName} ${donation.lastName}`, donation.amount);
    } catch (emailError) {
      console.error(`Failed to send thank you email for donation ${reference}:`, emailError);
    }
  }

  const statusClasses: { [key: string]: string } = {
    approved: 'status-approved',
    rejected: 'status-rejected',
    pending: 'status-pending',
    declined: 'status-rejected', // Mapear otros posibles estados de eCollect
    failed: 'status-rejected',
  };

  const statusMessages: { [key: string]: string } = {
    approved: 'Aprobada',
    rejected: 'Rechazada',
    pending: 'Pendiente',
    declined: 'Declinada',
    failed: 'Fallida',
    processing: 'Procesando',
    error: 'Error',
  };

  const currentStatus = donation.status?.toLowerCase() || 'pending';

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
        <span className={`status ${statusClasses[currentStatus] || ''}`}>
          {statusMessages[currentStatus] || donation.status}
        </span>
      </p>
      <Link href="https://eleva.cesa.edu.co/gracias" className="result-button">
        Volver
      </Link>
    </div>
  );
}
