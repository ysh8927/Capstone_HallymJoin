# 🎓 HallymJoin - 한림대학교 동아리 통합 플랫폼

한림대학교 학생들을 위한 동아리 탐색, 가입, 활동 관리 통합 플랫폼입니다.

## 📋 프로젝트 개요

- **개발 기간**: 2026.03 ~ 2026.06
- **팀원**: 3명
- **목적**: 한림대학교 동아리 정보 통합 및 학생-동아리 간 소통 개선

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 16 (App Router, React 19)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks

### Backend
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 7 (PrismaNeon Adapter)
- **Authentication**: NextAuth.js v5
- **API**: Next.js API Routes

### Deployment
- **Platform**: Vercel
- **Database Hosting**: Supabase (Asia-Pacific)

## ✅ 완료된 핵심 기능

### 1. 인증 시스템
- ✅ 학번 기반 회원가입 (한림대 학생 전용)
- ✅ 이메일 인증 (6자리 코드, 5분 유효)
- ✅ NextAuth.js 기반 로그인/로그아웃
- ✅ 세션 기반 인증 (미들웨어 보호)

### 2. 동아리 탐색
- ✅ 48개 동아리 데이터 (실제 한림대 동아리)
- ✅ 카테고리별 필터링 (학술, 문화예술, 봉사, 체육, 친목)
- ✅ 검색 기능
- ✅ 동아리 상세 정보 페이지

### 3. 동아리 가입 시스템
- ✅ 가입 신청 (DB 저장, PENDING 상태)
- ✅ 승인/거절 API 구현
- ✅ 알림 생성 (가입 승인/거절 시)

### 4. 게시판 시스템
- ✅ 게시글 작성/조회 (DB 연동)
- ✅ 댓글 작성 (DB 연동)
- ✅ 조회수 카운트
- ✅ 댓글 작성 시 알림 생성 (게시글 작성자에게)
- ✅ 고정 게시글 (isPinned)

### 5. 북마크 시스템
- ✅ 동아리 북마크 추가/삭제
- ✅ 내 동아리 페이지에서 북마크 목록 확인

### 6. 내 동아리 페이지
- ✅ 가입한 동아리 목록 (승인된 것만)
- ✅ 북마크한 동아리 목록
- ✅ 실제 DB 데이터 연동

### 7. 알림 시스템
- ✅ 알림 API 구현 (목록 조회, 읽음 처리)
- ✅ 댓글 작성 시 알림 생성
- ✅ 가입 승인/거절 시 알림 생성

## 🔄 목업 데이터에서 실제 DB로 대체 완료

| 기능 | 이전 (목업) | 현재 (DB) |
|------|------------|----------|
| 동아리 목록 | 하드코딩 | Prisma seed (48개) |
| 게시글/댓글 | POSTS 배열 | posts, comments 테이블 |
| 가입 신청 | 로컬 상태 | clubMembers 테이블 |
| 북마크 | 로컬 상태 | bookmarks 테이블 |
| 알림 | 미구현 | notifications 테이블 |
| 회원가입 | 목업 | users 테이블 + 이메일 인증 |

## 📊 데이터베이스 스키마

### 주요 테이블
- **User**: 사용자 정보
- **Club**: 동아리 정보
- **Post**: 게시글
- **Comment**: 댓글
- **ClubMember**: 동아리 멤버십 (가입 신청/승인)
- **Bookmark**: 북마크
- **Notification**: 알림

### 관계
- User ↔ ClubMember ↔ Club
- User → Post → Comment
- User → Bookmark → Club
- User → Notification

## 🚧 미구현 기능

### 1. 관리자 페이지
- ❌ 가입 신청 승인/거절 UI
- ❌ 회원 관리
- ❌ 게시글 관리

### 2. 프로필 시스템
- ❌ 프로필 편집 (현재 정적 데이터)
- ❌ 프로필 이미지 업로드
- ❌ 활동 통계

### 3. 알림 UI
- ❌ 알림 목록 표시
- ❌ 실시간 알림 (웹소켓)
- ❌ 읽지 않은 알림 배지

### 4. 게시판 고급 기능
- ❌ 게시글 수정/삭제
- ❌ 댓글 수정/삭제
- ❌ 좋아요 기능
- ❌ 이미지 업로드
- ❌ 페이지네이션

### 5. 동아리 관리
- ❌ 동아리 생성/수정 (현재 seed로만 추가 가능)
- ❌ 임원진 관리
- ❌ 활동 기록

### 6. 이메일 발송
- ❌ 실제 이메일 발송 (현재 콘솔 출력)
- ❌ SendGrid/Resend 연동

### 7. 검색 고도화
- ❌ 전체 검색 (게시글, 댓글 포함)
- ❌ 필터 조합

### 8. 총동아리연합회 페이지
- ❌ 공지사항 관리
- ❌ 대관 신청 시스템

## 📁 프로젝트 구조
src/
├── app/
│   ├── (auth)/            # 로그인, 회원가입
│   ├── (main)/            # 메인 페이지들
│   │   ├── clubs/         # 동아리 목록, 상세
│   │   ├── my-clubs/      # 내 동아리
│   │   ├── home/          # 홈
│   │   └── ...
│   └── api/               # API Routes
│       ├── auth/          # NextAuth
│       ├── posts/         # 게시글
│       ├── clubs/         # 동아리 (가입, 북마크)
│       ├── notifications/ # 알림
│       └── verify-email/  # 이메일 인증
├── components/            # 재사용 컴포넌트
├── lib/                   # 유틸리티 (prisma, auth)
├── prisma/                # DB 스키마, seed
└── types/                 # TypeScript 타입

## 🚀 로컬 실행 방법

### 1. 환경 설정

```bash
git clone https://github.com/ysh8927/Capstone_HallymJoin.git
cd Capstone_HallymJoin
npm install
```

### 2. 환경변수 설정 (.env)

```env
DATABASE_URL="your_supabase_pooler_url"
DIRECT_URL="your_supabase_direct_url"
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. 데이터베이스 초기화

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 접속

## 📝 알려진 이슈

1. **인코딩 문제**: 일부 파일에서 EUC-KR 인코딩 발생 (UTF-8로 재저장 필요)
2. **이메일 인증**: 실제 이메일 발송 미구현 (콘솔 출력)
3. **관리자 기능**: UI 없음 (API만 존재)
4. **알림**: 생성은 되지만 UI 미구현

## 🎯 향후 개선 계획

1. 관리자 페이지 구현
2. 알림 UI 및 실시간 알림
3. 프로필 시스템 완성
4. 게시판 고급 기능 (수정/삭제, 이미지 업로드)
5. 실제 이메일 발송 (SendGrid/Resend)
6. 검색 고도화
7. 반응형 디자인 개선
8. 성능 최적화 (이미지 최적화, 캐싱)

## 📄 라이센스

MIT License

## 👤 개발자

- GitHub: [@ysh8927](https://github.com/ysh8927)
- 한림대학교 소프트웨어학부
