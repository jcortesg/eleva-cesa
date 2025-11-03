'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';

export function CreateUserForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const { nombre, email } = Object.fromEntries(formData.entries());

    startTransition(async () => {
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, email }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Something went wrong');
        }

        toast.success(result.message);
        form.reset();
        // The revalidation is handled by the server action called by the API route

      } catch (error: any) {
        toast.error(`Failed to create user: ${error.message}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        name="nombre"
        placeholder="Full Name"
        required
        disabled={isPending}
        className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
      />
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        required
        disabled={isPending}
        className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {isPending ? 'Creating User...' : 'Create User'}
      </button>
    </form>
  );
}
