'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { countryOptions, idTypeOptions, affiliationOptions, destinationOptions } from '@/lib/options';

const donationSchema = z.object({
  amount: z.number().min(10000, 'El monto mínimo es 10,000'),
  destination: z.string(),
  first_name: z.string().min(1, 'El nombre es requerido'),
  last_name: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  id_type: z.string(),
  id_number: z.string().min(1, 'El número de identificación es requerido'),
  country: z.string(),
  city: z.string().min(1, 'La ciudad es requerida'),
  address: z.string().min(1, 'La dirección es requerida'),
  mobile: z.string().min(1, 'El celular es requerido'),
  phone: z.string().optional(),
  affiliation: z.string(),
  comments: z.string().optional(),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar los términos y condiciones' }),
  }),
});

type DonationFormValues = z.infer<typeof donationSchema>;

const DonationForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
        amount: 50000,
        destination: 'BECAS_ELEVA',
        first_name: 'Juan',
        last_name: 'Pérez',
        email: 'juan.perez@example.com',
        id_type: 'C.C.',
        id_number: '123456789',
        country: 'Colombia',
        city: 'Bogotá',
        address: 'Calle 123 # 45 - 67',
        mobile: '3001234567',
        phone: '2345678',
        affiliation: 'GRADUADO',
        comments: 'Donación de prueba.',
        terms: true,
      },
  });

  const onSubmit: SubmitHandler<DonationFormValues> = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Network response was not ok');
      }

      const result = await response.json();

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        setError('No se recibió una URL de pago.');
      }

      setSuccess(true);
      reset();
    } catch (e: any) {
      console.error('Error adding document: ', e.message);
      setError(`Hubo un error al procesar tu donación: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Donar</h1>

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p className="font-bold">¡Redirigiendo a la pasarela de pagos!</p>
          <p>Gracias por tu generosidad. Serás redirigido para completar tu donación.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Información de la donación</h2>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Monto a donar (COP)
          </label>
          <input
            type="number"
            id="amount"
            {...register('amount', { valueAsNumber: true })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.amount ? 'border-red-500' : ''}`}
            placeholder="10000"
            min="10000"
          />
          {errors.amount && <p className="mt-2 text-sm text-red-600">{errors.amount.message}</p>}
        </div>

        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
            Destinación
          </label>
          <select
            id="destination"
            {...register('destination')}
            className={`mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${errors.destination ? 'border-red-500' : ''}`}
          >
            {destinationOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.destination && <p className="mt-2 text-sm text-red-600">{errors.destination.message}</p>}
        </div>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Datos personales y de contacto</h2>
        
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nombres</label>
            <input type="text" id="first_name" {...register('first_name')} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.first_name ? 'border-red-500' : ''}`} />
            {errors.first_name && <p className="mt-2 text-sm text-red-600">{errors.first_name.message}</p>}
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellidos</label>
            <input type="text" id="last_name" {...register('last_name')} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.last_name ? 'border-red-500' : ''}`} />
            {errors.last_name && <p className="mt-2 text-sm text-red-600">{errors.last_name.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input type="email" id="email" {...register('email')} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.email ? 'border-red-500' : ''}`} />
          {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
          <div>
            <label htmlFor="id_type" className="block text-sm font-medium text-gray-700">Tipo de identificación</label>
            <select id="id_type" {...register('id_type')} className={`mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${errors.id_type ? 'border-red-500' : ''}`}>
              {idTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.id_type && <p className="mt-2 text-sm text-red-600">{errors.id_type.message}</p>}
          </div>
          <div>
            <label htmlFor="id_number" className="block text-sm font-medium text-gray-700">Número de identificación</label>
            <input type="text" id="id_number" {...register('id_number')} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.id_number ? 'border-red-500' : ''}`} />
            {errors.id_number && <p className="mt-2 text-sm text-red-600">{errors.id_number.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">País</label>
            <select id="country" {...register('country')} className={`mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${errors.country ? 'border-red-500' : ''}`}>
              {countryOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.country && <p className="mt-2 text-sm text-red-600">{errors.country.message}</p>}
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
            <input type="text" id="city" {...register('city')} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.city ? 'border-red-500' : ''}`} />
            {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
          <input type="text" id="address" {...register('address')} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.address ? 'border-red-500' : ''}`} />
          {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Celular</label>
            <input type="tel" id="mobile" {...register('mobile')} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.mobile ? 'border-red-500' : ''}`} />
            {errors.mobile && <p className="mt-2 text-sm text-red-600">{errors.mobile.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono fijo (Opcional)</label>
            <input type="tel" id="phone" {...register('phone')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Relación con la institución</h2>

        <div>
          <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700">Afiliación con el CESA</label>
          <select id="affiliation" {...register('affiliation')} className={`mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${errors.affiliation ? 'border-red-500' : ''}`}>
            {affiliationOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.affiliation && <p className="mt-2 text-sm text-red-600">{errors.affiliation.message}</p>}
        </div>

        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700">Comentarios (Opcional)</label>
          <textarea id="comments" {...register('comments')} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>

        <hr className="my-8" />

        <div className="relative flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="terms"
              type="checkbox"
              {...register('terms')}
              className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${errors.terms ? 'border-red-500' : ''}`}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-medium text-gray-700">
              Acepto los términos y condiciones
            </label>
          </div>
        </div>
        {errors.terms && <p className="mt-2 text-sm text-red-600">{errors.terms.message}</p>}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Procesando...' : 'Donar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
