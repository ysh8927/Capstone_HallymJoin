'use client';

import { useState } from 'react';
import {
  User, Mail, BookOpen, GraduationCap, KeyRound,
  Eye, EyeOff, CheckCircle, AlertCircle, Bell, Shield,
} from 'lucide-react';
import { MOCK_USER } from '@/data/mockUser';
import { cn } from '@/lib/utils';

function inputCls(err?: boolean) {
  return cn(
    'w-full bg-[var(--bg2)] border rounded-xl px-4 py-2.5 text-sm text-[var(--txt)]',
    'placeholder:text-[var(--txt3)] outline-none focus:border-indigo-400 focus:bg-[var(--bg)] transition-colors',
    err ? 'border-rose-300' : 'border-[var(--bdr)]',
  );
}

type Tab = 'profile' | 'security' | 'notifications';

export default function ProfilePage() {
  const [tab,        setTab]        = useState<Tab>('profile');
  const [name,       setName]       = useState(MOCK_USER.name);
  const [department, setDepartment] = useState(MOCK_USER.department);
  const [grade,      setGrade]      = useState(MOCK_USER.grade);
  const [saved,      setSaved]      = useState(false);
  const [error,      setError]      = useState('');

  const [currentPw, setCurrentPw] = useState('');
  const [newPw,     setNewPw]     = useState('');
  const [newPwCf,   setNewPwCf]   = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [pwSaved,   setPwSaved]   = useState(false);
  const [pwError,   setPwError]   = useState('');

  const [notifComment, setNotifComment] = useState(true);
  const [notifLike,    setNotifLike]    = useState(true);
  const [notifNotice,  setNotifNotice]  = useState(true);
  const [notifJoin,    setNotifJoin]    = useState(true);

  function saveProfile() {
    setError('');
    if (!name.trim())       { setError('이름을 입력해주세요.'); return; }
    if (!department.trim()) { setError('학과를 입력해주세요.'); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function savePw() {
    setPwError('');
    if (!currentPw) { setPwError('현재 비밀번호를 입력해주세요.'); return; }
    if (newPw.length < 8) { setPwError('새 비밀번호는 8자 이상이어야 합니다.'); return; }
    if (newPw !== newPwCf) { setPwError('새 비밀번호가 일치하지 않습니다.'); return; }
    setPwSaved(true);
    setCurrentPw(''); setNewPw(''); setNewPwCf('');
    setTimeout(() => setPwSaved(false), 2500);
  }

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile',       label: '프로필',    icon: <User size={14} /> },
    { id: 'security',      label: '보안',       icon: <Shield size={14} /> },
    { id: 'notifications', label: '알림 설정', icon: <Bell size={14} /> },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-serif font-bold text-[var(--txt)]">프로필 설정</h1>
        <p className="text-xs text-[var(--txt3)] mt-1">계정 정보와 알림 설정을 관리합니다.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--bg2)] rounded-xl border border-[var(--bdr)] mb-6">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer',
              tab === id
                ? 'bg-[var(--bg)] text-indigo-600 shadow-sm border border-[var(--bdr)]'
                : 'text-[var(--txt2)] hover:text-[var(--txt)]',
            )}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* ── Profile tab ── */}
      {tab === 'profile' && (
        <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] p-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {name[0] || '?'}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--txt)]">{MOCK_USER.email}</p>
              <p className="text-xs text-[var(--txt3)] mt-0.5">학번: {MOCK_USER.studentId}</p>
            </div>
          </div>

          <div className="h-px bg-[var(--bdr)]" />

          {/* Fields */}
          <div>
            <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5 flex items-center gap-1.5">
              <User size={12} /> 이름
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls(!!error && !name.trim())} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5 flex items-center gap-1.5">
                <BookOpen size={12} /> 학과
              </label>
              <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className={inputCls(!!error && !department.trim())} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5 flex items-center gap-1.5">
                <GraduationCap size={12} /> 학년
              </label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className={cn(inputCls(), 'cursor-pointer')}>
                {['1', '2', '3', '4'].map((g) => (
                  <option key={g} value={g}>{g}학년</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5 flex items-center gap-1.5">
              <Mail size={12} /> 이메일 (변경 불가)
            </label>
            <input type="text" value={MOCK_USER.email} disabled className={cn(inputCls(), 'opacity-50 cursor-not-allowed')} />
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5">
              <AlertCircle size={13} className="text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-rose-600">{error}</p>
            </div>
          )}
          {saved && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 animate-fade-in">
              <CheckCircle size={13} className="text-emerald-500" />
              <p className="text-xs text-emerald-600 font-medium">저장되었습니다.</p>
            </div>
          )}

          <button
            onClick={saveProfile}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            변경 사항 저장
          </button>
        </div>
      )}

      {/* ── Security tab ── */}
      {tab === 'security' && (
        <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] p-6 space-y-5">
          <h2 className="text-sm font-semibold text-[var(--txt)] flex items-center gap-2">
            <KeyRound size={14} className="text-indigo-500" /> 비밀번호 변경
          </h2>
          <div>
            <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5">현재 비밀번호</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} placeholder="현재 비밀번호" value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)} className={cn(inputCls(!!pwError && !currentPw), 'pr-10')} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--txt3)] hover:text-[var(--txt2)] cursor-pointer">
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5">새 비밀번호</label>
            <input type={showPw ? 'text' : 'password'} placeholder="8자 이상" value={newPw}
              onChange={(e) => setNewPw(e.target.value)} className={inputCls(!!pwError && newPw.length < 8 && newPw.length > 0)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--txt2)] mb-1.5">새 비밀번호 확인</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} placeholder="비밀번호 재입력" value={newPwCf}
                onChange={(e) => setNewPwCf(e.target.value)} className={cn(inputCls(!!(newPwCf && newPw !== newPwCf)), 'pr-10')} />
              {newPwCf && newPw === newPwCf && (
                <CheckCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>
          </div>
          {pwError && (
            <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5">
              <AlertCircle size={13} className="text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-rose-600">{pwError}</p>
            </div>
          )}
          {pwSaved && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 animate-fade-in">
              <CheckCircle size={13} className="text-emerald-500" />
              <p className="text-xs text-emerald-600 font-medium">비밀번호가 변경되었습니다.</p>
            </div>
          )}
          <button onClick={savePw}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors cursor-pointer">
            비밀번호 변경
          </button>
        </div>
      )}

      {/* ── Notifications tab ── */}
      {tab === 'notifications' && (
        <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] p-6 space-y-1">
          <h2 className="text-sm font-semibold text-[var(--txt)] mb-4 flex items-center gap-2">
            <Bell size={14} className="text-indigo-500" /> 알림 수신 설정
          </h2>
          {[
            { label: '댓글 알림',    desc: '내 게시글에 댓글이 달릴 때',     value: notifComment, set: setNotifComment },
            { label: '좋아요 알림',  desc: '내 게시글에 좋아요가 달릴 때',   value: notifLike,    set: setNotifLike    },
            { label: '공지 알림',    desc: '가입한 동아리에 공지가 올라올 때', value: notifNotice, set: setNotifNotice  },
            { label: '가입 승인 알림', desc: '동아리 가입 신청이 처리될 때',  value: notifJoin,   set: setNotifJoin    },
          ].map(({ label, desc, value, set }) => (
            <label
              key={label}
              className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl hover:bg-[var(--bg2)] transition-colors cursor-pointer"
            >
              <div>
                <p className="text-sm font-medium text-[var(--txt)]">{label}</p>
                <p className="text-xs text-[var(--txt3)] mt-0.5">{desc}</p>
              </div>
              <div
                onClick={() => set(!value)}
                className={cn(
                  'relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0',
                  value ? 'bg-indigo-600' : 'bg-[var(--bg3)]',
                )}
                style={{ height: '22px', width: '40px' }}
              >
                <span className={cn(
                  'absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform',
                  value ? 'translate-x-[19px]' : 'translate-x-0.5',
                )} style={{ width: '18px', height: '18px', top: '2px', transitionProperty: 'transform' }} />
              </div>
            </label>
          ))}
          <div className="pt-3">
            <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors cursor-pointer">
              알림 설정 저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
}