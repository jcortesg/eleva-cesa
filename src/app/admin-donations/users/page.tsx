'use client';

import { useState, useEffect } from 'react';
import { getUsers } from './actions';
import CreateUserModal from './CreateUserModal';
import ChangePasswordModal from './ChangePasswordModal';
import { User } from '@/domain/User';

const PAGE_SIZE = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changePasswordUser, setChangePasswordUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchUsers() {
      const { users: fetchedUsers, total } = await getUsers(currentPage, PAGE_SIZE);
      setUsers(fetchedUsers);
      setTotalCount(total);
    }
    fetchUsers();
  }, [currentPage]);

  const handleUserCreated = async () => {
    setIsModalOpen(false);
    const { users: fetchedUsers, total } = await getUsers(currentPage, PAGE_SIZE);
    setUsers(fetchedUsers);
    setTotalCount(total);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <h1 className="users-title">Users</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          Crear Usuario
        </button>
      </div>
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.displayName}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={() => setChangePasswordUser(user)}
                    className="btn-action"
                    title="Cambiar contraseña"
                  >
                    🔑 Cambiar Contraseña
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Anterior
          </button>

          <div className="pagination-numbers">
            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => handlePageClick(page)}
                  className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="pagination-ellipsis">{page}</span>
              )
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Siguiente
          </button>
        </div>
      )}

      <div className="pagination-info">
        Mostrando {users.length > 0 ? ((currentPage - 1) * PAGE_SIZE + 1) : 0} - {Math.min(currentPage * PAGE_SIZE, totalCount)} de {totalCount} usuarios
      </div>

      {isModalOpen && <CreateUserModal onClose={handleUserCreated} />}
      {changePasswordUser && (
        <ChangePasswordModal
          userId={changePasswordUser.id}
          userEmail={changePasswordUser.email}
          onClose={() => setChangePasswordUser(null)}
        />
      )}
    </div>
  );
}
