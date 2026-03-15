import Link from 'next/link';
import { ArrowRight, Search, Users, BookOpen, Star, TrendingUp, Calendar } from 'lucide-react';
import { CLUBS } from '@/data/clubs';
import ClubCard from '@/components/clubs/ClubCard';
import Button from '@/components/ui/Button';
import { CATEGORY_LABEL, type ClubCategory } from '@/types';
import { categoryColor } from '@/lib/utils';

export const metadata = { title: '홈' };

const FEATURED_IDS = ['chaos', 'chumbaram', 'hanbitsajinhoe', 'sip-si-il-bap'];
const featured = CLUBS.filter((c) => FEATURED_IDS.includes(c.id));
const recruiting = CLUBS.filter((c) => c.isRecruiting).slice(0, 3);

const STATS = [
  { icon: Users,      value: `${CLUBS.length}개`, label: '중앙 동아리' },
  { icon: BookOpen,   value: '6개',  label: '분과' },
  { icon: Star,       value: '700+', label: '동아리 회원' },
  { icon: TrendingUp, value: '매학기', label: '정기 공연·행사' },
];

const CATEGORIES: { key: ClubCategory; emoji: string }[] = [
  { key: 'academic',    emoji: '🎓' },
  { key: 'hobby',       emoji: '🎨' },
  { key: 'performance', emoji: '🎭' },
  { key: 'sports',      emoji: '⚽' },
  { key: 'volunteer',   emoji: '🤝' },
  { key: 'religion',    emoji: '✝️' },
];

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--bg)] border-b border-[var(--bdr)]">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-100 mb-6">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              2025학년도 1학기 모집 진행 중
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[var(--txt)] leading-tight mb-4">
              한림대학교<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                동아리를 탐색하세요
              </span>
            </h1>
            <p className="text-base text-[var(--txt2)] leading-relaxed mb-8 max-w-lg">
              학술, 취미예술, 공연, 체육, 봉사, 종교까지 —<br className="hidden md:block" />
              {CLUBS.length}개의 중앙동아리에서 나에게 딱 맞는 곳을 찾아보세요.
            </p>

            <div className="flex gap-2 max-w-md mb-6">
              <div className="flex-1 flex items-center gap-2 bg-[var(--bg2)] border border-[var(--bdr)] rounded-xl px-4 py-3 focus-within:border-indigo-400 transition-colors">
                <Search size={15} className="text-[var(--txt3)] flex-shrink-0" />
                <input
                  className="flex-1 bg-transparent text-sm text-[var(--txt)] placeholder:text-[var(--txt3)] outline-none"
                  placeholder="동아리 이름, 분야로 검색..."
                  readOnly
                />
              </div>
              <Link href="/clubs">
                <Button variant="primary" size="md" className="rounded-xl px-5 h-full">
                  탐색하기
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ key, emoji }) => (
                <Link
                  key={key}
                  href={`/clubs?category=${key}`}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-current/20 transition-opacity hover:opacity-80 ${categoryColor(key)}`}
                >
                  <span>{emoji}</span>
                  {CATEGORY_LABEL[key]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="bg-[var(--bg)] border-b border-[var(--bdr)]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-indigo-500" />
                </div>
                <div>
                  <div className="text-lg font-bold text-[var(--txt)] leading-none">{value}</div>
                  <div className="text-xs text-[var(--txt3)] mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">

        {/* ── 지금 모집 중 ──────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-emerald-600">모집 진행 중</span>
              </div>
              <h2 className="text-lg font-serif font-bold text-[var(--txt)]">지금 신청할 수 있어요</h2>
            </div>
            <Link href="/clubs?recruiting=true" className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1 font-medium">
              전체 보기 <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recruiting.map((club, i) => (
              <ClubCard key={club.id} club={club} index={i} />
            ))}
          </div>
        </section>

        {/* ── 인기 동아리 ──────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={12} className="text-rose-500" />
                <span className="text-xs font-semibold text-rose-500">많이 찾는 동아리</span>
              </div>
              <h2 className="text-lg font-serif font-bold text-[var(--txt)]">주목받는 동아리</h2>
            </div>
            <Link href="/clubs" className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1 font-medium">
              전체 보기 <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((club, i) => (
              <ClubCard key={club.id} club={club} index={i} />
            ))}
          </div>
        </section>

        {/* ── 분과별 탐색 ──────────────────────────────────── */}
        <section>
          <div className="mb-5">
            <h2 className="text-lg font-serif font-bold text-[var(--txt)] mb-1">분과별로 탐색하기</h2>
            <p className="text-xs text-[var(--txt2)]">관심 있는 분야의 동아리를 찾아보세요</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map(({ key, emoji }) => (
              <Link
                key={key}
                href={`/clubs?category=${key}`}
                className="flex flex-col items-center gap-2 p-4 bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="text-2xl">{emoji}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColor(key)}`}>
                  {CATEGORY_LABEL[key].replace('분과', '')}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 공지 배너 ─────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative max-w-lg">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} className="opacity-80" />
              <span className="text-xs font-medium opacity-80">2025. 03. 20</span>
            </div>
            <h3 className="text-xl font-serif font-bold mb-2">2025년 1학기 동아리 박람회</h3>
            <p className="text-sm opacity-80 mb-5 leading-relaxed">
              3월 20일(목) 오전 10시, 한림대 대운동장에서 동아리 박람회가 열립니다.<br />
              관심 있는 동아리 부스를 직접 방문하고 가입 신청까지 한 번에!
            </p>
            <Link href="/clubs">
              <Button variant="secondary" size="sm" className="bg-white text-indigo-600 hover:bg-white/90 border-transparent">
                동아리 탐색하기
                <ArrowRight size={13} />
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
