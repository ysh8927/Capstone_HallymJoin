'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [password,  setPassword]  = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!studentId || !password) { setError('학번과 비밀번호를 입력해주세요.'); return; }
    if (!/^\d{8,9}$/.test(studentId)) { setError('올바른 학번 형식이 아닙니다. (예: 22100001)'); return; }
    setLoading(true);
    const res = await signIn('credentials', { studentId, password, redirect: false });
    setLoading(false);
    if (res?.error) { setError('학번 또는 비밀번호가 올바르지 않습니다.'); return; }
    router.push('/home');
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] shadow-sm overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="p-8">
          <div className="text-center mb-7">
            <h1 className="text-xl font-serif font-bold text-[var(--txt)] mb-1">로그인</h1>
            <p className="text-xs text-[var(--txt2)]">한림대학교 구성원만 이용 가능합니다</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5">학번</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="예: 22100001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  className={cn(
                    'w-full bg-[var(--bg2)] border rounded-xl px-4 py-2.5 text-sm text-[var(--txt)]',
                    'placeholder:text-[var(--txt3)] outline-none transition-colors',
                    'focus:border-indigo-400 focus:bg-[var(--bg)]',
                    error ? 'border-rose-300' : 'border-[var(--bdr)]',
                  )}
                />
                {studentId && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--txt3)]">
                    @hallym.ac.kr
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[var(--txt2)]">비밀번호</label>
                <Link href="/forgot-password" className="text-[10px] text-indigo-500 hover:text-indigo-700">
                  비밀번호 찾기
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    'w-full bg-[var(--bg2)] border rounded-xl px-4 py-2.5 text-sm text-[var(--txt)]',
                    'placeholder:text-[var(--txt3)] outline-none transition-colors pr-10',
                    'focus:border-indigo-400 focus:bg-[var(--bg)]',
                    error ? 'border-rose-300' : 'border-[var(--bdr)]',
                  )}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--txt3)] hover:text-[var(--txt2)] transition-colors cursor-pointer">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5">
                <AlertCircle size={13} className="text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-rose-600">{error}</p>
              </div>
            )}
            <button type="submit" disabled={loading}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl mt-1',
                'bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold',
                'transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
              )}>
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogIn size={15} />}
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[var(--bdr)]" />
            <span className="text-[11px] text-[var(--txt3)]">또는</span>
            <div className="flex-1 h-px bg-[var(--bdr)]" />
          </div>
          <p className="text-center text-xs text-[var(--txt2)]">
            아직 계정이 없으신가요?{' '}
            <Link href="/signup" className="text-indigo-500 hover:text-indigo-700 font-semibold">회원가입</Link>
          </p>
        </div>
      </div>
      <p className="text-center text-[11px] text-[var(--txt3)] mt-4">
        학번 이메일(<span className="font-medium">학번@hallym.ac.kr</span>)로 인증합니다
      </p>
    </div>
  );
}