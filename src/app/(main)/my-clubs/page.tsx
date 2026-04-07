'use client';

import Link from 'next/link';
import {
  Users, BookOpen, Heart, MessageSquare, ChevronRight,
  Settings, TrendingUp, Calendar, Star,
  MessageCircleReply, UserCheck, Megaphone,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { CLUBS } from '@/data/clubs';
import { MOCK_ACTIVITY } from '@/data/mockUser';
import { CATEGORY_LABEL } from '@/types';
import { cn } from '@/lib/utils';

const ACTIVITY_ICON = {
  comment: <MessageSquare size={13} />,
  like:    <Heart size={13} />,
  post:    <BookOpen size={13} />,
  join:    <UserCheck size={13} />,
  reply:   <MessageCircleReply size={13} />,
};
const ACTIVITY_COLOR = {
  comment: 'bg-blue-50 text-blue-500',
  like:    'bg-rose-50 text-rose-500',
  post:    'bg-indigo-50 text-indigo-500',
  join:    'bg-emerald-50 text-emerald-500',
  reply:   'bg-purple-50 text-purple-500',
};

export default function MyClubsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // 임시로 빈 배열 사용 (추후 DB 연동)
  const joinedClubs: typeof CLUBS = [];
  const bookmarkedClubs: typeof CLUBS = [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Profile header */}
      <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] overflow-hidden mb-6">
        <div className="h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="px-6 pb-5">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-[var(--bg)] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.name?.[0] ?? 'U'}
            </div>
            <div className="mb-1">
              <h1 className="text-lg font-serif font-bold text-[var(--txt)]">{user?.name}</h1>
              <p className="text-xs text-[var(--txt3)]">{user?.email}</p>
            </div>
            <div className="ml-auto">
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

          {/* 가입 동아리 */}
          <section className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--bdr)] flex items-center gap-2">
              <Users size={14} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-[var(--txt)]">가입 동아리</h2>
              <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold">{joinedClubs.length}</span>
            </div>
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-[var(--txt3)] mb-3">아직 가입한 동아리가 없습니다.</p>
              <Link href="/clubs" className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold">
                동아리 탐색하기 →
              </Link>
            </div>
          </section>

          {/* 관심 동아리 */}
          <section className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--bdr)] flex items-center gap-2">
              <Star size={14} className="text-amber-500" />
              <h2 className="text-sm font-semibold text-[var(--txt)]">관심 동아리</h2>
              <span className="text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-bold">{bookmarkedClubs.length}</span>
            </div>
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-[var(--txt3)] mb-3">아직 관심 동아리가 없습니다.</p>
              <Link href="/clubs" className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold">
                동아리 탐색하기 →
              </Link>
            </div>
          </section>
        </div>

        {/* 활동 피드 */}
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