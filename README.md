# 한림 클럽링크 (Hallym ClubLink)

> 한림대학교 동아리 탐색 및 소통 플랫폼 — 2025 캡스톤디자인

한림대학교 총동아리연합회([@hallym.chowol](https://www.instagram.com/hallym.chowol)) 공식 동아리 목록을 기반으로 제작한 동아리 플랫폼입니다.
학생들이 동아리를 쉽게 탐색하고, 게시판을 통해 소통하며, 가입 신청까지 한 곳에서 할 수 있도록 설계했습니다.

> **현재 상태**: 프론트엔드 구현 완료 / 백엔드 연동 예정

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript 5 |
| 스타일 | Tailwind CSS 4 |
| 아이콘 | lucide-react |
| 유틸리티 | clsx, tailwind-merge |
| 폰트 | Noto Sans KR, Noto Serif KR (Google Fonts) |

---

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

Node.js 18 이상 권장

---

## 프로젝트 구조

```
src/
├── app/
│   ├── (auth)/                          # 인증 레이아웃 그룹
│   │   ├── layout.tsx                   # 미니멀 인증 레이아웃
│   │   ├── login/page.tsx               # 로그인
│   │   ├── signup/page.tsx              # 회원가입 (3단계)
│   │   └── forgot-password/page.tsx     # 비밀번호 찾기
│   ├── (main)/                          # 메인 레이아웃 그룹
│   │   ├── layout.tsx                   # Header + Footer 레이아웃
│   │   ├── home/page.tsx                # 홈 랜딩 페이지
│   │   ├── clubs/
│   │   │   ├── page.tsx                 # 동아리 목록 · 검색 · 필터
│   │   │   └── [id]/
│   │   │       ├── page.tsx             # 동아리 상세 (소개 + 게시판)
│   │   │       └── board/write/page.tsx # 게시글 작성
│   │   ├── federation/page.tsx          # 총동아리연합회
│   │   ├── my-clubs/page.tsx            # 내 동아리 대시보드
│   │   └── profile/page.tsx             # 프로필 설정
│   ├── layout.tsx                       # 루트 레이아웃 (폰트 · 테마 init)
│   ├── not-found.tsx                    # 커스텀 404 페이지
│   └── globals.css                      # 디자인 시스템 (CSS 변수 · 애니메이션)
├── components/
│   ├── layout/
│   │   ├── Header.tsx                   # 스티키 헤더
│   │   └── Footer.tsx
│   ├── clubs/
│   │   ├── ClubCard.tsx                 # 동아리 카드 컴포넌트
│   │   └── ClubDetailTabs.tsx           # 소개 / 게시판 탭
│   ├── board/
│   │   ├── ClubBoard.tsx                # 게시판 (목록 · 상세 · 댓글)
│   │   └── WriteForm.tsx                # 게시글 작성 폼
│   └── ui/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── ThemeToggle.tsx              # 다크모드 토글
│       ├── SearchModal.tsx              # ⌘K 글로벌 검색
│       └── NotificationPanel.tsx       # 알림 드롭다운
├── data/
│   ├── clubs.ts                         # 중앙동아리 49개 mock 데이터
│   ├── posts.ts                         # 게시글 mock 데이터
│   └── mockUser.ts                      # 로그인 유저 · 알림 · 활동 mock 데이터
├── types/index.ts                       # 공통 TypeScript 타입 정의
└── lib/utils.ts                         # cn() · formatCount() · categoryColor()
```

---

## 페이지 목록

| 경로 | 설명 |
|------|------|
| `/home` | 홈 랜딩 — 통계, 모집 중 동아리, 분과 탐색 |
| `/clubs` | 전체 동아리 목록 — 검색, 분과 필터, 정렬 |
| `/clubs/[id]` | 동아리 상세 — 소개 탭 + 게시판 탭 (49개 SSG) |
| `/clubs/[id]/board/write` | 게시글 작성 (49개 SSG) |
| `/federation` | 총동아리연합회 — 공지, 분과, 연간행사 |
| `/my-clubs` | 내 동아리 대시보드 — 가입/관심 동아리, 활동 피드 |
| `/profile` | 프로필 설정 — 정보 편집, 보안, 알림 설정 |
| `/login` | 로그인 |
| `/signup` | 회원가입 (3단계) |
| `/forgot-password` | 비밀번호 찾기 (3단계) |

---

## 주요 기능

### 동아리 탐색
- 49개 중앙동아리 전체 목록 (취미예술 · 학술 · 종교 · 봉사 · 공연 · 체육 6개 분과)
- 분과별 필터 · 모집 중 토글 · 이름/인기/인원순 정렬
- 실시간 텍스트 검색 + **⌘K 글로벌 검색 모달** (이름, 태그, 설명)

### 동아리 상세
- 동아리별 고유 그라데이션 히어로 헤더
- **소개 탭**: 동아리 설명, 활동 정보, 태그, 임원 소개
- **게시판 탭**: 공지 고정 · 카테고리 필터(공지/자유/사진/Q&A) · 검색 · 댓글 · 좋아요
- 사이드바: 동아리 정보, 가입 신청 버튼, 비슷한 동아리 추천

### 게시글 작성
- `contentEditable` 기반 서식 편집기 (굵게 · 기울임 · 밑줄 · 목록 · 인용구)
- 파일/이미지 첨부 칩 UI, 글자 수 제한(3,000자)
- 공지 고정 토글 (임원 전용), 카테고리 선택

### 인증 UI
- **로그인**: 학번 입력 시 `@hallym.ac.kr` 자동 표시
- **회원가입**: 학번 입력 → 이메일 인증(6자리 코드) → 정보 입력 3단계, 비밀번호 강도 측정 바, 재발송 타이머
- **비밀번호 찾기**: 학번 → 코드 인증 → 새 비밀번호 3단계

### 내 동아리 / 프로필
- 가입 동아리 목록 · 관심 동아리 북마크 · 최근 활동 피드
- 프로필 편집 / 비밀번호 변경 / 알림 수신 설정 3탭

### 헤더 & UX
- **다크모드**: 시스템 설정 자동 감지 + 수동 토글 + `localStorage` 저장, 화면 깜빡임 방지 init script
- **알림 패널**: 벨 아이콘 드롭다운, 타입별 아이콘, 읽음/삭제 처리
- 활성 페이지 강조 내비게이션, 모바일 햄버거 메뉴
- `fadeUp` · `fadeIn` · `shimmer` 스켈레톤 애니메이션

### 총동아리연합회 페이지
- 6개 분과 소개 카드 (분과별 동아리 수 · 설명)
- 공지사항 목록 (고정 공지 구분)
- 연간 주요 행사 캘린더 (박람회 · 체육대회 · 축제 · 발표회)
- SNS(`@hallym.chowol`), 이메일, 위치 연락처

---

## 디자인 시스템

CSS 커스텀 프로퍼티 기반 라이트/다크 모드를 지원합니다.

```css
/* 라이트 */        /* 다크 (html.dark) */
--bg:   #ffffff     --bg:   #1F2937
--bg2:  #F9FAFB     --bg2:  #111827
--bg3:  #F3F4F6     --bg3:  #0F172A
--txt:  #111827     --txt:  #F9FAFB
--txt2: #6B7280     --txt2: #9CA3AF
--txt3: #9CA3AF     --txt3: #6B7280
--bdr:  rgba(0,0,0,0.08)    --bdr: rgba(255,255,255,0.08)
```

---

## 동아리 데이터

총동아리연합회 공식 목록 기준 **중앙동아리 49개** 수록

| 분과 | 수 | 동아리 |
|------|:--:|--------|
| 취미예술 | 9 | HDIY, IDENTITY, 단화, 영상틀, 천지, 클러치, 푸메토, 하얀도화지, 한빛사진회 |
| 학술 | 4 | CHAOS, 룩스, 시리어스, 홀로그램 |
| 종교 | 5 | JDM, CCC, IVF, 가톨릭학생회, 한림불회 |
| 봉사 | 4 | GIVE, RCY, 로타랙트, 한울회 |
| 공연 | 10 | CODA, 두레박, 봉현회, 수레바퀴, 엑스레이, 유니콘, 춤바람, 한림극회, 힙합PD, 일심무애 |
| 체육 | 17 | Tie-Break, FVI, Match Point, SKY, Who's Next, X-TRIC, 공굴리기, 데구르르, 레이서스, 사이다, 스네이크, 케미, 키커, 피닉스, 하이클리어, 한림FC, 해강박 |

> 과동아리(학과 동아리) 데이터는 추후 추가 예정입니다.

---

## 향후 개발 계획

### 백엔드 연동
- [ ] **NextAuth.js** — 학번 이메일(`학번@hallym.ac.kr`) 인증
- [ ] **Prisma + PostgreSQL** — 유저, 동아리, 게시글, 댓글, 알림 스키마
- [ ] **API 라우트** — `/api/auth/*`, `/api/posts`, `/api/clubs`, `/api/comments`
- [ ] **이미지 업로드** — Cloudinary 또는 S3 연동
- [ ] **실시간 알림** — Server-Sent Events

### 추가 기능
- [ ] 과동아리(학과 동아리) 데이터 추가
- [ ] 동아리 가입 신청 · 승인 플로우
- [ ] 모바일 앱 (React Native / Expo)
- [ ] Vercel 배포

---

## 팀 정보

- **소속**: 한림대학교 소프트웨어학부
- **과목**: 캡스톤디자인 2025
- **데이터 출처**: 한림대학교 총동아리연합회 [@hallym.chowol](https://www.instagram.com/hallym.chowol)
