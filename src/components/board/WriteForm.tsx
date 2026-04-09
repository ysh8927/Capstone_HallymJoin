'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bold, Italic, Underline, List, Quote, Image as ImageIcon,
  Paperclip, Pin, ChevronDown, X, AlertCircle, CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PostCategory, POST_CATEGORY_LABEL } from '@/types';

interface WriteFormProps {
  clubId: string;
  clubName: string;
  isPresident?: boolean;
}

const CATEGORIES: PostCategory[] = ['free', 'notice', 'photo', 'qna'];

export default function WriteForm({ clubId, clubName, isPresident = false }: WriteFormProps) {
  const router = useRouter();
  const bodyRef = useRef<HTMLDivElement>(null);

  const [category,    setCategory]    = useState<PostCategory>('free');
  const [title,       setTitle]       = useState('');
  const [pinned,      setPinned]      = useState(false);
  const [charCount,   setCharCount]   = useState(0);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [error,       setError]       = useState('');

  const MAX_CHARS = 3000;

  function onBodyInput() {
    const text = bodyRef.current?.innerText ?? '';
    setCharCount(text.length);
  }

  function applyFormat(cmd: string) {
    document.execCommand(cmd, false);
    bodyRef.current?.focus();
  }

  function handleAttach() {
    const names = ['image.jpg', 'document.pdf', 'photo.png'];
    const name = names[attachments.length % names.length];
    setAttachments((prev) => [...prev, name]);
  }

  async function handleSubmit() {
    setError('');
    if (!title.trim()) { setError('제목을 입력해주세요.'); return; }
    const body = bodyRef.current?.innerHTML ?? '';
    if (!body.trim() || body === '<br>') { setError('내용을 입력해주세요.'); return; }
    if (charCount > MAX_CHARS) { setError(`내용은 ${MAX_CHARS}자 이내로 입력해주세요.`); return; }

    setSubmitting(true);

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clubId, category, title, body, isPinned: pinned }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || '오류가 발생했습니다.');
      return;
    }

    setSubmitted(true);
    setTimeout(() => router.push(`/clubs/${clubId}`), 1500);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
          <CheckCircle size={28} className="text-emerald-500" />
        </div>
        <p className="text-base font-semibold text-[var(--txt)] mb-1">게시글이 등록되었습니다!</p>
        <p className="text-xs text-[var(--txt3)]">잠시 후 게시판으로 이동합니다...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] overflow-hidden shadow-sm">

        <div className="px-5 py-4 border-b border-[var(--bdr)] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[var(--txt)]">새 게시글 작성</h2>
            <p className="text-[11px] text-[var(--txt3)] mt-0.5">대상: <span className="font-medium text-[var(--txt2)]">{clubName}</span> 전원</p>
          </div>
          <div className="flex items-center gap-2">
            {(isPresident || category === 'notice') && (
              <button onClick={() => setPinned(!pinned)}
                className={cn(
                  'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer',
                  pinned
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'bg-[var(--bg2)] text-[var(--txt2)] border-[var(--bdr)] hover:bg-[var(--bg3)]',
                )}>
                <Pin size={12} className={pinned ? 'fill-amber-500' : ''} />
                {pinned ? '고정됨' : '공지 고정'}
              </button>
            )}
            <button onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors cursor-pointer disabled:opacity-50">
              {submitting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {submitting ? '등록 중...' : '게시하기'}
            </button>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-[var(--bdr)] flex items-center gap-3 flex-wrap">
          <div className="relative">
            <select value={category} onChange={(e) => setCategory(e.target.value as PostCategory)}
              className="appearance-none bg-[var(--bg2)] border border-[var(--bdr)] rounded-lg pl-3 pr-7 py-1.5 text-xs font-medium text-[var(--txt)] outline-none focus:border-indigo-400 cursor-pointer">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{POST_CATEGORY_LABEL[c]}</option>
              ))}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--txt3)] pointer-events-none" />
          </div>
          <span className={cn(
            'ml-auto text-[11px] font-medium',
            charCount > MAX_CHARS * 0.9 ? 'text-rose-500' : 'text-[var(--txt3)]',
          )}>
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}자
          </span>
        </div>

        <div className="px-4 py-2 border-b border-[var(--bdr)] flex items-center gap-0.5 flex-wrap">
          {[
            { icon: <Bold size={13} />,      cmd: 'bold',      title: '굵게' },
            { icon: <Italic size={13} />,    cmd: 'italic',    title: '기울임' },
            { icon: <Underline size={13} />, cmd: 'underline', title: '밑줄' },
          ].map(({ icon, cmd, title }) => (
            <button key={cmd} title={title} onMouseDown={(e) => { e.preventDefault(); applyFormat(cmd); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--txt2)] hover:bg-[var(--bg2)] transition-colors cursor-pointer">
              {icon}
            </button>
          ))}
          <div className="w-px h-4 bg-[var(--bdr)] mx-1" />
          {[
            { icon: <List size={13} />,  cmd: 'insertUnorderedList', title: '목록' },
            { icon: <Quote size={13} />, cmd: 'formatBlock',         title: '인용구', val: 'blockquote' },
          ].map(({ icon, cmd, title, val }) => (
            <button key={cmd} title={title}
              onMouseDown={(e) => { e.preventDefault(); document.execCommand(cmd, false, val); bodyRef.current?.focus(); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--txt2)] hover:bg-[var(--bg2)] transition-colors cursor-pointer">
              {icon}
            </button>
          ))}
          <div className="w-px h-4 bg-[var(--bdr)] mx-1" />
          <button title="이미지 첨부" onClick={handleAttach}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--txt2)] hover:bg-[var(--bg2)] transition-colors cursor-pointer">
            <ImageIcon size={13} />
          </button>
          <button title="파일 첨부" onClick={handleAttach}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--txt2)] hover:bg-[var(--bg2)] transition-colors cursor-pointer">
            <Paperclip size={13} />
          </button>
        </div>

        <div className="px-5 pt-4 pb-2">
          <input type="text" placeholder="제목을 입력하세요" value={title}
            onChange={(e) => setTitle(e.target.value)} maxLength={100}
            className="w-full text-xl font-serif font-bold text-[var(--txt)] placeholder:text-[var(--txt3)] bg-transparent outline-none" />
        </div>
        <div className="mx-5 h-px bg-[var(--bdr)]" />

        <div ref={bodyRef} contentEditable onInput={onBodyInput}
          data-placeholder="내용을 입력하세요..."
          className={cn(
            'min-h-48 px-5 py-4 text-sm text-[var(--txt)] leading-relaxed outline-none',
            'empty:before:content-[attr(data-placeholder)] empty:before:text-[var(--txt3)]',
            '[&_blockquote]:border-l-4 [&_blockquote]:border-indigo-400 [&_blockquote]:pl-3 [&_blockquote]:text-[var(--txt2)] [&_blockquote]:my-2',
          )}
          suppressContentEditableWarning />

        <div className="px-5 py-3 border-t border-[var(--bdr)] flex items-center gap-3 flex-wrap">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((name, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-700 text-[11px] px-2.5 py-1 rounded-full">
                  <Paperclip size={10} />
                  {name}
                  <button onClick={() => setAttachments((a) => a.filter((_, j) => j !== i))} className="cursor-pointer hover:text-teal-900">
                    <X size={9} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-500 animate-fade-in">
              <AlertCircle size={12} />
              {error}
            </div>
          )}
          {!error && (
            <p className="text-[11px] text-[var(--txt3)]">마크다운 기본 문법 지원 · 이미지는 최대 10MB</p>
          )}
        </div>
      </div>
    </div>
  );
}