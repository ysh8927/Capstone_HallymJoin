'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function HomeSearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/clubs?search=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div className="flex-1 flex items-center gap-2 bg-[var(--bg2)] border border-[var(--bdr)] rounded-xl px-4 py-3 focus-within:border-indigo-400 transition-colors">
      <Search size={15} className="text-[var(--txt3)] flex-shrink-0" />
      <input
        className="flex-1 bg-transparent text-sm text-[var(--txt)] placeholder:text-[var(--txt3)] outline-none"
        placeholder="동아리 이름, 분야로 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}