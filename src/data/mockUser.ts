import type { User, Notification } from '@/types';

// ── Mock logged-in user ──────────────────────────────────────
export const MOCK_USER: User & { bookmarkedClubs: string[]; joinedAt: string } = {
  id: 'user-1',
  name: '김민준',
  studentId: '22100042',
  grade: '2',
  department: '소프트웨어학부',
  email: '22100042@hallym.ac.kr',
  joinedClubs: ['chaos', 'chumbaram'],
  bookmarkedClubs: ['hologram', 'coda', 'unicorn'],
  role: 'student',
  joinedAt: '2022.03.01',
};

// ── Mock notifications ───────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'reply',
    message: 'CHAOS 게시판 내 댓글에 답글이 달렸습니다.',
    time: '5분 전',
    isRead: false,
    clubId: 'chaos',
  },
  {
    id: 'n2',
    type: 'notice',
    message: '[CHAOS] 새 공지: 2025년 1학기 신입 부원 모집 안내',
    time: '2시간 전',
    isRead: false,
    clubId: 'chaos',
  },
  {
    id: 'n3',
    type: 'like',
    message: '내 게시글에 좋아요가 11개 달렸습니다.',
    time: '1일 전',
    isRead: false,
    clubId: 'chaos',
  },
  {
    id: 'n4',
    type: 'notice',
    message: '[춤바람] 새 공지: 2025 봄 정기 공연 — 날짜 확정!',
    time: '3일 전',
    isRead: true,
    clubId: 'chumbaram',
  },
  {
    id: 'n5',
    type: 'join',
    message: 'CHAOS 동아리 가입이 승인되었습니다. 환영합니다!',
    time: '1주일 전',
    isRead: true,
    clubId: 'chaos',
  },
];

// ── Mock activity feed ───────────────────────────────────────
export const MOCK_ACTIVITY = [
  {
    id: 'a1',
    type: 'comment' as const,
    content: 'BFS/DFS 스터디 후기에 댓글을 남겼습니다.',
    clubName: 'CHAOS',
    clubId: 'chaos',
    time: '2시간 전',
  },
  {
    id: 'a2',
    type: 'like' as const,
    content: '게시글 "파이썬 vs 자바"에 좋아요를 눌렀습니다.',
    clubName: 'CHAOS',
    clubId: 'chaos',
    time: '1일 전',
  },
  {
    id: 'a3',
    type: 'post' as const,
    content: '자유게시판에 새 글을 작성했습니다.',
    clubName: '춤바람',
    clubId: 'chumbaram',
    time: '3일 전',
  },
  {
    id: 'a4',
    type: 'join' as const,
    content: '춤바람 동아리에 가입했습니다.',
    clubName: '춤바람',
    clubId: 'chumbaram',
    time: '2주일 전',
  },
];
