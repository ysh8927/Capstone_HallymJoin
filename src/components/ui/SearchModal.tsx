'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, Tag } from 'lucide-react';
import { CLUBS } from '@/data/clubs';
import { CATEGORY_LABEL } from '@/types';
import { cn } from '@/lib/utils';
import type { Club } from '@/types';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES = ['CHAOS', '춤바람', '봉사 동아리', '코딩'];
const TRENDING = ['홀로그램', 'CODA', '한빛사진회', '유니콘'];

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results: Club[] = query.trim().length < 1 ? [] : CLUBS.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.shortDesc.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q)) ||
      CATEGORY_LABEL[c.category].includes(q)
    );
  }).slice(0, 8);

  function go(clubId: string) {
    onClose();
    router.push(`/clubs/${clubId}`);
  }

  function goSearch() {
    if (!query.trim()) return;
    onClose();
    router.push(`/clubs?search=${encodeURIComponent(query.trim())}`);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] shadow-2xl overflow-hidden animate-fade-up">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--bdr)]">
          <Search size={16} className="text-[var(--txt3)] flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') goSearch(); }}
            placeholder="동아리 이름, 분과, 태그로 검색..."
            className="flex-1 bg-transparent text-sm text-[var(--txt)] placeholder:text-[var(--txt3)] outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[var(--txt3)] hover:text-[var(--txt2)] cursor-pointer">
              <X size={14} />
            </button>
          )}
          <kbd className="hidden sm:block text-[10px] bg-[var(--bg2)] text-[var(--txt3)] px-1.5 py-0.5 rounded border border-[var(--bdr)]">ESC</kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {results.length > 0 && (
            <div className="p-2">
              {results.map((club) => (
                <button
                  key={club.id}
                  onClick={() => go(club.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg2)] transition-colors text-left group cursor-pointer"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${club.color}33, ${club.color2}33)` }}
                  >
                    {club.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--txt)] group-hover:text-indigo-600 transition-colors truncate">{club.name}</p>
                    <p className="text-xs text-[var(--txt3)] truncate">{club.shortDesc}</p>
                  </div>
                  <span className="text-[10px] text-[var(--txt3)] bg-[var(--bg2)] px-2 py-0.5 rounded-full flex-shrink-0">
                    {CATEGORY_LABEL[club.category]}
                  </span>
                </button>
              ))}
              <button
                onClick={goSearch}
                className="w-full flex items-center gap-2 px-3 py-2.5 mt-1 rounded-xl text-xs text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                <Search size={13} />
                <span>"{query}" 전체 검색 결과 보기</span>
              </button>
            </div>
          )}

          {query.trim().length > 0 && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-[var(--txt3)]">
              <p className="mb-1">"{query}"에 대한 검색 결과가 없습니다.</p>
              <p className="text-xs">다른 키워드로 검색해보세요.</p>
            </div>
          )}

          {!query && (
            <div className="p-4 space-y-5">
              <div>
                <p className="text-[11px] font-semibold text-[var(--txt3)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Search size={11} /> 최근 검색
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {RECENT_SEARCHES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="text-xs text-[var(--txt2)] bg-[var(--bg2)] hover:bg-[var(--bg3)] px-3 py-1.5 rounded-full border border-[var(--bdr)] transition-colors cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--txt3)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <TrendingUp size={11} /> 인기 동아리
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full border border-indigo-100 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Tag size={10} /> {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}