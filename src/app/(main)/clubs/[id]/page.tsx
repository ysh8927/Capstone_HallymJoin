import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Users, CalendarDays, MapPin, Tag, ArrowLeft,
  Heart, BookOpen, ChevronRight, TrendingUp,
} from 'lucide-react';
import { CLUBS } from '@/data/clubs';
import { getPostsByClub, getPinnedPost } from '@/data/posts';
import { CATEGORY_LABEL, CATEGORY_SHORT } from '@/types';
import { categoryColor, cn } from '@/lib/utils';
import ClubBoard from '@/components/board/ClubBoard';
import Button from '@/components/ui/Button';

interface Props { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return CLUBS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const club = CLUBS.find((c) => c.id === id);
  return { title: club?.name ?? '동아리' };
}

const INFO_TABS = ['소개', '게시판'] as const;
type Tab = typeof INFO_TABS[number];

export default async function ClubDetailPage({ params }: Props) {
  const { id } = await params;
  const club = CLUBS.find((c) => c.id === id);
  if (!club) notFound();

  const posts      = getPostsByClub(club.id);
  const pinnedPost = getPinnedPost(club.id);

  const similarClubs = CLUBS
    .filter((c) => c.category === club.category && c.id !== club.id)
    .slice(0, 3);

  return (
    <div>
      {/* ── Hero Header ───────────────────────────────────── */}
      <div
        className="relative h-44 md:h-56 flex flex-col justify-end"
        style={{ background: `linear-gradient(135deg, ${club.color}, ${club.color2})` }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-8 w-32 h-32 bg-black/10 rounded-full translate-y-1/2" />

        {/* Back button */}
        <Link
          href="/clubs"
          className="absolute top-4 left-4 flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-medium bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-full transition-colors"
        >
          <ArrowLeft size={13} />
          동아리 목록
        </Link>

        {/* Recruiting badge */}
        <div className="absolute top-4 right-4">
          <span className={cn(
            'text-xs font-semibold px-3 py-1 rounded-full',
            club.isRecruiting
              ? 'bg-white/90 text-emerald-600'
              : 'bg-white/60 text-gray-500',
          )}>
            {club.isRecruiting ? '🟢 모집 중' : '⚫ 모집 마감'}
          </span>
        </div>

        {/* Club identity */}
        <div className="relative max-w-5xl mx-auto w-full px-6 pb-6 flex items-end gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
            {club.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-white/70 bg-white/20 px-2 py-0.5 rounded-full">
                {CATEGORY_LABEL[club.category]}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">{club.name}</h1>
          </div>
        </div>
      </div>

      {/* ── Main Layout ───────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left: Tabs (소개 / 게시판) ──────────────────── */}
          <div className="flex-1 min-w-0">
            <ClubTabs club={club} posts={posts} pinnedPost={pinnedPost} />
          </div>

          {/* ── Right: Sidebar ──────────────────────────────── */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-4">
            {/* Quick Info */}
            <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] p-4">
              <p className="text-xs font-semibold text-[var(--txt3)] uppercase tracking-wider mb-3">동아리 정보</p>
              <ul className="space-y-3">
                <InfoRow icon={<Users size={13} />}    label="회원" value={`${club.memberCount}/${club.maxMembers}명`} />
                <InfoRow icon={<CalendarDays size={13} />} label="정기모임" value={club.meetingDay} />
                <InfoRow icon={<MapPin size={13} />}   label="장소" value={club.meetingPlace} />
                <InfoRow icon={<Heart size={13} />}    label="창설연도" value={`${club.establishedYear}년`} />
                <InfoRow icon={<BookOpen size={13} />} label="게시글" value={`${posts.length}개`} />
              </ul>
            </div>

            {/* Stats */}
            <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] p-4">
              <p className="text-xs font-semibold text-[var(--txt3)] uppercase tracking-wider mb-3">활동 현황</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <StatBox value={club.memberCount} label="회원" />
                <StatBox value={club.likes} label="관심" />
                <StatBox value={posts.length} label="게시글" />
              </div>
            </div>

            {/* Join button */}
            {club.isRecruiting && (
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors cursor-pointer">
                가입 신청하기
              </button>
            )}
            {!club.isRecruiting && (
              <div className="w-full text-center text-xs text-[var(--txt3)] bg-[var(--bg2)] border border-[var(--bdr)] py-3 rounded-xl">
                현재 모집이 마감되었습니다
              </div>
            )}

            {/* Similar clubs */}
            {similarClubs.length > 0 && (
              <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] p-4">
                <p className="text-xs font-semibold text-[var(--txt3)] uppercase tracking-wider mb-3">비슷한 동아리</p>
                <div className="space-y-2">
                  {similarClubs.map((sc) => (
                    <Link
                      key={sc.id}
                      href={`/clubs/${sc.id}`}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[var(--bg2)] transition-colors group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${sc.color}33, ${sc.color2}33)` }}
                      >
                        {sc.emoji}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[var(--txt)] truncate group-hover:text-indigo-600 transition-colors">{sc.name}</p>
                        <p className="text-[10px] text-[var(--txt3)]">{sc.memberCount}명</p>
                      </div>
                      <ChevronRight size={12} className="ml-auto text-[var(--txt3)] flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-[var(--txt3)] mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] text-[var(--txt3)]">{label}</p>
        <p className="text-xs font-medium text-[var(--txt)]">{value}</p>
      </div>
    </li>
  );
}

function StatBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-[var(--bg2)] rounded-xl py-2">
      <p className="text-base font-bold text-[var(--txt)]">{value}</p>
      <p className="text-[10px] text-[var(--txt3)]">{label}</p>
    </div>
  );
}

// ── Client Tabs Component ─────────────────────────────────────
import ClubDetailTabs from '@/components/clubs/ClubDetailTabs';

function ClubTabs({
  club, posts, pinnedPost,
}: {
  club: (typeof CLUBS)[0];
  posts: ReturnType<typeof getPostsByClub>;
  pinnedPost: ReturnType<typeof getPinnedPost>;
}) {
  return (
    <ClubDetailTabs
      club={club}
      posts={posts}
      pinnedPost={pinnedPost}
    />
  );
}
