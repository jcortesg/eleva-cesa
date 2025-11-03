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
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full transform transition-all duration-300 scale-95 hover:scale-100">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Crear Nuevo Usuario</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg mb-4 text-center">{error}</p>}
          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-gray-800 text-sm font-semibold mb-2">{t.name}</label>
              <input type="text" id="displayName" name="displayName" required autoComplete="name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-800 text-sm font-semibold mb-2">{t.email}</label>
              <input type="email" id="email" name="email" required autoComplete="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-800 text-sm font-semibold mb-2">Contraseña</label>
              <input type="password" id="password" name="password" required autoComplete="new-password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
            </div>
          </div>
          <div className="flex items-center justify-end mt-8 space-x-4">
            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md hover:shadow-lg transition-all duration-200">
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
