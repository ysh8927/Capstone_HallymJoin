'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Users, TrendingUp } from 'lucide-react';
import { CLUBS } from '@/data/clubs';
import ClubCard from '@/components/clubs/ClubCard';
import { CATEGORY_LABEL, type ClubCategory } from '@/types';
import { categoryColor, cn } from '@/lib/utils';

const CATEGORIES: ClubCategory[] = ['academic', 'hobby', 'performance', 'sports', 'volunteer', 'religion', 'etc'];
const SORT_OPTIONS = [
  { value: 'popular', label: '인기순' },
  { value: 'members', label: '인원순' },
  { value: 'name',    label: '이름순' },
] as const;

type SortKey = 'popular' | 'members' | 'name';

export default function ClubsPage() {
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState<ClubCategory | 'all'>('all');
  const [recruiting, setRecruiting] = useState(false);
  const [sort, setSort]             = useState<SortKey>('popular');
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => {
    let list = [...CLUBS];
    if (category !== 'all') list = list.filter((c) => c.category === category);
    if (recruiting)          list = list.filter((c) => c.isRecruiting);
    if (search.trim())       list = list.filter((c) =>
      c.name.includes(search) ||
      c.tags.some((t) => t.includes(search)) ||
      c.shortDesc.includes(search),
    );
    if (sort === 'popular') list.sort((a, b) => b.likes - a.likes);
    if (sort === 'members') list.sort((a, b) => b.memberCount - a.memberCount);
    if (sort === 'name')    list.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    return list;
  }, [search, category, recruiting, sort]);

  const hasFilter = category !== 'all' || recruiting || search.trim() !== '';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* ── Page header ──────────────────────────────────── */}
      <div className="mb-7">
        <h1 className="text-2xl font-serif font-bold text-[var(--txt)] mb-1">동아리 탐색</h1>
        <p className="text-sm text-[var(--txt2)]">
          한림대학교의 모든 동아리를 탐색하고 마음에 드는 곳에 가입해보세요
        </p>
      </div>

      {/* ── Search + filter bar ──────────────────────────── */}
      <div className="mb-6 space-y-3">
        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-[var(--bg)] border border-[var(--bdr)] rounded-xl px-4 py-2.5 focus-within:border-indigo-400 transition-colors shadow-sm">
            <Search size={14} className="text-[var(--txt3)] flex-shrink-0" />
            <input
              className="flex-1 bg-transparent text-sm text-[var(--txt)] placeholder:text-[var(--txt3)] outline-none"
              placeholder="동아리 이름, 태그, 설명으로 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-[var(--txt3)] hover:text-[var(--txt2)] cursor-pointer">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer',
              showFilter
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                : 'bg-[var(--bg)] text-[var(--txt2)] border-[var(--bdr)] hover:bg-[var(--bg2)]',
            )}
          >
            <SlidersHorizontal size={14} />
            필터
            {hasFilter && (
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Expanded filters */}
        {showFilter && (
          <div className="bg-[var(--bg)] border border-[var(--bdr)] rounded-xl p-4 shadow-sm animate-fade-in space-y-4">
            {/* Category */}
            <div>
              <p className="text-xs font-semibold text-[var(--txt3)] mb-2 uppercase tracking-wide">분과</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategory('all')}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors cursor-pointer',
                    category === 'all'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-[var(--bg2)] text-[var(--txt2)] border-[var(--bdr)] hover:bg-[var(--bg3)]',
                  )}
                >
                  전체
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors cursor-pointer',
                      category === cat
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : `${categoryColor(cat)} border-current/20 hover:opacity-80`,
                    )}
                  >
                    {CATEGORY_LABEL[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Recruiting toggle + sort */}
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setRecruiting(!recruiting)}
                  className={cn(
                    'w-9 h-5 rounded-full transition-colors cursor-pointer relative',
                    recruiting ? 'bg-indigo-600' : 'bg-gray-200',
                  )}
                >
                  <div className={cn(
                    'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all',
                    recruiting ? 'left-4.5' : 'left-0.5',
                  )} />
                </div>
                <span className="text-xs font-medium text-[var(--txt2)]">모집 중만 보기</span>
              </label>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-[var(--txt3)]">정렬:</span>
                <div className="flex gap-1">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSort(opt.value)}
                      className={cn(
                        'text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer',
                        sort === opt.value
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-[var(--bg2)] text-[var(--txt2)] border-[var(--bdr)] hover:bg-[var(--bg3)]',
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reset */}
            {hasFilter && (
              <button
                onClick={() => { setCategory('all'); setRecruiting(false); setSearch(''); }}
                className="text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                <X size={11} /> 필터 초기화
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Result header ────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-[var(--txt2)]">
          <span className="font-semibold text-[var(--txt)]">{filtered.length}개</span>의 동아리
        </span>
        {category !== 'all' && (
          <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', categoryColor(category))}>
            {CATEGORY_LABEL[category]}
          </span>
        )}
        {recruiting && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-600">
            모집 중
          </span>
        )}
      </div>

      {/* ── Grid ─────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((club, i) => (
            <ClubCard key={club.id} club={club} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="text-5xl mb-4 opacity-30">?</div>
          <p className="text-sm font-medium text-[var(--txt)] mb-1">검색 결과가 없습니다</p>
          <p className="text-xs text-[var(--txt2)] mb-4">다른 키워드나 분과로 검색해보세요</p>
          <button
            onClick={() => { setSearch(''); setCategory('all'); setRecruiting(false); }}
            className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1 cursor-pointer"
          >
            <X size={12} /> 필터 초기화
          </button>
        </div>
      )}

      {/* ── Promo card ───────────────────────────────────── */}
      {filtered.length > 0 && (
        <div className="mt-10 bg-[var(--bg)] border border-[var(--bdr)] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <Users size={18} className="text-indigo-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--txt)] mb-0.5">직접 동아리를 만들고 싶나요?</p>
            <p className="text-xs text-[var(--txt2)]">
              동아리 개설 신청은 학생처를 통해 진행됩니다. 10명 이상의 회원이 필요합니다.
            </p>
          </div>
          <a
            href="https://www.hallym.ac.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            학생처 바로가기 →
          </a>
        </div>
      )}
    </div>
  );
}