
import Link from 'next/link';
import Image from 'next/image';
import '../../styles/ResultsPage.css';

// Type for the API response (snake_case from Firestore)
type DonationResponse = {
  reference: string;
  amount: number;
  status: string;
  email: string;
  first_name: string;
  last_name: string;
  [key: string]: any;
};

async function getDonation(reference: string): Promise<DonationResponse | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/donations/${reference}`, {
      cache: "no-store",
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

type Ctx = { params: Promise<{ reference: string }> };

export default async function ResultPage({ params }: Ctx) {
  const { reference } = await params;
  const donation = await getDonation(reference);

  const renderContent = () => {
    if (!donation) {
      return <div className="result-card"><h1>Donación no encontrada</h1><p>No pudimos encontrar los detalles de tu donación. Por favor, verifica la URL o contacta a soporte.</p></div>;
    }

    // Email is now handled in the API route when status changes to approved

    const statusClasses: { [key: string]: string } = {
      approved: 'status-approved',
      rejected: 'status-rejected',
      pending: 'status-pending',
      processing: 'status-processing',
      declined: 'status-rejected',
      failed: 'status-rejected',
    };

    const statusMessages: { [key: string]: string } = {
      approved: 'Aprobada',
      rejected: 'Rechazada',
      pending: 'Pendiente',
      processing: 'Procesando',
      declined: 'Declinada',
      failed: 'Fallida',
      error: 'Error',
    };

    const currentStatus = donation.status?.toLowerCase() || 'pending';

    return (
      <div className="result-card">
        <h1>Resultado de la Donación</h1>
        <p><strong>Nombre:</strong> {donation.first_name} {donation.last_name}</p>
        <p><strong>Referencia:</strong> {donation.reference}</p>
        <p><strong>Monto (COP):</strong> ${new Intl.NumberFormat('es-CO').format(donation.amount)}</p>
        <p>
          <strong>Estado:</strong>
          <span className={`status ${statusClasses[currentStatus] || ''}`}>
            {statusMessages[currentStatus] || donation.status}
          </span>
        </p>
        {donation.status === 'approved' && (
          <p className="success-message">
            ¡Gracias por tu donación! Hemos enviado un correo de confirmación a {donation.email}.
          </p>
        )}
        <Link href="https://eleva.cesa.edu.co/gracias" className="result-button">
          Finalizar
        </Link>
      </div>
    );
  };

  const content = renderContent();

  return (
    <div className="result-container">
      <div className="logo-container">
        <div className="logo-cesa-wrapper">
            <Image src="/logos/cesa.png" alt="CESA Logo" fill style={{objectFit:"contain"}} />
        </div>
        <div className="logo-eleva-wrapper">
            <Image src="/logos/eleva-cesa.png" alt="Eleva CESA Logo" fill style={{objectFit:"contain"}}/>
        </div>
      </div>
      {content}
    </div>
  );
}
