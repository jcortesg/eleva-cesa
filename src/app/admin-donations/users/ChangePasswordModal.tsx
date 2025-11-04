'use client';

import { useState } from 'react';
import { changePassword } from './actions';

interface ChangePasswordModalProps {
  userId: string;
  userEmail: string;
  onClose: () => void;
}

export default function ChangePasswordModal({ userId, userEmail, onClose }: ChangePasswordModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const result = await changePassword(userId, formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="user-modal-backdrop">
      <div className="user-modal-content">
        <h2 className="user-modal-title">Cambiar Contraseña</h2>
        <p className="text-gray-600 mb-4">Usuario: <strong>{userEmail}</strong></p>

        {success ? (
          <div className="success-message">
            <p>✓ Contraseña actualizada exitosamente</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <p className="user-modal-error">{error}</p>}

            <div className="user-modal-form-group">
              <label htmlFor="newPassword" className="user-modal-label">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                required
                minLength={6}
                autoComplete="new-password"
                className="user-modal-input"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="user-modal-form-group">
              <label htmlFor="confirmPassword" className="user-modal-label">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                minLength={6}
                autoComplete="new-password"
                className="user-modal-input"
                placeholder="Confirme la contraseña"
              />
            </div>

            <div className="user-modal-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-submit">
                Cambiar Contraseña
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
