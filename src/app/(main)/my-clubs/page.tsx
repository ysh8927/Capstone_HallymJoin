'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, BookOpen, Heart, MessageSquare, ChevronRight,
  Settings, TrendingUp, Calendar, Star,
  MessageCircleReply, UserCheck, Megaphone,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { CATEGORY_LABEL } from '@/types';
import { cn } from '@/lib/utils';

interface Club {
  id: string;
  name: string;
  category: string;
  shortDesc?: string;
  emoji: string;
  color: string;
  color2: string;
  memberCount: number;
  isRecruiting: boolean;
  meetingDay: string;
}

export default function MyClubsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [joinedClubs, setJoinedClubs] = useState<Club[]>([]);
  const [bookmarkedClubs, setBookmarkedClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyClubs() {
      try {
        const res = await fetch('/api/my-clubs');
        if (res.ok) {
          const data = await res.json();
          setJoinedClubs(data.joined || []);
          setBookmarkedClubs(data.bookmarked || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyClubs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] overflow-hidden mb-6">
        <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="px-6 pb-5 pt-0">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-[var(--bg)] flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0">
              {user?.name?.[0] ?? 'U'}
            </div>
            <div className="pb-1 min-w-0">
              <h1 className="text-lg font-serif font-bold text-[var(--txt)] truncate">{user?.name}</h1>
              <p className="text-xs text-[var(--txt3)] truncate">{user?.email}</p>
            </div>
            <div className="ml-auto pb-1 flex-shrink-0">
              <Link href="/profile"
                className="flex items-center gap-1.5 text-xs text-[var(--txt2)] bg-[var(--bg2)] hover:bg-[var(--bg3)] px-3 py-1.5 rounded-lg border border-[var(--bdr)] transition-colors">
                <Settings size={12} /> 프로필 편집
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {[
              { icon: <Users size={13} />,        value: joinedClubs.length,     label: '가입 동아리' },
              { icon: <Star size={13} />,          value: bookmarkedClubs.length, label: '관심 동아리' },
              { icon: <BookOpen size={13} />,      value: 0,                      label: '작성 게시글' },
              { icon: <MessageSquare size={13} />, value: 0,                      label: '작성 댓글' },
            ].map(({ icon, value, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-[var(--txt2)]">
                <span className="text-[var(--txt3)]">{icon}</span>
                <span className="font-bold text-[var(--txt)]">{value}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          <section className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--bdr)] flex items-center gap-2">
              <Users size={14} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-[var(--txt)]">가입 동아리</h2>
              <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold">{joinedClubs.length}</span>
            </div>
            {loading ? (
              <div className="px-5 py-10 text-center text-sm text-[var(--txt3)]">로딩 중...</div>
            ) : joinedClubs.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-[var(--txt3)] mb-3">아직 가입한 동아리가 없습니다.</p>
                <Link href="/clubs" className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold">
                  동아리 탐색하기 →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[var(--bdr)]">
                {joinedClubs.map((club) => (
                  <Link key={club.id} href={`/clubs/${club.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--bg2)] transition-colors group">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${club.color}22, ${club.color2}22)` }}>
                      {club.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-[var(--txt)] group-hover:text-indigo-600 transition-colors">{club.name}</p>
                        <span className="text-[10px] text-[var(--txt3)] bg-[var(--bg2)] px-2 py-0.5 rounded-full">{CATEGORY_LABEL[club.category as keyof typeof CATEGORY_LABEL]}</span>
                      </div>
                      <p className="text-xs text-[var(--txt3)] truncate">{club.shortDesc}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[var(--txt3)]">
                        <span className="flex items-center gap-1"><Users size={10} />{club.memberCount}명</span>
                        <span className="flex items-center gap-1"><Calendar size={10} />{club.meetingDay}</span>
                        {club.isRecruiting && <span className="text-emerald-600 font-medium">모집 중</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <Link href={`/clubs/${club.id}/board/write`} onClick={(e) => e.stopPropagation()}
                        className="text-[11px] text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors">
                        글 쓰기
                      </Link>
                      <ChevronRight size={14} className="text-[var(--txt3)] group-hover:text-indigo-400 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--bdr)] flex items-center gap-2">
              <Star size={14} className="text-amber-500" />
              <h2 className="text-sm font-semibold text-[var(--txt)]">관심 동아리</h2>
              <span className="text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-bold">{bookmarkedClubs.length}</span>
            </div>
            {loading ? (
              <div className="px-5 py-10 text-center text-sm text-[var(--txt3)]">로딩 중...</div>
            ) : bookmarkedClubs.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-[var(--txt3)] mb-3">아직 관심 동아리가 없습니다.</p>
                <Link href="/clubs" className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold">
                  동아리 탐색하기 →
                </Link>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bookmarkedClubs.map((club) => (
                  <Link key={club.id} href={`/clubs/${club.id}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[var(--bdr)] hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors group text-center">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: `linear-gradient(135deg, ${club.color}22, ${club.color2}22)` }}>
                      {club.emoji}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--txt)] group-hover:text-indigo-600 transition-colors">{club.name}</p>
                      <p className="text-[10px] text-[var(--txt3)] mt-0.5">{club.memberCount}명</p>
                    </div>
                    {club.isRecruiting && (
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">모집 중</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] overflow-hidden">
            <div className="px-4 py-3.5 border-b border-[var(--bdr)] flex items-center gap-2">
              <TrendingUp size={14} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-[var(--txt)]">최근 활동</h2>
            </div>
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-[var(--txt3)]">최근 활동이 없습니다.</p>
            </div>
          </section>

          <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] p-4">
            <p className="text-xs font-semibold text-[var(--txt3)] uppercase tracking-wider mb-3">빠른 실행</p>
            <div className="space-y-1">
              {[
                { href: '/clubs',      label: '새 동아리 탐색',  icon: <Users size={13} /> },
                { href: '/federation', label: '총동아리연합회',   icon: <Megaphone size={13} /> },
              ].map(({ href, label, icon }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--txt2)] hover:bg-[var(--bg2)] hover:text-[var(--txt)] transition-colors">
                  <span className="text-[var(--txt3)]">{icon}</span>
                  {label}
                  <ChevronRight size={11} className="ml-auto text-[var(--txt3)]" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}