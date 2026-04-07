'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Mail, KeyRound, User, Eye, EyeOff, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: '학번 입력',
  2: '이메일 인증',
  3: '정보 입력',
};

export default function SignupPage() {
  const [step,       setStep]       = useState<Step>(1);
  const [studentId,  setStudentId]  = useState('');
  const [code,       setCode]       = useState('');
  const [name,       setName]       = useState('');
  const [department, setDepartment] = useState('');
  const [grade,      setGrade]      = useState('');
  const [password,   setPassword]   = useState('');
  const [passwordCf, setPasswordCf] = useState('');
  const [showPw,     setShowPw]     = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [resendSec,  setResendSec]  = useState(0);

  const email = studentId ? `${studentId}@hallym.ac.kr` : '';

  async function sendCode() {
    setError('');
    if (!/^\d{8,9}$/.test(studentId)) {
      setError('올바른 학번 형식을 입력해주세요. (예: 22100001)');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep(2);
    startResendTimer();
  }

  function startResendTimer() {
    setResendSec(60);
    const iv = setInterval(() => {
      setResendSec((s) => { if (s <= 1) { clearInterval(iv); return 0; } return s - 1; });
    }, 1000);
  }

  async function verifyCode() {
    setError('');
    if (code.length !== 6) { setError('6자리 인증 코드를 입력해주세요.'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep(3);
  }

  async function completeSignup() {
    setError('');
    if (!name.trim())        { setError('이름을 입력해주세요.'); return; }
    if (!department.trim())  { setError('학과를 입력해주세요.'); return; }
    if (!grade)              { setError('학년을 선택해주세요.'); return; }
    if (password.length < 8) { setError('비밀번호는 8자 이상이어야 합니다.'); return; }
    if (password !== passwordCf) { setError('비밀번호가 일치하지 않습니다.'); return; }

    setLoading(true);

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, name, password, grade, department }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || '오류가 발생했습니다.');
      return;
    }

    await signIn('credentials', { studentId, password, callbackUrl: '/home' });
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] shadow-sm overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            {([1, 2, 3] as Step[]).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all',
                  step > s   ? 'bg-emerald-500 text-white' :
                  step === s ? 'bg-indigo-600 text-white' :
                               'bg-[var(--bg2)] text-[var(--txt3)] border border-[var(--bdr)]',
                )}>
                  {step > s ? <CheckCircle size={12} /> : s}
                </div>
                {s < 3 && <div className={cn('w-8 h-px', step > s ? 'bg-emerald-400' : 'bg-[var(--bdr)]')} />}
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-serif font-bold text-[var(--txt)] mb-1">회원가입</h1>
            <p className="text-xs text-[var(--txt2)]">{STEP_LABELS[step]}</p>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5">학번</label>
                <input
                  type="text"
                  placeholder="예: 22100001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  className={cn(
                    'w-full bg-[var(--bg2)] border rounded-xl px-4 py-2.5 text-sm text-[var(--txt)]',
                    'placeholder:text-[var(--txt3)] outline-none focus:border-indigo-400 focus:bg-[var(--bg)] transition-colors',
                    error ? 'border-rose-300' : 'border-[var(--bdr)]',
                  )}
                />
                {studentId.length >= 8 && (
                  <p className="text-[11px] text-indigo-500 mt-1.5 flex items-center gap-1">
                    <Mail size={10} />
                    인증 이메일: <span className="font-medium">{email}</span>
                  </p>
                )}
              </div>
              <InfoBox>
                학번 이메일(<strong>{studentId || 'XXXXXXXX'}@hallym.ac.kr</strong>)로 인증 코드가 발송됩니다.
                한림대학교 재학·휴학생만 가입 가능합니다.
              </InfoBox>
              {error && <ErrorBox msg={error} />}
              <button onClick={sendCode} disabled={loading || studentId.length < 8}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all cursor-pointer disabled:opacity-40">
                {loading ? <Spinner /> : <Mail size={14} />}
                {loading ? '발송 중...' : '인증 코드 발송'}
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <InfoBox icon="✉️">
                <strong>{email}</strong>으로 6자리 인증 코드를 발송했습니다. 메일함을 확인해주세요.
              </InfoBox>
              <div>
                <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5">인증 코드 (6자리)</label>
                <input
                  type="text"
                  placeholder="000000"
                  value={code}
                  maxLength={6}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className={cn(
                    'w-full bg-[var(--bg2)] border rounded-xl px-4 py-2.5 text-sm text-[var(--txt)]',
                    'text-center tracking-[0.4em] font-mono font-semibold',
                    'placeholder:tracking-normal placeholder:font-sans',
                    'placeholder:text-[var(--txt3)] outline-none focus:border-indigo-400 focus:bg-[var(--bg)] transition-colors',
                    error ? 'border-rose-300' : 'border-[var(--bdr)]',
                  )}
                />
              </div>
              {error && <ErrorBox msg={error} />}
              <button onClick={verifyCode} disabled={loading || code.length !== 6}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all cursor-pointer disabled:opacity-40">
                {loading ? <Spinner /> : <KeyRound size={14} />}
                {loading ? '확인 중...' : '인증 코드 확인'}
              </button>
              <div className="flex items-center justify-between text-xs text-[var(--txt3)]">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 hover:text-[var(--txt2)] cursor-pointer">
                  <ArrowLeft size={11} /> 학번 변경
                </button>
                <button onClick={sendCode} disabled={resendSec > 0}
                  className="text-indigo-400 hover:text-indigo-600 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">
                  {resendSec > 0 ? `재발송 (${resendSec}초)` : '재발송'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5">이름</label>
                <input type="text" placeholder="홍길동" value={name} onChange={(e) => setName(e.target.value)}
                  className={inputCls(error)} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5">학과</label>
                  <input type="text" placeholder="소프트웨어학부" value={department} onChange={(e) => setDepartment(e.target.value)}
                    className={inputCls(error)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5">학년</label>
                  <select value={grade} onChange={(e) => setGrade(e.target.value)}
                    className={cn(inputCls(''), 'cursor-pointer')}>
                    <option value="">선택</option>
                    {['1', '2', '3', '4'].map((g) => (
                      <option key={g} value={g}>{g}학년</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5">비밀번호</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} placeholder="8자 이상" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(inputCls(error), 'pr-10')} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--txt3)] hover:text-[var(--txt2)] cursor-pointer">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {password && (
                  <div className="flex gap-1 mt-1.5">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={cn('h-1 flex-1 rounded-full transition-all',
                        pwStrength(password) > i
                          ? pwStrength(password) <= 1 ? 'bg-rose-400'
                          : pwStrength(password) <= 2 ? 'bg-amber-400'
                          : 'bg-emerald-400'
                          : 'bg-[var(--bg3)]')} />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5">비밀번호 확인</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} placeholder="비밀번호 재입력" value={passwordCf}
                    onChange={(e) => setPasswordCf(e.target.value)}
                    className={cn(inputCls(passwordCf && password !== passwordCf ? 'err' : ''), 'pr-8')} />
                  {passwordCf && password === passwordCf && (
                    <CheckCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                  )}
                </div>
              </div>
              {error && <ErrorBox msg={error} />}
              <button onClick={completeSignup} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all cursor-pointer disabled:opacity-40 mt-1">
                {loading ? <Spinner /> : <User size={14} />}
                {loading ? '가입 중...' : '가입 완료'}
              </button>
            </div>
          )}

          <p className="text-center text-xs text-[var(--txt2)] mt-5">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-indigo-500 hover:text-indigo-700 font-semibold">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function inputCls(err: string) {
  return cn(
    'w-full bg-[var(--bg2)] border rounded-xl px-4 py-2.5 text-sm text-[var(--txt)]',
    'placeholder:text-[var(--txt3)] outline-none focus:border-indigo-400 focus:bg-[var(--bg)] transition-colors',
    err ? 'border-rose-300' : 'border-[var(--bdr)]',
  );
}

function pwStrength(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) || /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

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

function InfoBox({ children, icon = 'ℹ️' }: { children: React.ReactNode; icon?: string }) {
  return (
    <div className="flex items-start gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5">
      <span className="text-xs flex-shrink-0 mt-0.5">{icon}</span>
      <p className="text-xs text-indigo-700 leading-relaxed">{children}</p>
    </div>
  );
}