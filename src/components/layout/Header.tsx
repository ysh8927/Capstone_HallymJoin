'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, User, LogOut, BookOpen, ChevronDown } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ui/ThemeToggle';
import NotificationPanel from '@/components/ui/NotificationPanel';
import SearchModal from '@/components/ui/SearchModal';

const NAV_LINKS = [
  { href: '/clubs',      label: '동아리 탐색' },
  { href: '/my-clubs',   label: '내 동아리' },
  { href: '/federation', label: '총동아리연합회' },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const user = session?.user;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    }
    if (userOpen) document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [userOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--bdr)]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">H</span>
            </div>
            <span className="font-serif font-semibold text-sm text-[var(--txt)]">한림 클럽링크</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-4">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-lg transition-colors',
                  pathname.startsWith(href)
                    ? 'text-indigo-600 bg-indigo-50 font-semibold'
                    : 'text-[var(--txt2)] hover:text-[var(--txt)] hover:bg-[var(--bg2)]',
                )}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 text-xs text-[var(--txt3)] bg-[var(--bg2)] hover:bg-[var(--bg3)] px-3 py-1.5 rounded-lg border border-[var(--bdr)] transition-colors cursor-pointer">
              <Search size={12} />
              <span>검색...</span>
              <kbd className="text-[10px] bg-[var(--bg3)] px-1.5 py-0.5 rounded border border-[var(--bdr)]">⌘K</kbd>
            </button>
            <button onClick={() => setSearchOpen(true)}
              className="sm:hidden p-2 rounded-lg hover:bg-[var(--bg2)] transition-colors text-[var(--txt2)] cursor-pointer">
              <Search size={16} />
            </button>

            <ThemeToggle />
            <NotificationPanel />

            {user ? (
              <div ref={userRef} className="relative hidden sm:block">
                <button onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-[var(--bg2)] transition-colors cursor-pointer">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.[0] ?? 'U'}
                  </div>
                  <span className="text-xs font-medium text-[var(--txt)] max-w-[60px] truncate">{user.name}</span>
                  <ChevronDown size={12} className={cn('text-[var(--txt3)] transition-transform', userOpen && 'rotate-180')} />
                </button>

                {userOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] shadow-xl z-50 overflow-hidden animate-fade-up">
                    <div className="px-4 py-3 border-b border-[var(--bdr)]">
                      <p className="text-xs font-semibold text-[var(--txt)]">{user.name}</p>
                      <p className="text-[11px] text-[var(--txt3)] mt-0.5">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/my-clubs" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--txt2)] hover:bg-[var(--bg2)] hover:text-[var(--txt)] transition-colors">
                        <BookOpen size={13} /> 내 동아리
                      </Link>
                      <Link href="/profile" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--txt2)] hover:bg-[var(--bg2)] hover:text-[var(--txt)] transition-colors">
                        <User size={13} /> 프로필 설정
                      </Link>
                      <div className="h-px bg-[var(--bdr)] my-1" />
                      <button onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer">
                        <LogOut size={13} /> 로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login"
                className="hidden sm:flex text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-semibold">
                로그인
              </Link>
            )}

            <button className="md:hidden p-2 rounded-lg hover:bg-[var(--bg2)] transition-colors text-[var(--txt2)] cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-[var(--bdr)] bg-[var(--bg)] px-4 py-3 flex flex-col gap-1 animate-fade-in">
            {user && (
              <div className="flex items-center gap-3 px-3 py-2.5 mb-1 bg-[var(--bg2)] rounded-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  {user.name?.[0] ?? 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--txt)]">{user.name}</p>
                  <p className="text-[11px] text-[var(--txt3)]">{user.email}</p>
                </div>
              </div>
            )}
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}
                className={cn(
                  'text-sm py-2 px-3 rounded-lg',
                  pathname.startsWith(href)
                    ? 'text-indigo-600 bg-indigo-50 font-semibold'
                    : 'text-[var(--txt2)] hover:bg-[var(--bg2)]',
                )}
                onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
            <Link href="/profile" className="text-sm py-2 px-3 rounded-lg text-[var(--txt2)] hover:bg-[var(--bg2)]" onClick={() => setMenuOpen(false)}>
              프로필 설정
            </Link>
            <div className="pt-2 border-t border-[var(--bdr)]">
              <button onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full flex items-center gap-2 text-sm py-2 px-3 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer">
                <LogOut size={14} /> 로그아웃
              </button>
            </div>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}