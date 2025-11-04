'use client';

import { useState } from 'react';
import { createUser } from './actions';
import { translations } from '@/lib/translations';

const t = translations.es;

export default function CreateUserModal({ onClose }: { onClose: () => void }) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await createUser(formData);

    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  return (
    <div className="user-modal-backdrop">
      <div className="user-modal-content">
        <h2 className="user-modal-title">Crear Nuevo Usuario</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="user-modal-error">{error}</p>}
          <div className="user-modal-form-group">
            <label htmlFor="displayName" className="user-modal-label">{t.name}</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              required
              autoComplete="name"
              className="user-modal-input"
            />
          </div>
          <div className="user-modal-form-group">
            <label htmlFor="email" className="user-modal-label">{t.email}</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              className="user-modal-input"
            />
          </div>
          <div className="user-modal-form-group">
            <label htmlFor="password" className="user-modal-label">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="new-password"
              className="user-modal-input"
            />
          </div>
          <div className="user-modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
