'use client';

import { useState, useEffect } from 'react';
import { getUsers } from './actions';
import CreateUserModal from './CreateUserModal';

interface User {
  uid: string;
  displayName?: string;
  email?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    }
    fetchUsers();
  }, []);

  const handleUserCreated = async () => {
    setIsModalOpen(false);
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
          Crear Usuario
        </button>
      </div>
      <div className="shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600 uppercase tracking-wider">Email</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((user, index) => (
              <tr key={user.uid} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="text-left py-3 px-4">{user.displayName}</td>
                <td className="text-left py-3 px-4">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <CreateUserModal onClose={handleUserCreated} />}
    </div>
  );
}
