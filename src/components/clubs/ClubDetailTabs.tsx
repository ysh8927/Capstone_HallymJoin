'use client';

import { useState } from 'react';
import { Tag, CalendarDays, MapPin, Users, TrendingUp } from 'lucide-react';
import { Club, Post } from '@/types';
import { categoryColor, cn } from '@/lib/utils';
import { CATEGORY_LABEL } from '@/types';
import ClubBoard from '@/components/board/ClubBoard';

interface Props {
  club: Club;
  posts: Post[];
  pinnedPost?: Post;
}

const TABS = ['소개', '게시판'] as const;
type Tab = typeof TABS[number];

export default function ClubDetailTabs({ club, posts, pinnedPost }: Props) {
  const [tab, setTab] = useState<Tab>('소개');

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-5 bg-[var(--bg2)] p-1 rounded-xl border border-[var(--bdr)]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 text-sm font-medium py-2 rounded-lg transition-all cursor-pointer',
              tab === t
                ? 'bg-[var(--bg)] text-[var(--txt)] shadow-sm'
                : 'text-[var(--txt2)] hover:text-[var(--txt)]',
            )}
          >
            {t}
            {t === '게시판' && posts.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-semibold">
                {posts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === '소개' && <IntroTab club={club} />}
      {tab === '게시판' && (
        <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] p-4">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <span className="text-4xl mb-3 opacity-30">📭</span>
              <p className="text-sm text-[var(--txt2)]">아직 게시글이 없습니다</p>
              <p className="text-xs text-[var(--txt3)] mt-1">첫 번째 글을 작성해보세요!</p>
            </div>
          ) : (
            <ClubBoard posts={posts} pinnedPost={pinnedPost} />
          )}
        </div>
      )}
    </div>
  );
}

// ── Intro Tab ────────────────────────────────────────────────
function IntroTab({ club }: { club: Club }) {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Description card */}
      <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] p-5">
        <h3 className="text-sm font-semibold text-[var(--txt)] mb-3 flex items-center gap-2">
          <span className="text-lg">{club.emoji}</span>
          동아리 소개
        </h3>
        <p className="text-sm text-[var(--txt2)] leading-relaxed">{club.description}</p>
      </div>

      {/* Meeting info */}
      <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] p-5">
        <h3 className="text-sm font-semibold text-[var(--txt)] mb-4">활동 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <CalendarDays size={14} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-[11px] text-[var(--txt3)] mb-0.5">정기 모임</p>
              <p className="text-sm font-medium text-[var(--txt)]">{club.meetingDay}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
              <MapPin size={14} className="text-teal-500" />
            </div>
            <div>
              <p className="text-[11px] text-[var(--txt3)] mb-0.5">장소</p>
              <p className="text-sm font-medium text-[var(--txt)]">{club.meetingPlace}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Users size={14} className="text-amber-500" />
            </div>
            <div>
              <p className="text-[11px] text-[var(--txt3)] mb-0.5">현재 인원</p>
              <p className="text-sm font-medium text-[var(--txt)]">{club.memberCount}명 / 최대 {club.maxMembers}명</p>
              {/* Progress bar */}
              <div className="mt-1.5 h-1.5 w-28 bg-[var(--bg3)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all"
                  style={{ width: `${Math.min(100, (club.memberCount / club.maxMembers) * 100)}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={14} className="text-purple-500" />
            </div>
            <div>
              <p className="text-[11px] text-[var(--txt3)] mb-0.5">창설연도</p>
              <p className="text-sm font-medium text-[var(--txt)]">{club.establishedYear}년</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] p-5">
        <h3 className="text-sm font-semibold text-[var(--txt)] mb-3 flex items-center gap-2">
          <Tag size={14} className="text-[var(--txt3)]" />
          키워드
        </h3>
        <div className="flex flex-wrap gap-2">
          {club.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-[var(--txt2)] bg-[var(--bg2)] border border-[var(--bdr)] px-3 py-1.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* President */}
      <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] p-5">
        <h3 className="text-sm font-semibold text-[var(--txt)] mb-3">동아리 대표</h3>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${club.color}, ${club.color2})` }}
          >
            {club.president[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--txt)]">{club.president}</p>
            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">회장</span>
          </div>
        </div>
      </div>
    </div>
  );
}
