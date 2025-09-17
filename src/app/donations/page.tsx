import DonationForm from '@/components/DonationForm';

export default function DonationPage() {
  return (
    <div className="bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Haz tu donación
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Al apoyar ELEVA, la comunidad CESA se convierte en protagonista de un futuro más justo, solidario y esperanzador, dejando una huella que trasciende generaciones.
          </p>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Tu contribución es fundamental para seguir transformando vidas. Gracias por tu generosidad.
          </p>
        </div>
        <div className="mt-10">
          <DonationForm />
        </div>
      </div>
    </div>
  );
}
