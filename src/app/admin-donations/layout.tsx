import Link from 'next/link';
import './admin-donations.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <Link href="/admin-donations">Dashboard</Link>
        <Link href="/admin-donations/users">Users</Link>
        <Link href="/admin-donations/donations">Donations</Link>
      </nav>
      <main className="admin-content">{children}</main>
    </div>
  );
}