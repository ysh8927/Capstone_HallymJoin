'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  clubId: string;
  initialBookmarked?: boolean;
}

export default function BookmarkButton({ clubId, initialBookmarked = false }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (loading) return;
    setLoading(true);

    try {
      const method = bookmarked ? 'DELETE' : 'POST';
      const res = await fetch(`/api/clubs/${clubId}/bookmark`, { method });

      if (res.ok) {
        setBookmarked(!bookmarked);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all cursor-pointer disabled:opacity-50',
        bookmarked
          ? 'bg-amber-50 text-amber-600 border-amber-200'
          : 'bg-[var(--bg2)] text-[var(--txt2)] border-[var(--bdr)] hover:bg-[var(--bg3)]'
      )}
    >
      <Star size={14} className={bookmarked ? 'fill-amber-500' : ''} />
      {bookmarked ? '관심 동아리' : '관심 추가'}
    </button>
  );
}