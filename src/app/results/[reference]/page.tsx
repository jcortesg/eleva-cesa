
import { donationRepository } from '@/data/donations';

async function getDonation(reference: string) {
  return await donationRepository.getByReference(reference);
}

export default async function ResultPage({ params }: { params: { reference: string } }) {
  const donation = await getDonation(params.reference);

  if (!donation) {
    return <div>Donación no encontrada.</div>;
  }

  return (
    <div>
      <h1>Resultado de la Donación</h1>
      <p>Referencia: {donation.reference}</p>
      <p>Monto: {donation.amount}</p>
      <p>Estado: {donation.status}</p>
      {/* Agrega más detalles de la donación si es necesario */}
    </div>
  );
}
