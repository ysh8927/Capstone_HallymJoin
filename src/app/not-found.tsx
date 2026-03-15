import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg3)] flex flex-col items-center justify-center px-4 py-16">
      {/* Big number */}
      <div className="relative mb-8 select-none">
        <span className="text-[120px] md:text-[160px] font-serif font-bold text-[var(--bdr)] leading-none tracking-tighter">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
            <span className="text-4xl">🔍</span>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-serif font-bold text-[var(--txt)] mb-2 text-center">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-sm text-[var(--txt3)] text-center max-w-sm mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
        URL을 확인하거나 아래 링크를 이용해주세요.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Home size={14} /> 홈으로 가기
        </Link>
        <Link
          href="/clubs"
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--bg)] hover:bg-[var(--bg2)] text-[var(--txt2)] text-sm font-semibold rounded-xl border border-[var(--bdr)] transition-colors"
        >
          <Search size={14} /> 동아리 탐색
        </Link>
      </div>

      {/* Helpful links */}
      <div className="mt-10 text-center">
        <p className="text-xs text-[var(--txt3)] mb-3">자주 찾는 페이지</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { href: '/clubs',       label: '전체 동아리' },
            { href: '/federation',  label: '총동아리연합회' },
            { href: '/my-clubs',    label: '내 동아리' },
            { href: '/login',       label: '로그인' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full border border-indigo-100 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
