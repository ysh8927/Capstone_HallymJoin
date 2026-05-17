'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Instagram, Mail, Globe, ChevronRight,
  Users, Building2, Megaphone, CalendarDays,
  Star, Heart, BookOpen, Trophy, X,
} from 'lucide-react';
import { CLUBS } from '@/data/clubs';
import { CATEGORY_LABEL } from '@/types';
import type { ClubCategory } from '@/types';

const DIVISIONS: { category: ClubCategory; icon: string; color: string; color2: string; desc: string }[] = [
  { category: 'hobby',       icon: '🎨', color: '#F59E0B', color2: '#D97706', desc: '취미·예술 활동을 중심으로 창의적 자기표현을 추구합니다.' },
  { category: 'academic',    icon: '📚', color: '#6366F1', color2: '#4F46E5', desc: '학문적 탐구와 연구 중심의 심화 학습을 진행합니다.' },
  { category: 'religion',    icon: '🙏', color: '#8B5CF6', color2: '#7C3AED', desc: '신앙과 종교적 가치를 바탕으로 친목을 도모합니다.' },
  { category: 'volunteer',   icon: '🤝', color: '#22C55E', color2: '#16A34A', desc: '지역사회에 기여하는 다양한 봉사 활동을 펼칩니다.' },
  { category: 'performance', icon: '🎭', color: '#EC4899', color2: '#DB2777', desc: '공연 예술을 통해 창의성과 팀워크를 키웁니다.' },
  { category: 'sports',      icon: '⚽', color: '#0EA5E9', color2: '#0284C7', desc: '체육 활동으로 건강한 캠퍼스 문화를 만들어갑니다.' },
];

const NOTICES = [
  { id: 1, date: '2025.03.14', title: '2025년도 1학기 동아리 등록 안내', category: '공지', pinned: true,
    content: '2025년도 1학기 동아리 등록을 다음과 같이 안내드립니다.\n\n- 등록 기간: 2025년 3월 14일 ~ 3월 28일\n- 제출 서류: 동아리 등록 신청서, 회원 명단, 활동 계획서\n- 제출 방법: 총동아리연합회 사무실 방문 또는 이메일 제출\n\n기한 내 미등록 시 동아리 활동 지원이 제한될 수 있습니다.' },
  { id: 2, date: '2025.03.12', title: '2025 한림대학교 동아리 박람회 개최 안내', category: '행사', pinned: true,
    content: '2025 한림대학교 동아리 박람회를 개최합니다.\n\n- 일시: 2025년 3월 20일(목) 오전 10시 ~ 오후 4시\n- 장소: 한림대학교 대운동장\n- 내용: 각 동아리 부스 운영, 공연, 가입 신청\n\n신입생 여러분의 많은 참여 바랍니다!' },
  { id: 3, date: '2025.03.10', title: '신규 동아리 설립 신청 접수 (3월 말까지)', category: '공지', pinned: false,
    content: '신규 동아리 설립을 희망하는 학생들을 위한 안내입니다.\n\n- 접수 기간: 2025년 3월 10일 ~ 3월 31일\n- 설립 요건: 회원 10명 이상, 지도교수 확보\n- 제출 서류: 설립 신청서, 회원 명단, 활동 계획서, 지도교수 승인서\n\n문의: chowol@hallym.ac.kr' },
  { id: 4, date: '2025.03.07', title: '동아리방 배정 및 예산 지원 계획 안내', category: '공지', pinned: false,
    content: '2025년도 동아리방 배정 및 예산 지원 계획을 안내드립니다.\n\n- 동아리방 배정: 3월 중 추첨을 통해 배정\n- 예산 지원: 등록 동아리 대상 활동비 지원\n- 지원 금액: 동아리 규모에 따라 차등 지원\n\n자세한 내용은 총동아리연합회 사무실로 문의해주세요.' },
  { id: 5, date: '2025.02.28', title: '2025년 동아리 활동비 집행 기준 공지', category: '공지', pinned: false,
    content: '2025년 동아리 활동비 집행 기준을 안내드립니다.\n\n- 활동비는 동아리 활동 목적에 맞게 사용해야 합니다.\n- 영수증 및 증빙 서류를 반드시 보관해야 합니다.\n- 분기별 활동비 정산 보고서를 제출해야 합니다.\n\n규정 위반 시 다음 학기 지원이 제한될 수 있습니다.' },
];

const EVENTS = [
  { month: '3월', title: '동아리 박람회', desc: '신입생 대상 동아리 소개 행사', icon: '🎪', color: '#6366F1' },
  { month: '5월', title: '연합 체육대회', desc: '분과별 동아리 교류 체육 행사', icon: '⚽', color: '#0EA5E9' },
  { month: '9월', title: '동아리 축제', desc: '연합 공연 및 부스 운영', icon: '🎭', color: '#EC4899' },
  { month: '11월', title: '연말 발표회', desc: '한 해 활동 성과 발표', icon: '🏆', color: '#F59E0B' },
];

export default function FederationPage() {
  const totalClubs   = CLUBS.length;
  const totalMembers = CLUBS.reduce((s, c) => s + c.memberCount, 0);
  const recruiting   = CLUBS.filter((c) => c.isRecruiting).length;

  const [selectedNotice, setSelectedNotice] = useState<typeof NOTICES[0] | null>(null);
  const [showAllNotices, setShowAllNotices] = useState(false);

  const displayedNotices = showAllNotices ? NOTICES : NOTICES.slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => setSelectedNotice(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {selectedNotice.pinned
                  ? <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">고정</span>
                  : <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md">{selectedNotice.category}</span>
                }
                <span className="text-[11px] text-[var(--txt3)]">{selectedNotice.date}</span>
              </div>
              <button onClick={() => setSelectedNotice(null)}
                className="text-[var(--txt3)] hover:text-[var(--txt2)] cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <h3 className="text-base font-semibold text-[var(--txt)] mb-4">{selectedNotice.title}</h3>
            <p className="text-sm text-[var(--txt2)] leading-relaxed whitespace-pre-line">{selectedNotice.content}</p>
          </div>
        </div>
      )}

      <div className="relative rounded-3xl overflow-hidden mb-8"
        style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #DB2777 100%)' }}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative px-8 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-2xl">
              🏛️
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium">한림대학교</p>
              <h1 className="text-white text-xl md:text-2xl font-serif font-bold">총동아리연합회</h1>
            </div>
          </div>
          <p className="text-white/80 text-sm leading-relaxed max-w-lg mb-8">
            한림대학교 총동아리연합회는 교내 모든 중앙동아리를 대표하며,
            동아리 활동의 활성화와 학생 문화 증진을 위해 운영되는 학생자치기구입니다.
          </p>

          <div className="flex flex-wrap gap-4">
            {[
              { icon: <Building2 size={14} />, value: `${totalClubs}개`, label: '중앙동아리' },
              { icon: <Users size={14} />,     value: `${totalMembers}명+`, label: '활동 부원' },
              { icon: <Star size={14} />,      value: `${recruiting}개`, label: '현재 모집 중' },
              { icon: <CalendarDays size={14} />, value: '연 4회+', label: '연합 행사' },
            ].map(({ icon, value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
                <div className="flex items-center gap-1.5 text-white/60 text-xs mb-1">{icon}{label}</div>
                <p className="text-white font-bold text-lg leading-none">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          <section className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--bdr)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone size={15} className="text-indigo-500" />
                <h2 className="text-sm font-semibold text-[var(--txt)]">공지사항</h2>
              </div>
              <button
                onClick={() => setShowAllNotices(!showAllNotices)}
                className="text-xs text-[var(--txt3)] hover:text-indigo-500 transition-colors cursor-pointer">
                {showAllNotices ? '접기' : '전체보기'}
              </button>
            </div>
            <ul className="divide-y divide-[var(--bdr)]">
              {displayedNotices.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => setSelectedNotice(n)}
                    className="w-full px-5 py-3.5 flex items-start gap-3 hover:bg-[var(--bg2)] transition-colors text-left cursor-pointer group">
                    <div className="flex-shrink-0 mt-0.5">
                      {n.pinned
                        ? <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">고정</span>
                        : <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md">{n.category}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--txt)] font-medium group-hover:text-indigo-600 transition-colors truncate">{n.title}</p>
                      <p className="text-[11px] text-[var(--txt3)] mt-0.5">{n.date}</p>
                    </div>
                    <ChevronRight size={13} className="flex-shrink-0 text-[var(--txt3)] mt-0.5 group-hover:text-indigo-400 transition-colors" />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays size={15} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-[var(--txt)]">연간 주요 행사</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {EVENTS.map((ev) => (
                <div key={ev.month} className="rounded-xl border border-[var(--bdr)] p-3 text-center hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors">
                  <div className="text-2xl mb-2">{ev.icon}</div>
                  <p className="text-[10px] font-semibold text-[var(--txt3)] mb-0.5">{ev.month}</p>
                  <p className="text-xs font-bold text-[var(--txt)] mb-1">{ev.title}</p>
                  <p className="text-[11px] text-[var(--txt3)] leading-tight">{ev.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={15} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-[var(--txt)]">분과 소개</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DIVISIONS.map((div) => {
                const count = CLUBS.filter((c) => c.category === div.category).length;
                return (
                  <Link
                    key={div.category}
                    href={`/clubs?category=${div.category}`}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-[var(--bdr)] hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors group"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${div.color}22, ${div.color2}22)` }}
                    >
                      {div.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-xs font-semibold text-[var(--txt)] group-hover:text-indigo-600 transition-colors">
                          {CATEGORY_LABEL[div.category]}
                        </p>
                        <span className="text-[10px] text-[var(--txt3)] bg-[var(--bg2)] px-1.5 py-0.5 rounded-full">{count}개</span>
                      </div>
                      <p className="text-[11px] text-[var(--txt3)] leading-relaxed">{div.desc}</p>
                    </div>
                    <ChevronRight size={12} className="flex-shrink-0 text-[var(--txt3)] group-hover:text-indigo-400 mt-1" />
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] p-5">
            <h3 className="text-xs font-semibold text-[var(--txt3)] uppercase tracking-wider mb-4">연락처 & SNS</h3>
            <div className="space-y-3">
            <a  
                href="https://www.instagram.com/hallym.chowol"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg2)] transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Instagram size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--txt)] group-hover:text-indigo-600 transition-colors">인스타그램</p>
                  <p className="text-[11px] text-[var(--txt3)]">@hallym.chowol</p>
                </div>
              </a>
              <div className="flex items-center gap-3 p-3 rounded-xl">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--txt)]">이메일</p>
                  <p className="text-[11px] text-[var(--txt3)]">chowol@hallym.ac.kr</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl">
                <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
                  <Globe size={16} className="text-teal-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--txt)]">위치</p>
                  <p className="text-[11px] text-[var(--txt3)]">학생회관 2층 총학생회 사무실</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={14} className="text-indigo-500" />
              <h3 className="text-xs font-semibold text-indigo-700">총동아리연합회 운영 목표</h3>
            </div>
            <ul className="space-y-2">
              {[
                '동아리 활동 지원 및 활성화',
                '학생 자치 문화 증진',
                '분과 간 교류 및 연합 행사 운영',
                '신규 동아리 설립 지원',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-indigo-700">
                  <span className="text-indigo-400 mt-0.5">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[var(--bg)] rounded-2xl border border-[var(--bdr)] p-5">
            <h3 className="text-xs font-semibold text-[var(--txt3)] uppercase tracking-wider mb-3">바로가기</h3>
            <div className="space-y-1">
              {[
                { href: '/clubs', label: '전체 동아리 탐색', icon: <Building2 size={13} /> },
                { href: '/clubs?recruiting=true', label: '모집 중인 동아리', icon: <Star size={13} /> },
                { href: '/clubs?category=performance', label: '공연분과 동아리', icon: <Trophy size={13} /> },
              ].map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[var(--bg2)] transition-colors group"
                >
                  <span className="text-[var(--txt3)] group-hover:text-indigo-500 transition-colors">{icon}</span>
                  <span className="text-xs text-[var(--txt2)] group-hover:text-[var(--txt)] transition-colors">{label}</span>
                  <ChevronRight size={11} className="ml-auto text-[var(--txt3)] group-hover:text-indigo-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}