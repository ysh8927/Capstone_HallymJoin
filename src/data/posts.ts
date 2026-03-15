import { Post } from '@/types';

export const POSTS: Post[] = [
  // ── CHAOS (코딩) ───────────────────────────────────
  {
    id: 'chaos-1',
    clubId: 'chaos',
    category: 'notice',
    title: '2025년 1학기 CHAOS 신입 부원 모집 안내',
    body: `<p>안녕하세요, CHAOS 동아리입니다.</p>
<div class="notice-box">📍 면접 일시: 3월 20일(목) 오후 5시 | IT관 304호</div>
<p>올해도 함께 성장할 새 부원을 모집합니다. 전공 무관, 코딩 경험 없어도 지원 가능합니다.</p>
<p><strong>지원 방법:</strong> 구글폼 작성 → 서류 검토 → 면접</p>`,
    author: '김태윤',
    authorRole: '회장',
    authorGrade: '3학년',
    authorColor: '#0F172A',
    date: '2025.03.10',
    views: 312,
    likes: 24,
    isPinned: true,
    hasImage: false,
    comments: [
      { id: 'c1', author: '이수민', authorColor: '#6366F1', text: '비전공자도 지원 가능한가요?', time: '2일 전', likes: 2 },
      { id: 'c2', author: '김태윤', authorColor: '#0F172A', authorRole: '회장', text: '네, 전공 무관입니다! 열정만 있으면 OK 😊', time: '2일 전', likes: 5 },
    ],
  },
  {
    id: 'chaos-2',
    clubId: 'chaos',
    category: 'free',
    title: '이번 주 알고리즘 스터디 후기 — BFS/DFS',
    body: `<p>오늘 BFS/DFS 스터디 진짜 알찼어요! 특히 미로찾기 문제 풀면서 이해가 확 됐습니다 🙌</p>
<p>다음 주는 동적 프로그래밍 예정이에요. 예제 문제 풀어오면 더 수월할 것 같습니다.</p>`,
    author: '박준혁',
    authorRole: '부장',
    authorGrade: '2학년',
    authorColor: '#6366F1',
    date: '2025.03.13',
    views: 88,
    likes: 11,
    isPinned: false,
    hasImage: false,
    comments: [
      { id: 'c3', author: '최서연', authorColor: '#EC4899', text: '저도 드디어 BFS 이해했어요ㅠㅠ 감사합니다', time: '1일 전', likes: 3 },
    ],
  },
  {
    id: 'chaos-3',
    clubId: 'chaos',
    category: 'qna',
    title: '파이썬 vs 자바 — 알고리즘 풀 때 뭐가 유리한가요?',
    body: `<p>안녕하세요! 이번에 새로 들어온 신입입니다. 알고리즘 공부를 시작하려는데, 어떤 언어로 시작하는 게 좋을까요?</p>`,
    author: '신나연',
    authorRole: '신입',
    authorGrade: '1학년',
    authorColor: '#F59E0B',
    date: '2025.03.12',
    views: 64,
    likes: 4,
    isPinned: false,
    hasImage: false,
    comments: [
      { id: 'c4', author: '김태윤', authorColor: '#0F172A', authorRole: '회장', text: '입문은 파이썬 추천드려요. 문법이 간결해서 알고리즘 로직에 집중하기 좋습니다!', time: '1일 전', likes: 8 },
    ],
  },

  // ── 홀로그램 (학술) ───────────────────────────────
  {
    id: 'hologram-1',
    clubId: 'hologram',
    category: 'notice',
    title: '2025 AR/VR 기초 스터디 모집',
    body: `<p>안녕하세요, 홀로그램 동아리입니다!</p>
<div class="notice-box">📍 첫 모임: 3월 18일(화) 오후 5시 | IT관 XR 실습실</div>
<p>이번 학기 AR·VR 기초 스터디를 새로 시작합니다. 관련 경험이 없어도 괜찮습니다!</p>`,
    author: '박시온',
    authorRole: '회장',
    authorGrade: '3학년',
    authorColor: '#06B6D4',
    date: '2025.03.11',
    views: 143,
    likes: 21,
    isPinned: true,
    hasImage: false,
    comments: [
      { id: 'c-holo1', author: '이준하', authorColor: '#8B5CF6', text: '꼭 참여하고 싶어요! 구글폼 링크 있나요?', time: '1일 전', likes: 3 },
      { id: 'c-holo2', author: '박시온', authorColor: '#06B6D4', authorRole: '회장', text: '공지 채널에 올려뒀어요 😊', time: '1일 전', likes: 2 },
    ],
  },

  // ── 한빛사진회 ─────────────────────────────────────
  {
    id: 'photo-1',
    clubId: 'hanbitsajinhoe',
    category: 'notice',
    title: '3월 정기 출사 — 소양강 방면',
    body: `<p>이번 달 정기 출사 일정 안내드립니다.</p>
<div class="notice-box">📍 3월 22일(토) 오전 9시 | 학교 정문 집합</div>
<p>소양강 댐 방면으로 출사 예정입니다. 봄 풍경을 담아보세요 🌸</p>`,
    author: '최준호',
    authorRole: '회장',
    authorGrade: '3학년',
    authorColor: '#0EA5E9',
    date: '2025.03.11',
    views: 156,
    likes: 18,
    isPinned: true,
    hasImage: false,
    comments: [
      { id: 'c5', author: '김지수', authorColor: '#F472B6', text: '너무 기대돼요!!', time: '2시간 전', likes: 2 },
    ],
  },
  {
    id: 'photo-2',
    clubId: 'hanbitsajinhoe',
    category: 'photo',
    title: '🌸 2월 겨울 출사 사진 모음',
    body: `<p>지난달 남이섬 출사 사진입니다. 눈 내린 남이섬 정말 아름다웠어요!</p>`,
    author: '이하린',
    authorRole: '부장',
    authorGrade: '2학년',
    authorColor: '#8B5CF6',
    date: '2025.03.05',
    views: 234,
    likes: 41,
    isPinned: false,
    hasImage: true,
    comments: [
      { id: 'c6', author: '최준호', authorColor: '#0EA5E9', authorRole: '회장', text: '정말 잘 찍으셨네요 👍', time: '3일 전', likes: 5 },
      { id: 'c7', author: '박민재', authorColor: '#F59E0B', text: '구도가 정말 좋아요!', time: '3일 전', likes: 3 },
    ],
  },

  // ── 춤바람 ──────────────────────────────────────────
  {
    id: 'chumbaram-1',
    clubId: 'chumbaram',
    category: 'notice',
    title: '🎉 2025 봄 정기 공연 — 날짜 확정!',
    body: `<p>안녕하세요, 춤바람입니다!</p>
<div class="notice-box">📅 4월 18일(금) 오후 7시 | 학생회관 대강당</div>
<p>이번 공연 주제는 <strong>"봄, 그 시작"</strong>입니다. 많은 관심과 응원 부탁드립니다 💃</p>`,
    author: '서예린',
    authorRole: '회장',
    authorGrade: '3학년',
    authorColor: '#F43F5E',
    date: '2025.03.10',
    views: 423,
    likes: 67,
    isPinned: true,
    hasImage: false,
    comments: [
      { id: 'c8', author: '김다은', authorColor: '#8B5CF6', text: '꼭 갈게요!!!! 💖', time: '1일 전', likes: 7 },
      { id: 'c9', author: '이재현', authorColor: '#10B981', text: '응원합니다 화이팅!!', time: '1일 전', likes: 4 },
    ],
  },
  {
    id: 'chumbaram-2',
    clubId: 'chumbaram',
    category: 'photo',
    title: '📸 지난 공연 무대 사진 공유!',
    body: `<p>지난 학기 정기 공연 사진들이에요. 다들 정말 열심히 했죠! 다음 공연도 기대해주세요 🌟</p>`,
    author: '박소현',
    authorRole: '부장',
    authorGrade: '2학년',
    authorColor: '#6366F1',
    date: '2025.03.08',
    views: 318,
    likes: 55,
    isPinned: false,
    hasImage: true,
    comments: [
      { id: 'c10', author: '서예린', authorColor: '#F43F5E', authorRole: '회장', text: '다들 빛났어요 ✨', time: '4일 전', likes: 9 },
    ],
  },

  // ── GIVE (봉사) ──────────────────────────────────────
  {
    id: 'give-1',
    clubId: 'give',
    category: 'notice',
    title: '3월 재능기부 봉사 모집 — 학습 지원 봉사',
    body: `<p>이번 달 재능기부 봉사 활동을 안내합니다.</p>
<div class="notice-box">📍 3월 29일(토) 오전 10시 | 춘천시 지역아동센터</div>
<p>초등학생 학습 지원 봉사입니다. 교육 경험 없어도 참여 가능하며 사전 교육을 제공합니다.</p>`,
    author: '김수아',
    authorRole: '회장',
    authorGrade: '3학년',
    authorColor: '#22C55E',
    date: '2025.03.12',
    views: 118,
    likes: 17,
    isPinned: true,
    hasImage: false,
    comments: [
      { id: 'c-give1', author: '이도윤', authorColor: '#10B981', text: '신청했어요! 기대됩니다 😊', time: '2일 전', likes: 4 },
    ],
  },

  // ── CODA (락밴드) ────────────────────────────────────
  {
    id: 'coda-1',
    clubId: 'coda',
    category: 'notice',
    title: '2025 봄 정기 공연 합주 일정',
    body: `<p>4월 공연을 위한 합주 일정입니다. 모든 파트 필참입니다.</p>
<div class="notice-box">📍 매주 화요일 + 금요일 오후 6시 | 밴드 연습실</div>
<p>세트리스트는 공지 채널을 확인해주세요.</p>`,
    author: '박성진',
    authorRole: '회장',
    authorGrade: '4학년',
    authorColor: '#7C3AED',
    date: '2025.03.11',
    views: 134,
    likes: 19,
    isPinned: true,
    hasImage: false,
    comments: [
      { id: 'c13', author: '이민준', authorColor: '#EF4444', text: '기타 파트 준비 완료입니다!', time: '1일 전', likes: 3 },
    ],
  },

  // ── 유니콘 (치어리딩) ──────────────────────────────────
  {
    id: 'unicorn-1',
    clubId: 'unicorn',
    category: 'notice',
    title: '2025 전국 대학 치어리딩 대회 참가 안내',
    body: `<p>올해도 전국 대학 치어리딩 대회에 참가합니다!</p>
<div class="notice-box">📅 5월 10일(토) | 서울 올림픽공원</div>
<p>참가 의향 있는 부원은 댓글로 의사 표시 해주세요. 연습 강도가 높아질 예정입니다 💪</p>`,
    author: '강소희',
    authorRole: '회장',
    authorGrade: '2학년',
    authorColor: '#8B5CF6',
    date: '2025.03.12',
    views: 201,
    likes: 38,
    isPinned: true,
    hasImage: false,
    comments: [
      { id: 'c14', author: '이유미', authorColor: '#F43F5E', text: '저 참가할게요!!! 💪', time: '1일 전', likes: 6 },
      { id: 'c15', author: '박채연', authorColor: '#EC4899', text: '저도요!! 🦄', time: '1일 전', likes: 5 },
    ],
  },
];

/** 특정 동아리의 게시글만 필터링 */
export function getPostsByClub(clubId: string): Post[] {
  return POSTS.filter((p) => p.clubId === clubId);
}

/** 고정 게시글 */
export function getPinnedPost(clubId: string): Post | undefined {
  return POSTS.find((p) => p.clubId === clubId && p.isPinned);
}
