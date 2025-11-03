'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Bell, Moon, User } from 'lucide-react';

export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`${pathname}?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(pathname);
    }
  };

  return (
    <header className="valex-main-header">
      <div className="valex-main-header-left">
        <form className="valex-search-form" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search for anything..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          <button type="submit"><Search className="w-5 h-5" /></button>
        </form>
      </div>
      <div className="valex-main-header-right">
        <button className="valex-header-icon"><Moon className="w-6 h-6" /></button>
        <button className="valex-header-icon"><Bell className="w-6 h-6" /></button>
        <button className="valex-header-icon"><User className="w-6 h-6" /></button>
      </div>
    </header>
  );
}
