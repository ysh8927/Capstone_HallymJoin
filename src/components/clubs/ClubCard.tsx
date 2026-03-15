'use client';

import Link from 'next/link';
import { Heart, Users, MessageSquare, MapPin } from 'lucide-react';
import { Club, CATEGORY_LABEL } from '@/types';
import { cn, categoryColor, formatCount } from '@/lib/utils';

interface ClubCardProps {
  club: Club;
  index?: number;
}

export default function ClubCard({ club, index = 0 }: ClubCardProps) {
  const delay = `${index * 0.05}s`;

  return (
    <Link
      href={`/clubs/${club.id}`}
      className={cn(
        'group block bg-[var(--bg)] rounded-2xl border border-[var(--bdr)]',
        'hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/8',
        'transition-all duration-200 hover:-translate-y-0.5',
        'animate-fade-up overflow-hidden',
      )}
      style={{ animationDelay: delay }}
    >
      {/* Gradient header */}
      <div
        className="h-20 relative flex items-end px-4 pb-3"
        style={{ background: `linear-gradient(135deg, ${club.color}, ${club.color2})` }}
      >
        {/* Recruiting badge */}
        <span
          className={cn(
            'absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full',
            club.isRecruiting
              ? 'bg-white/90 text-emerald-600'
              : 'bg-white/60 text-gray-500',
          )}
        >
          {club.isRecruiting ? '모집 중' : '모집 마감'}
        </span>

        {/* Avatar */}
        <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-sm border border-white/30">
          {club.emoji}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pt-3 pb-4">
        {/* Category + name */}
        <div className="flex items-center gap-2 mb-1">
          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', categoryColor(club.category))}>
            {CATEGORY_LABEL[club.category]}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-[var(--txt)] mb-1 font-serif group-hover:text-indigo-600 transition-colors">
          {club.name}
        </h3>
        <p className="text-xs text-[var(--txt2)] leading-relaxed line-clamp-2 mb-3">
          {club.shortDesc}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {club.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] text-[var(--txt3)] bg-[var(--bg2)] px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer stats */}
        <div className="flex items-center gap-3 pt-3 border-t border-[var(--bdr)]">
          <span className="flex items-center gap-1 text-[11px] text-[var(--txt3)]">
            <Users size={11} />
            {club.memberCount}/{club.maxMembers}명
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[var(--txt3)]">
            <MessageSquare size={11} />
            {formatCount(club.postCount)}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[var(--txt3)] ml-auto">
            <Heart size={11} />
            {formatCount(club.likes)}
          </span>
        </div>
      </div>
    </Link>
  );
}
