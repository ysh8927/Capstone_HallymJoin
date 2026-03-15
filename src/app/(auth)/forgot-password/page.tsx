'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail, KeyRound, Eye, EyeOff, CheckCircle, ArrowLeft, AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 1 | 2 | 3;

function Spinner() {
  return <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />;
}
function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5 animate-fade-in">
      <AlertCircle size={13} className="text-rose-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-rose-600">{msg}</p>
    </div>
  );
}
function inputCls(err?: boolean) {
  return cn(
    'w-full bg-[var(--bg2)] border rounded-xl px-4 py-2.5 text-sm text-[var(--txt)]',
    'placeholder:text-[var(--txt3)] outline-none focus:border-indigo-400 focus:bg-[var(--bg)] transition-colors',
    err ? 'border-rose-300' : 'border-[var(--bdr)]',
  );
}

export default function ForgotPasswordPage() {
  const [step,       setStep]       = useState<Step>(1);
  const [studentId,  setStudentId]  = useState('');
  const [code,       setCode]       = useState('');
  const [password,   setPassword]   = useState('');
  const [passwordCf, setPasswordCf] = useState('');
  const [showPw,     setShowPw]     = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [resendSec,  setResendSec]  = useState(0);

  const email = studentId ? `${studentId}@hallym.ac.kr` : '';

  function startResendTimer() {
    setResendSec(60);
    const iv = setInterval(() => {
      setResendSec((s) => { if (s <= 1) { clearInterval(iv); return 0; } return s - 1; });
    }, 1000);
  }

  async function sendCode() {
    setError('');
    if (!/^\d{8,9}$/.test(studentId)) {
      setError('올바른 학번 형식을 입력해주세요. (예: 22100001)');
      return;
    }
    setLoading(true);
    // TODO: POST /api/auth/forgot-password
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep(2);
    startResendTimer();
  }

  async function verifyCode() {
    setError('');
    if (code.length !== 6) { setError('6자리 인증 코드를 입력해주세요.'); return; }
    setLoading(true);
    // TODO: POST /api/auth/verify-reset-code
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setStep(3);
  }

  async function resetPassword() {
    setError('');
    if (password.length < 8) { setError('비밀번호는 8자 이상이어야 합니다.'); return; }
    if (password !== passwordCf) { setError('비밀번호가 일치하지 않습니다.'); return; }
    setLoading(true);
    // TODO: POST /api/auth/reset-password
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setStep(3);
    setError('');
  }

  // Success state
  if (step === 3 && !loading && !error) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] shadow-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle size={28} className="text-emerald-500" />
            </div>
            <h2 className="text-lg font-serif font-bold text-[var(--txt)] mb-2">비밀번호가 변경되었습니다</h2>
            <p className="text-xs text-[var(--txt3)] mb-6">새 비밀번호로 로그인해주세요.</p>
            <Link
              href="/login"
              className="w-full flex items-center justify-center py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all"
            >
              로그인하러 가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] shadow-sm overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-serif font-bold text-[var(--txt)] mb-1">비밀번호 찾기</h1>
            <p className="text-xs text-[var(--txt2)]">
              {step === 1 && '학번을 입력하면 인증 코드를 발송합니다'}
              {step === 2 && '이메일로 전송된 인증 코드를 입력해주세요'}
              {step === 3 && '새 비밀번호를 설정하세요'}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {([1, 2, 3] as Step[]).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all',
                  step > s  ? 'bg-emerald-500 text-white' :
                  step === s ? 'bg-indigo-600 text-white' :
                               'bg-[var(--bg2)] text-[var(--txt3)] border border-[var(--bdr)]',
                )}>
                  {step > s ? <CheckCircle size={12} /> : s}
                </div>
                {s < 3 && <div className={cn('w-8 h-px', step > s ? 'bg-emerald-400' : 'bg-[var(--bdr)]')} />}
              </div>
            ))}
          </div>

          {/* ── Step 1: 학번 입력 ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5">학번</label>
                <input
                  type="text"
                  placeholder="예: 22100001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  className={inputCls(!!error)}
                />
                {studentId.length >= 8 && (
                  <p className="text-[11px] text-indigo-500 mt-1.5 flex items-center gap-1">
                    <Mail size={10} />
                    인증 메일: <span className="font-medium">{email}</span>
                  </p>
                )}
              </div>
              {error && <ErrorBox msg={error} />}
              <button
                onClick={sendCode}
                disabled={loading || studentId.length < 8}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all cursor-pointer disabled:opacity-40"
              >
                {loading ? <Spinner /> : <Mail size={14} />}
                {loading ? '발송 중...' : '인증 코드 발송'}
              </button>
            </div>
          )}

          {/* ── Step 2: 코드 확인 ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5 text-xs text-indigo-700">
                <span className="flex-shrink-0 mt-0.5">✉️</span>
                <p><strong>{email}</strong>으로 6자리 코드를 발송했습니다.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5">인증 코드 (6자리)</label>
                <input
                  type="text"
                  placeholder="000000"
                  value={code}
                  maxLength={6}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className={cn(inputCls(!!error), 'text-center tracking-[0.4em] font-mono font-semibold placeholder:tracking-normal placeholder:font-sans')}
                />
              </div>
              {error && <ErrorBox msg={error} />}
              <button
                onClick={verifyCode}
                disabled={loading || code.length !== 6}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all cursor-pointer disabled:opacity-40"
              >
                {loading ? <Spinner /> : <KeyRound size={14} />}
                {loading ? '확인 중...' : '코드 확인'}
              </button>
              <div className="flex items-center justify-between text-xs text-[var(--txt3)]">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 hover:text-[var(--txt2)] cursor-pointer">
                  <ArrowLeft size={11} /> 학번 변경
                </button>
                <button
                  onClick={sendCode}
                  disabled={resendSec > 0}
                  className="text-indigo-400 hover:text-indigo-600 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  {resendSec > 0 ? `재발송 (${resendSec}초)` : '재발송'}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: 새 비밀번호 ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5">새 비밀번호</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="8자 이상"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(inputCls(!!error), 'pr-10')}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--txt3)] hover:text-[var(--txt2)] cursor-pointer">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5">비밀번호 확인</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="비밀번호 재입력"
                    value={passwordCf}
                    onChange={(e) => setPasswordCf(e.target.value)}
                    className={cn(inputCls(!!(passwordCf && password !== passwordCf)), 'pr-10')}
                  />
                  {passwordCf && password === passwordCf && (
                    <CheckCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                  )}
                </div>
              </div>
              {error && <ErrorBox msg={error} />}
              <button
                onClick={resetPassword}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all cursor-pointer disabled:opacity-40 mt-1"
              >
                {loading ? <Spinner /> : <KeyRound size={14} />}
                {loading ? '변경 중...' : '비밀번호 변경'}
              </button>
            </div>
          )}

          <p className="text-center text-xs text-[var(--txt2)] mt-5">
            <Link href="/login" className="flex items-center justify-center gap-1 text-indigo-500 hover:text-indigo-700 font-semibold">
              <ArrowLeft size={11} /> 로그인으로 돌아가기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
