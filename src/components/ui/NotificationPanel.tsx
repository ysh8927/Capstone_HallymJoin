'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bell, MessageSquare, Heart, Megaphone, UserCheck, MessageCircleReply, X, Check,
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '@/data/mockUser';
import type { Notification, NotifType } from '@/types';
import { cn } from '@/lib/utils';

const NOTIF_ICON: Record<NotifType, React.ReactNode> = {
  comment: <MessageSquare size={13} />,
  reply:   <MessageCircleReply size={13} />,
  like:    <Heart size={13} />,
  notice:  <Megaphone size={13} />,
  join:    <UserCheck size={13} />,
};

const NOTIF_COLOR: Record<NotifType, string> = {
  comment: 'bg-blue-50 text-blue-500',
  reply:   'bg-indigo-50 text-indigo-500',
  like:    'bg-rose-50 text-rose-500',
  notice:  'bg-amber-50 text-amber-500',
  join:    'bg-emerald-50 text-emerald-500',
};

export default function NotificationPanel() {
  const [open, setOpen]     = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);

  const unread = notifs.filter((n) => !n.isRead).length;

  // Close on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  function dismiss(id: string) {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-[var(--bg2)] transition-colors text-[var(--txt2)] cursor-pointer"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] shadow-xl z-50 overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[var(--bdr)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-[var(--txt2)]" />
              <span className="text-sm font-semibold text-[var(--txt)]">알림</span>
              {unread > 0 && (
                <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-bold">{unread}</span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-indigo-500 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <Check size={11} /> 모두 읽음
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-[var(--txt3)]">
                새로운 알림이 없습니다
              </div>
            ) : (
              notifs.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 border-b border-[var(--bdr)] last:border-0 group',
                    !n.isRead && 'bg-indigo-50/40',
                  )}
                >
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5', NOTIF_COLOR[n.type])}>
                    {NOTIF_ICON[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    {n.clubId ? (
                      <Link href={`/clubs/${n.clubId}`} onClick={() => setOpen(false)}>
                        <p className="text-xs text-[var(--txt)] leading-snug hover:text-indigo-600 transition-colors">
                          {!n.isRead && <span className="inline-block w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1 mb-0.5" />}
                          {n.message}
                        </p>
                      </Link>
                    ) : (
                      <p className="text-xs text-[var(--txt)] leading-snug">{n.message}</p>
                    )}
                    <p className="text-[10px] text-[var(--txt3)] mt-0.5">{n.time}</p>
                  </div>
                  <button
                    onClick={() => dismiss(n.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[var(--bg3)] text-[var(--txt3)] hover:text-[var(--txt2)] transition-all cursor-pointer flex-shrink-0"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-[var(--bdr)] text-center">
            <button className="text-xs text-[var(--txt3)] hover:text-[var(--txt2)] cursor-pointer">
              알림 설정
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
