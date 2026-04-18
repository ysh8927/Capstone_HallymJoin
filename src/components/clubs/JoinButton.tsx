'use client';

import { useState } from 'react';

interface JoinButtonProps {
  clubId: string;
  isRecruiting: boolean;
}

export default function JoinButton({ clubId, isRecruiting }: JoinButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleJoin() {
    if (loading) return;
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`/api/clubs/${clubId}/join`, {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('가입 신청이 완료되었습니다! 승인을 기다려주세요.');
      } else {
        setMessage(data.error || '오류가 발생했습니다.');
      }
    } catch (err) {
      setMessage('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  if (!isRecruiting) {
    return (
      <div className="w-full text-center text-xs text-[var(--txt3)] bg-[var(--bg2)] border border-[var(--bdr)] py-3 rounded-xl">
        현재 모집이 마감되었습니다
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-xl transition-colors cursor-pointer">
        {loading ? '신청 중...' : '가입 신청하기'}
      </button>
      {message && (
        <p className={`text-xs mt-2 text-center ${message.includes('완료') ? 'text-emerald-600' : 'text-rose-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}