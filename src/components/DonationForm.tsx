'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { countryOptions, destinationOptions } from '@/lib/options';
import '../app/styles/DonationForm.css';
import TermsModal from './TermsModal';

const donationSchema = z.object({
  amount: z.number()
    .min(10000, 'El monto mínimo es de 10,000 COP')
    .max(3000000, 'El monto máximo es de 3,000,000 COP'),
  destination: z.string().min(1, 'Seleccione un destino del donativo'),
  title: z.string().optional(),
  first_name: z.string().min(1, 'El nombre es requerido'),
  last_name: z.string().min(1, 'El apellido es requerido'),
  id_type: z.string().min(1, 'El tipo de documento es requerido'),
  id_number: z.string().min(1, 'El número de documento es requerido'),
  country: z.string().min(1, 'El país es requerido'),
  city: z.string().min(1, 'La ciudad es requerida'),
  address: z.string().min(1, 'La dirección es requerida'),
  email: z.string().email('Email inválido'),
  mobile: z.string().min(1, 'El teléfono es requerido'),
  phone: z.string().optional(),
  affiliation: z.string().min(1, 'La afiliación es requerida'),
  comments: z.string().optional(),
  terms_and_conditions: z.literal(true, {
    errorMap: () => ({ message: 'Debe aceptar los términos y condiciones' }),
  }),
});

type DonationFormValues = z.infer<typeof donationSchema>;

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const AmountButton: React.FC<{ value: number; selected: boolean; onClick: () => void }> = ({ value, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={selected ? 'selected' : 'unselected'}
  >
    {formatCurrency(value)}
  </button>
);

const DonationForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | 'other'>(250000);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 250000,
      country: 'Colombia',
    },
  });

  useEffect(() => {
    if (selectedAmount !== 'other') {
      setValue('amount', selectedAmount, { shouldValidate: true });
    } else {
        setValue('amount', 0);
    }
  }, [selectedAmount, setValue]);

  const onSubmit: SubmitHandler<DonationFormValues> = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        let errorMessage = 'Network response was not ok';
        if (result.details && typeof result.details === 'object') {
            const fieldErrors = result.details.fieldErrors;
            errorMessage = Object.keys(fieldErrors).map(field => `${field}: ${fieldErrors[field].join(', ')}`).join('; ');
        } else if (result.details) {
            errorMessage = result.details;
        }
        throw new Error(errorMessage);
      }
      if (result.paymentUrl) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = result.paymentUrl;
        }, 2000);
      } else {
        setError('No se recibió una URL de pago.');
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Error processing donation: ', e.message);
        setError(`Hubo un error al procesar tu donación: ${e.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="donation-form success-message">
        <h2>¡Gracias por tu donación!</h2>
        <p>Serás redirigido a la pasarela de pagos en unos segundos.</p>
      </div>
    );
  }

  return (
    <div className="donation-form">
      {isTermsModalOpen && <TermsModal onClose={() => setIsTermsModalOpen(false)} />}
      <h1>Haz tu donación</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <h2>Detalles de la donación</h2>
          <label>Monto de la donación (COP)</label>
          <div className="amount-buttons">
            {[250000, 500000, 1500000, 2000000].map(amount => (
              <AmountButton key={amount} value={amount} selected={selectedAmount === amount} onClick={() => setSelectedAmount(amount)} />
            ))}
            <button
              type="button"
              onClick={() => setSelectedAmount('other')}
              className={selectedAmount === 'other' ? 'selected' : 'unselected'}
            >
              Otro
            </button>
            {selectedAmount === 'other' && (
              <input
                type="number"
                {...register('amount', { valueAsNumber: true })}
                placeholder="Ingrese el monto"
                min="10000"
                max="3000000"
              />
            )}
          </div>
          {errors.amount && <p className="error-message">{errors.amount.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="destination">Destino del donativo <span>*</span></label>
          <select id="destination" {...register('destination')}>
            <option value="">Seleccione una opción</option>
            {destinationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          {errors.destination && <p className="error-message">{errors.destination.message}</p>}
        </div>

        <div className="form-group">
          <h2>Información de contacto del donante</h2>
          <div className="contact-info-grid">
            <div className="grid-col-4">
              <label htmlFor="title">Título</label>
              <select id="title" {...register('title')}>
                <option>Seleccionar</option>
                <option>Sr.</option>
                <option>Sra.</option>
                <option>Srita.</option>
                <option>Dr.</option>
              </select>
            </div>
            <div className="grid-col-4">
              <label htmlFor="first_name">Nombre(s) <span>*</span></label>
              <input type="text" id="first_name" {...register('first_name')} />
              {errors.first_name && <p className="error-message">{errors.first_name.message}</p>}
            </div>
            <div className="grid-col-4">
              <label htmlFor="last_name">Apellido <span>*</span></label>
              <input type="text" id="last_name" {...register('last_name')} />
              {errors.last_name && <p className="error-message">{errors.last_name.message}</p>}
            </div>
            <div className="grid-col-6">
              <label htmlFor="id_type">Tipo de documento <span>*</span></label>
              <select id="id_type" {...register('id_type')}>
                <option value="">Seleccione</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="NIT">NIT</option>
                <option value="PAS">Pasaporte</option>
              </select>
              {errors.id_type && <p className="error-message">{errors.id_type.message}</p>}
            </div>
            <div className="grid-col-6">
              <label htmlFor="id_number">Número de documento <span>*</span></label>
              <input type="text" id="id_number" {...register('id_number')} />
              {errors.id_number && <p className="error-message">{errors.id_number.message}</p>}
            </div>
            <div className="grid-col-6">
              <label htmlFor="country">País <span>*</span></label>
              <select id="country" {...register('country')}>
                {countryOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              {errors.country && <p className="error-message">{errors.country.message}</p>}
            </div>
            <div className="grid-col-6">
                <label htmlFor="city">Ciudad <span>*</span></label>
                <input type="text" id="city" {...register('city')} />
                {errors.city && <p className="error-message">{errors.city.message}</p>}
            </div>
            <div className="grid-col-12">
              <label htmlFor="address">Dirección</label>
              <input type="text" id="address" {...register('address')} placeholder="Calle, ciudad, estado, código postal" />
              {errors.address && <p className="error-message">{errors.address.message}</p>}
            </div>
            <div className="grid-col-6">
              <label htmlFor="email">Correo electrónico <span>*</span></label>
              <input type="email" id="email" {...register('email')} />
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>
            <div className="grid-col-6">
              <label htmlFor="mobile">Teléfono de contacto</label>
              <input type="tel" id="mobile" {...register('mobile')} />
              {errors.mobile && <p className="error-message">{errors.mobile.message}</p>}
            </div>
            <div className="grid-col-6">
                <label htmlFor="phone">Teléfono (opcional)</label>
                <input type="tel" id="phone" {...register('phone')} />
            </div>
            <div className="grid-col-6">
                <label htmlFor="affiliation">Afiliación <span>*</span></label>
                <input type="text" id="affiliation" {...register('affiliation')} />
                {errors.affiliation && <p className="error-message">{errors.affiliation.message}</p>}
            </div>
            <div className="grid-col-12">
                <label htmlFor="comments">Comentarios</label>
                <textarea id="comments" {...register('comments')} rows={3}></textarea>
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <input id="terms_and_conditions" {...register('terms_and_conditions')} type="checkbox" />
            <label htmlFor="terms_and_conditions">
              Acepto los <a href="#" onClick={(e) => { e.preventDefault(); setIsTermsModalOpen(true); }} style={{ textDecoration: 'underline', cursor: 'pointer' }}>términos y condiciones</a>. <span>*</span>
            </label>
          </div>
          {errors.terms_and_conditions && <p className="error-message">{errors.terms_and_conditions.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Procesando...' : 'Donar ahora'}
        </button>
        {error && <p className="error-message">{error}</p>}
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6B7280', marginTop: '1rem' }}>Apoye la enseñanza, el aprendizaje y la investigación with su donativo hoy.</p>
      </form>
    </div>
  );
};

export default DonationForm;
