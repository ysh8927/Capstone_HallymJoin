// ─── 동아리 분과 ─────────────────────────────────────────────
export type ClubCategory =
  | 'academic'     // 학술분과
  | 'hobby'        // 취미예술분과
  | 'performance'  // 공연분과
  | 'sports'       // 체육분과
  | 'volunteer'    // 봉사분과
  | 'religion'     // 종교분과
  | 'etc';         // 기타

// ─── 동아리 ──────────────────────────────────────────────────
export interface Club {
  id: string;
  name: string;
  category: ClubCategory;
  description: string;
  shortDesc: string;
  emoji: string;
  color: string;           // gradient start
  color2: string;          // gradient end
  memberCount: number;
  maxMembers: number;
  isRecruiting: boolean;
  meetingDay: string;
  meetingPlace: string;
  establishedYear: number;
  tags: string[];
  president: string;
  likes: number;
  postCount: number;
  snsUrl?: string;
}

// ─── 게시글 카테고리 ─────────────────────────────────────────
export type PostCategory = 'notice' | 'free' | 'photo' | 'qna';

// ─── 게시글 ──────────────────────────────────────────────────
export interface Post {
  id: string;
  clubId: string;
  category: PostCategory;
  title: string;
  body: string;
  author: string;
  authorRole: string;
  authorGrade: string;
  authorColor: string;
  date: string;
  views: number;
  likes: number;
  isPinned: boolean;
  hasImage: boolean;
  comments: Comment[];
}

// ─── 댓글 ────────────────────────────────────────────────────
export interface Comment {
  id: string;
  author: string;
  authorColor: string;
  authorRole?: string;
  text: string;
  time: string;
  likes: number;
  reply?: Comment;
}

// ─── 유저 ────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  studentId: string;
  grade: string;
  department: string;
  email: string;
  joinedClubs: string[];
  role: 'student' | 'admin';
}

// ─── 알림 ────────────────────────────────────────────────────
export type NotifType = 'comment' | 'like' | 'notice' | 'join' | 'reply' | 'JOIN_APPROVED';

export interface Notification {
  id: string;
  type: NotifType;
  message: string;
  time: string;
  isRead: boolean;
  postId?: string;
  clubId?: string;
}

// ─── UI 헬퍼 ─────────────────────────────────────────────────
export const CATEGORY_LABEL: Record<ClubCategory, string> = {
  academic:    '학술분과',
  hobby:       '취미예술분과',
  performance: '공연분과',
  sports:      '체육분과',
  volunteer:   '봉사분과',
  religion:    '종교분과',
  etc:         '기타',
};

export const CATEGORY_SHORT: Record<ClubCategory, string> = {
  academic:    '학술',
  hobby:       '취미예술',
  performance: '공연',
  sports:      '체육',
  volunteer:   '봉사',
  religion:    '종교',
  etc:         '기타',
};

export const POST_CATEGORY_LABEL: Record<PostCategory, string> = {
  notice: '📌 공지',
  free:   '💬 자유',
  photo:  '📷 사진',
  qna:    '❓ Q&A',
};
