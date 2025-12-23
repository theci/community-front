# 🚀 Community Platform - 프로덕션급 프론트엔드 개발 가이드

## 📋 목차
- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [개발 환경 설정](#개발-환경-설정)
- [단계별 개발 계획](#단계별-개발-계획)
- [API 통신 가이드](#api-통신-가이드)
- [상태 관리 전략](#상태-관리-전략)
- [보안 가이드라인](#보안-가이드라인)
- [성능 최적화](#성능-최적화)
- [테스트 전략](#테스트-전략)
- [배포 가이드](#배포-가이드)

---

## 프로젝트 개요

### 시스템 아키텍처
```
┌─────────────────────────────────────────────────────┐
│                  프론트엔드 (Next.js)                │
│  ┌──────────────────────────────────────────────┐  │
│  │  Presentation Layer (Pages/Components)       │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  State Management (Zustand)                  │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  Data Fetching (SWR + Axios)                 │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                          ↕ REST API
┌─────────────────────────────────────────────────────┐
│              백엔드 (Spring Boot)                    │
│  DDD 기반 커뮤니티 플랫폼 API                        │
└─────────────────────────────────────────────────────┘
```

### 주요 기능 도메인
1. **사용자 (User)**: 인증, 회원가입, 프로필 관리
2. **콘텐츠 (Content)**: 게시글, 댓글, 카테고리, 태그
3. **참여 (Engagement)**: 좋아요, 스크랩, 스크랩 폴더
4. **포인트 (Reward)**: 포인트 시스템, 레벨, 랭킹
5. **알림 (Notification)**: 실시간 알림
6. **권한 (Authorization)**: 역할 기반 접근 제어
7. **중재 (Moderation)**: 신고, 제재 시스템

---

## 기술 스택

### 핵심 프레임워크
- **Next.js 15.x**: React 프레임워크 (App Router)
- **React 19.x**: UI 라이브러리
- **TypeScript 5.x**: 타입 안정성

### 상태 관리 & 데이터 페칭
- **Zustand**: 경량 상태 관리
- **SWR**: 데이터 페칭 및 캐싱
- **Axios**: HTTP 클라이언트

### UI/UX
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **Headless UI**: 접근성 기반 컴포넌트 (예정)
- **Framer Motion**: 애니메이션 (예정)

### 개발 도구
- **ESLint**: 코드 품질
- **Prettier**: 코드 포맷팅 (예정)
- **Husky**: Git hooks (예정)

### 배포 & 인프라
- **Docker**: 컨테이너화
- **Docker Compose**: 멀티 컨테이너 오케스트레이션

---

## 프로젝트 구조

```
test/frontend/
├── app/                        # Next.js App Router
│   ├── (auth)/                # 인증 관련 페이지 그룹
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (main)/                # 메인 페이지 그룹
│   │   ├── posts/
│   │   │   ├── page.tsx      # 게시글 목록
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx  # 게시글 상세
│   │   │   └── create/
│   │   │       └── page.tsx  # 게시글 작성
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── ranking/
│   │       └── page.tsx
│   ├── layout.tsx             # 루트 레이아웃
│   ├── globals.css
│   └── page.tsx               # 홈페이지
│
├── components/                 # 재사용 가능한 컴포넌트
│   ├── ui/                    # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── layout/                # 레이아웃 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── features/              # 기능별 컴포넌트
│   │   ├── post/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx
│   │   │   └── PostForm.tsx
│   │   ├── comment/
│   │   │   ├── CommentList.tsx
│   │   │   └── CommentForm.tsx
│   │   └── user/
│   │       ├── UserProfile.tsx
│   │       └── UserAvatar.tsx
│   └── shared/                # 공유 컴포넌트
│       ├── Loading.tsx
│       └── ErrorBoundary.tsx
│
├── lib/                       # 유틸리티 및 헬퍼
│   ├── api.ts                # Axios 인스턴스 설정
│   ├── hooks/                # 커스텀 훅
│   │   ├── useAuth.ts
│   │   ├── usePosts.ts
│   │   └── useComments.ts
│   ├── store/                # Zustand 스토어
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   ├── types/                # TypeScript 타입 정의
│   │   ├── user.ts
│   │   ├── post.ts
│   │   └── comment.ts
│   └── utils/                # 유틸리티 함수
│       ├── formatters.ts
│       └── validators.ts
│
├── public/                    # 정적 파일
│   ├── images/
│   └── icons/
│
├── .env.local                 # 환경 변수 (로컬)
├── .env.local.example         # 환경 변수 예제
├── next.config.ts             # Next.js 설정
├── tailwind.config.ts         # Tailwind CSS 설정
├── tsconfig.json              # TypeScript 설정
├── package.json
├── Dockerfile                 # Docker 설정
└── .dockerignore
```

---

## 개발 환경 설정

### 1. 로컬 개발 환경

#### 환경 변수 설정
```bash
# .env.local 파일 생성
cp .env.local.example .env.local

# 환경 변수 설정
NEXT_PUBLIC_API_URL=http://54.180.251.210:8080/api/v1
```

#### 의존성 설치 및 실행
```bash
cd test/frontend
npm install
npm run dev
```

브라우저에서 `http://54.180.251.210:3000` 접속

### 2. Docker 환경

#### 전체 스택 실행 (프론트엔드 + 백엔드)
```bash
# 프로젝트 루트에서 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d --build
```

#### 개별 서비스 실행
```bash
# 프론트엔드만 실행
docker-compose up community-frontend

# 백엔드만 실행
docker-compose up community-api
```

#### 서비스 확인
- 프론트엔드: http://54.180.251.210:3000
- 백엔드 API: http://54.180.251.210:8080
- H2 Console: http://54.180.251.210:8080/h2-console

---

## 단계별 개발 계획

### 📌 Phase 1: 기본 인프라 구축 (완료 ✅)
**목표**: 프로젝트 초기 설정 및 기본 구조 구축

#### 1.1 프로젝트 초기화
- [x] Next.js 프로젝트 생성
- [x] TypeScript 설정
- [x] Tailwind CSS 설정
- [x] 기본 디렉토리 구조 생성

#### 1.2 개발 환경 설정
- [x] Docker 설정 (Dockerfile, docker-compose.yml)
- [x] 환경 변수 설정
- [x] API 클라이언트 설정 (Axios)

#### 1.3 기본 레이아웃 구성
- [x] 루트 레이아웃 생성
- [x] 홈페이지 생성
- [x] 기본 글로벌 스타일 설정

---

### 📌 Phase 2: 인증 시스템 구현
**목표**: 사용자 인증 및 권한 관리 기능 구현

#### 2.1 인증 상태 관리
**예상 소요**: 1일

**작업 내용**:
```typescript
// lib/store/authStore.ts
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
```

**체크리스트**:
- [ ] Zustand 스토어 생성
- [ ] 로컬스토리지 연동
- [ ] 토큰 자동 갱신 로직
- [ ] 인증 상태 지속성 관리

#### 2.2 로그인 페이지
**예상 소요**: 1일

**작업 내용**:
```typescript
// app/(auth)/login/page.tsx
- 로그인 폼 UI
- 폼 유효성 검사
- API 연동 (POST /api/v1/auth/login)
- 에러 처리
- 로그인 성공 시 리다이렉션
```

**API 엔드포인트**:
- `POST /api/v1/auth/login`
  ```typescript
  Request: { email: string; password: string; }
  Response: { accessToken: string; refreshToken: string; user: User; }
  ```

**체크리스트**:
- [ ] 로그인 폼 컴포넌트
- [ ] 이메일/비밀번호 유효성 검사
- [ ] API 호출 및 에러 핸들링
- [ ] 토큰 저장 및 리다이렉션
- [ ] 로딩 상태 표시

#### 2.3 회원가입 페이지
**예상 소요**: 1일

**작업 내용**:
```typescript
// app/(auth)/register/page.tsx
- 회원가입 폼 UI
- 폼 유효성 검사 (이메일, 비밀번호 강도, 닉네임 중복)
- API 연동 (POST /api/v1/users/register)
- 약관 동의 체크박스
```

**API 엔드포인트**:
- `POST /api/v1/users/register`
  ```typescript
  Request: {
    email: string;
    password: string;
    username: string;
    nickname: string;
  }
  Response: { userId: number; email: string; username: string; }
  ```

**체크리스트**:
- [ ] 회원가입 폼 컴포넌트
- [ ] 실시간 유효성 검사
- [ ] 비밀번호 확인 입력
- [ ] 이메일 중복 확인
- [ ] 약관 동의 UI

#### 2.4 인증 미들웨어
**예상 소요**: 0.5일

**작업 내용**:
```typescript
// middleware.ts
- 보호된 라우트 접근 제어
- 토큰 검증
- 인증되지 않은 사용자 리다이렉션
```

**체크리스트**:
- [ ] Next.js 미들웨어 설정
- [ ] 보호된 라우트 정의
- [ ] 토큰 검증 로직
- [ ] 리다이렉트 처리

---

### 📌 Phase 3: 게시판 핵심 기능
**목표**: 게시글 CRUD 및 기본 기능 구현

#### 3.1 게시글 목록 페이지
**예상 소요**: 2일

**작업 내용**:
```typescript
// app/(main)/posts/page.tsx
- 게시글 목록 표시
- 페이지네이션
- 검색 기능
- 카테고리 필터링
- 정렬 옵션 (최신순, 인기순, 트렌딩)
```

**API 엔드포인트**:
- `GET /api/v1/posts?page=0&size=20&sort=createdAt,desc`
- `GET /api/v1/posts/search?keyword={keyword}`
- `GET /api/v1/posts/popular`
- `GET /api/v1/posts/trending`

**체크리스트**:
- [ ] 게시글 카드 컴포넌트
- [ ] 무한 스크롤 또는 페이지네이션
- [ ] 검색 UI 및 기능
- [ ] 카테고리 필터
- [ ] 로딩 스켈레톤
- [ ] 빈 상태 처리

#### 3.2 게시글 상세 페이지
**예상 소요**: 2일

**작업 내용**:
```typescript
// app/(main)/posts/[id]/page.tsx
- 게시글 상세 정보 표시
- 좋아요 버튼
- 스크랩 버튼
- 조회수 표시
- 작성자 정보
- 관련 게시글 추천
```

**API 엔드포인트**:
- `GET /api/v1/posts/{postId}`
- `POST /api/v1/posts/{postId}/like`
- `POST /api/v1/posts/{postId}/scrap`
- `GET /api/v1/posts/{postId}/similar`

**체크리스트**:
- [ ] 게시글 상세 레이아웃
- [ ] 마크다운 렌더링
- [ ] 좋아요 토글 기능
- [ ] 스크랩 토글 기능
- [ ] 공유 기능
- [ ] 신고 기능

#### 3.3 게시글 작성 페이지
**예상 소요**: 2일

**작업 내용**:
```typescript
// app/(main)/posts/create/page.tsx
- 제목 입력
- 마크다운 에디터
- 카테고리 선택
- 태그 입력
- 임시저장 기능
- 발행/미발행 선택
```

**API 엔드포인트**:
- `POST /api/v1/posts`
- `POST /api/v1/posts/{postId}/publish`
- `GET /api/v1/categories/tree`

**체크리스트**:
- [ ] 마크다운 에디터 통합
- [ ] 이미지 업로드 (예정)
- [ ] 카테고리 선택 드롭다운
- [ ] 태그 입력 (자동완성)
- [ ] 임시저장 기능
- [ ] 미리보기 기능
- [ ] 폼 유효성 검사

#### 3.4 게시글 수정/삭제
**예상 소요**: 1일

**작업 내용**:
```typescript
// app/(main)/posts/[id]/edit/page.tsx
- 기존 게시글 데이터 로드
- 수정 폼
- 삭제 확인 모달
```

**API 엔드포인트**:
- `PUT /api/v1/posts/{postId}`
- `DELETE /api/v1/posts/{postId}`

**체크리스트**:
- [ ] 게시글 데이터 로드
- [ ] 수정 권한 확인
- [ ] 수정 폼
- [ ] 삭제 확인 모달
- [ ] 낙관적 업데이트

---

### 📌 Phase 4: 댓글 시스템
**목표**: 댓글 및 대댓글 기능 구현

#### 4.1 댓글 목록 컴포넌트
**예상 소요**: 2일

**작업 내용**:
```typescript
// components/features/comment/CommentList.tsx
- 계층형 댓글 구조
- 댓글 목록 표시
- 대댓글 표시
- 페이지네이션 또는 무한 스크롤
```

**API 엔드포인트**:
- `GET /api/v1/comments/posts/{postId}`
- `GET /api/v1/comments/{parentCommentId}/replies`

**체크리스트**:
- [ ] 댓글 카드 컴포넌트
- [ ] 중첩 댓글 UI
- [ ] 댓글 접기/펼치기
- [ ] 댓글 정렬 (최신순, 오래된순)
- [ ] 로딩 상태

#### 4.2 댓글 작성/수정/삭제
**예상 소요**: 1.5일

**작업 내용**:
```typescript
// components/features/comment/CommentForm.tsx
- 댓글 작성 폼
- 대댓글 작성
- 댓글 수정
- 댓글 삭제
```

**API 엔드포인트**:
- `POST /api/v1/comments`
- `PUT /api/v1/comments/{commentId}`
- `DELETE /api/v1/comments/{commentId}`

**체크리스트**:
- [ ] 댓글 입력 폼
- [ ] 답글 버튼 및 폼
- [ ] 수정 모드 전환
- [ ] 삭제 확인 모달
- [ ] 낙관적 업데이트

---

### 📌 Phase 5: 사용자 프로필 및 포인트
**목표**: 사용자 프로필, 포인트 시스템 UI 구현

#### 5.1 프로필 페이지
**예상 소요**: 2일

**작업 내용**:
```typescript
// app/(main)/profile/page.tsx
- 사용자 정보 표시
- 작성한 게시글 목록
- 작성한 댓글 목록
- 좋아요한 게시글
- 스크랩한 게시글
- 포인트 및 레벨 정보
```

**API 엔드포인트**:
- `GET /api/v1/users/{userId}`
- `GET /api/v1/posts/author/{authorId}`
- `GET /api/v1/posts/likes/me`
- `GET /api/v1/posts/scraps/me`
- `GET /api/v1/points/me`

**체크리스트**:
- [ ] 프로필 헤더 (아바타, 이름, 레벨)
- [ ] 탭 네비게이션 (게시글, 댓글, 좋아요, 스크랩)
- [ ] 각 탭별 콘텐츠 표시
- [ ] 포인트 및 레벨 배지
- [ ] 프로필 수정 버튼

#### 5.2 포인트 및 랭킹 페이지
**예상 소요**: 1.5일

**작업 내용**:
```typescript
// app/(main)/ranking/page.tsx
- 포인트 랭킹 표시
- 레벨별 통계
- 내 포인트 정보
- 포인트 거래 내역
```

**API 엔드포인트**:
- `GET /api/v1/points/ranking`
- `GET /api/v1/points/statistics/levels`
- `GET /api/v1/points/me/transactions`

**체크리스트**:
- [ ] 랭킹 리스트
- [ ] 레벨별 통계 차트
- [ ] 내 포인트 대시보드
- [ ] 거래 내역 테이블

#### 5.3 스크랩 폴더 관리
**예상 소요**: 1.5일

**작업 내용**:
```typescript
// app/(main)/scraps/page.tsx
- 스크랩 폴더 목록
- 폴더별 스크랩 게시글
- 폴더 생성/수정/삭제
- 스크랩 폴더 이동
```

**API 엔드포인트**:
- `GET /api/v1/scrap-folders/me`
- `POST /api/v1/scrap-folders`
- `PUT /api/v1/scrap-folders/{folderId}`
- `DELETE /api/v1/scrap-folders/{folderId}`
- `GET /api/v1/posts/scrap-folders/{folderId}/scraps`

**체크리스트**:
- [ ] 폴더 사이드바
- [ ] 폴더 생성 모달
- [ ] 폴더 수정/삭제 기능
- [ ] 드래그 앤 드롭으로 이동
- [ ] 스크랩 검색

---

### 📌 Phase 6: 레이아웃 및 내비게이션
**목표**: 전역 레이아웃 및 네비게이션 구현

#### 6.1 헤더 컴포넌트
**예상 소요**: 1일

**작업 내용**:
```typescript
// components/layout/Header.tsx
- 로고
- 메인 네비게이션
- 검색바
- 사용자 메뉴 (로그인/로그아웃, 프로필, 알림)
- 반응형 모바일 메뉴
```

**체크리스트**:
- [ ] 헤더 레이아웃
- [ ] 네비게이션 링크
- [ ] 검색 입력
- [ ] 사용자 드롭다운
- [ ] 모바일 햄버거 메뉴
- [ ] 알림 아이콘 (예정)

#### 6.2 사이드바 및 푸터
**예상 소요**: 1일

**작업 내용**:
```typescript
// components/layout/Sidebar.tsx
- 카테고리 목록
- 인기 태그
- 추천 게시글

// components/layout/Footer.tsx
- 링크 (이용약관, 개인정보처리방침)
- 저작권 정보
```

**체크리스트**:
- [ ] 사이드바 레이아웃
- [ ] 카테고리 트리
- [ ] 태그 클라우드
- [ ] 푸터 레이아웃

---

### 📌 Phase 7: UI 컴포넌트 라이브러리
**목표**: 재사용 가능한 UI 컴포넌트 구축

#### 7.1 기본 UI 컴포넌트
**예상 소요**: 2일

**작업 내용**:
```typescript
// components/ui/
- Button.tsx: 다양한 버튼 스타일
- Input.tsx: 텍스트 입력
- Textarea.tsx: 텍스트 영역
- Select.tsx: 드롭다운
- Checkbox.tsx: 체크박스
- Radio.tsx: 라디오 버튼
- Card.tsx: 카드 레이아웃
- Modal.tsx: 모달 다이얼로그
- Tooltip.tsx: 툴팁
- Badge.tsx: 배지
```

**체크리스트**:
- [ ] 각 컴포넌트 구현
- [ ] TypeScript Props 정의
- [ ] Tailwind CSS 스타일링
- [ ] 접근성 (a11y) 고려
- [ ] Storybook 문서화 (선택)

#### 7.2 폼 컴포넌트
**예상 소요**: 1일

**작업 내용**:
```typescript
// components/ui/form/
- FormField.tsx: 폼 필드 래퍼
- FormError.tsx: 에러 메시지
- FormLabel.tsx: 레이블
```

**체크리스트**:
- [ ] 폼 필드 컴포넌트
- [ ] 에러 표시
- [ ] 유효성 검사 통합

---

### 📌 Phase 8: 고급 기능
**목표**: 검색, 필터링, 알림 등 고급 기능 구현

#### 8.1 고급 검색
**예상 소요**: 2일

**작업 내용**:
```typescript
// app/(main)/search/page.tsx
- 통합 검색 페이지
- 필터 옵션 (카테고리, 태그, 날짜, 작성자)
- 검색 결과 하이라이팅
- 검색 기록
```

**API 엔드포인트**:
- `GET /api/v1/posts/search?keyword={keyword}&category={cat}&startDate={date}&endDate={date}`

**체크리스트**:
- [ ] 검색 입력 및 필터 UI
- [ ] 검색 결과 표시
- [ ] 하이라이팅
- [ ] 검색 기록 로컬스토리지 저장

#### 8.2 알림 시스템
**예상 소요**: 2일

**작업 내용**:
```typescript
// components/features/notification/
- NotificationBell.tsx: 알림 아이콘
- NotificationList.tsx: 알림 목록
- NotificationItem.tsx: 개별 알림
```

**API 엔드포인트**:
- `GET /api/v1/notifications/me`
- `PUT /api/v1/notifications/{notificationId}/read`
- `PUT /api/v1/notifications/read-all`

**체크리스트**:
- [ ] 알림 아이콘 및 배지
- [ ] 알림 드롭다운
- [ ] 알림 읽음 처리
- [ ] 실시간 알림 (WebSocket - 선택)

#### 8.3 다크 모드
**예상 소요**: 1일

**작업 내용**:
```typescript
// lib/store/themeStore.ts
- 테마 상태 관리
- 시스템 테마 감지
- 토글 기능
```

**체크리스트**:
- [ ] 테마 스토어
- [ ] CSS 변수 전환
- [ ] 테마 토글 버튼
- [ ] 로컬스토리지 저장

---

### 📌 Phase 9: 관리자 기능
**목표**: 관리자 페이지 및 중재 기능

#### 9.1 관리자 대시보드
**예상 소요**: 2일

**작업 내용**:
```typescript
// app/(admin)/admin/page.tsx
- 통계 대시보드
- 사용자 통계
- 게시글 통계
- 신고 처리 현황
```

**API 엔드포인트**:
- `GET /api/v1/admin/statistics`
- `GET /api/v1/roles/statistics`
- `GET /api/v1/points/statistics/total`

**체크리스트**:
- [ ] 관리자 접근 제어
- [ ] 통계 차트
- [ ] 주요 지표 카드

#### 9.2 신고 관리
**예상 소요**: 2일

**작업 내용**:
```typescript
// app/(admin)/admin/reports/page.tsx
- 신고 목록
- 신고 상세
- 신고 처리 (승인/거부)
- 사용자 제재
```

**API 엔드포인트**:
- `GET /api/v1/reports/pending`
- `PUT /api/v1/reports/{reportId}/process`
- `POST /api/v1/moderation/sanctions`

**체크리스트**:
- [ ] 신고 목록 테이블
- [ ] 신고 상세 모달
- [ ] 처리 액션 버튼
- [ ] 제재 기록

---

### 📌 Phase 10: 성능 최적화 및 테스트
**목표**: 성능 개선 및 테스트 코드 작성

#### 10.1 성능 최적화
**예상 소요**: 2일

**작업 내용**:
- 이미지 최적화 (Next.js Image)
- 코드 스플리팅
- 동적 임포트
- 캐싱 전략
- SEO 메타 태그

**체크리스트**:
- [ ] next/image 적용
- [ ] dynamic import 활용
- [ ] 번들 사이즈 분석
- [ ] Lighthouse 점수 개선
- [ ] 메타 태그 추가

#### 10.2 테스트 코드 작성
**예상 소요**: 3일

**작업 내용**:
```typescript
// __tests__/
- 단위 테스트 (Jest)
- 통합 테스트
- E2E 테스트 (Playwright - 선택)
```

**체크리스트**:
- [ ] Jest 설정
- [ ] React Testing Library
- [ ] 컴포넌트 테스트
- [ ] API 호출 모킹
- [ ] E2E 테스트 (선택)

---

### 📌 Phase 11: 배포 및 CI/CD
**목표**: 프로덕션 배포 준비

#### 11.1 프로덕션 빌드 최적화
**예상 소요**: 1일

**작업 내용**:
- 환경 변수 관리
- 빌드 최적화
- Docker 이미지 최적화

**체크리스트**:
- [ ] 프로덕션 환경 변수
- [ ] 빌드 스크립트
- [ ] Docker 멀티스테이지 빌드

#### 11.2 CI/CD 파이프라인
**예상 소요**: 1일

**작업 내용**:
- GitHub Actions 설정
- 자동 빌드 및 테스트
- 자동 배포

**체크리스트**:
- [ ] CI workflow
- [ ] CD workflow
- [ ] 환경별 배포

---

## API 통신 가이드

### Axios 인스턴스 설정

```typescript
// lib/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://54.180.251.210:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### API 서비스 예제

```typescript
// lib/services/postService.ts
import { apiClient } from '../api';
import type { Post, PostCreateRequest, PostListResponse } from '../types/post';

export const postService = {
  // 게시글 목록 조회
  getPosts: async (page = 0, size = 20) => {
    const response = await apiClient.get<PostListResponse>(
      `/posts?page=${page}&size=${size}&sort=createdAt,desc`
    );
    return response.data;
  },

  // 게시글 상세 조회
  getPost: async (postId: number) => {
    const response = await apiClient.get<Post>(`/posts/${postId}`);
    return response.data;
  },

  // 게시글 작성
  createPost: async (data: PostCreateRequest) => {
    const response = await apiClient.post<Post>('/posts', data);
    return response.data;
  },

  // 게시글 수정
  updatePost: async (postId: number, data: PostCreateRequest) => {
    const response = await apiClient.put<Post>(`/posts/${postId}`, data);
    return response.data;
  },

  // 게시글 삭제
  deletePost: async (postId: number) => {
    await apiClient.delete(`/posts/${postId}`);
  },

  // 게시글 좋아요 토글
  toggleLike: async (postId: number) => {
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response.data;
  },
};
```

### SWR 훅 예제

```typescript
// lib/hooks/usePosts.ts
import useSWR from 'swr';
import { postService } from '../services/postService';

export function usePosts(page = 0, size = 20) {
  const { data, error, isLoading, mutate } = useSWR(
    `/posts?page=${page}&size=${size}`,
    () => postService.getPosts(page, size),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    posts: data?.content || [],
    totalPages: data?.totalPages || 0,
    isLoading,
    isError: error,
    mutate,
  };
}

export function usePost(postId: number) {
  const { data, error, isLoading, mutate } = useSWR(
    postId ? `/posts/${postId}` : null,
    () => postService.getPost(postId)
  );

  return {
    post: data,
    isLoading,
    isError: error,
    mutate,
  };
}
```

---

## 상태 관리 전략

### Zustand 스토어 예제

```typescript
// lib/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import type { User, LoginRequest, RegisterRequest } from '../types/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);

          set({
            user: response.user,
            accessToken: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || '로그인에 실패했습니다.',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await authService.register(data);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || '회원가입에 실패했습니다.',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      setUser: (user) => set({ user }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### UI 상태 관리

```typescript
// lib/store/uiStore.ts
import { create } from 'zustand';

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  modalOpen: boolean;

  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'system',
  sidebarOpen: true,
  modalOpen: false,

  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
}));
```

---

## 보안 가이드라인

### 1. XSS 방지
- 사용자 입력 sanitize
- `dangerouslySetInnerHTML` 사용 주의
- CSP (Content Security Policy) 설정

```typescript
// lib/utils/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  });
}
```

### 2. CSRF 방지
- SameSite 쿠키 설정
- CSRF 토큰 사용 (백엔드에서 처리)

### 3. 인증 토큰 관리
- Access Token: 메모리 또는 httpOnly 쿠키
- Refresh Token: httpOnly 쿠키 (권장)
- 토큰 만료 처리

### 4. 환경 변수 보호
```bash
# .env.local (절대 커밋하지 않음)
NEXT_PUBLIC_API_URL=http://54.180.251.210:8080/api/v1

# 민감 정보는 NEXT_PUBLIC_ 접두사 사용 금지
SECRET_KEY=xxx  # 서버 사이드에서만 접근 가능
```

---

## 성능 최적화

### 1. 이미지 최적화
```typescript
import Image from 'next/image';

<Image
  src="/images/profile.jpg"
  alt="Profile"
  width={200}
  height={200}
  priority={false}
  loading="lazy"
/>
```

### 2. 코드 스플리팅
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
```

### 3. 메모이제이션
```typescript
import { memo, useMemo, useCallback } from 'react';

const PostCard = memo(({ post }: { post: Post }) => {
  const formattedDate = useMemo(
    () => formatDate(post.createdAt),
    [post.createdAt]
  );

  const handleLike = useCallback(() => {
    toggleLike(post.id);
  }, [post.id]);

  return <div>...</div>;
});
```

### 4. SWR 캐싱
```typescript
import useSWR from 'swr';

// 전역 설정
<SWRConfig
  value={{
    refreshInterval: 3000,
    dedupingInterval: 2000,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  }}
>
  <App />
</SWRConfig>
```

---

## 테스트 전략

### 1. 단위 테스트 (Jest + React Testing Library)

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 2. API 모킹 (MSW)

```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/v1/posts', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        content: [
          { id: 1, title: 'Test Post', content: 'Test Content' },
        ],
        totalPages: 1,
      })
    );
  }),
];
```

### 3. E2E 테스트 (Playwright - 선택)

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('should login successfully', async ({ page }) => {
  await page.goto('http://54.180.251.210:3000/login');

  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('http://54.180.251.210:3000/');
});
```

---

## 배포 가이드

### 1. Docker 빌드 및 실행

```bash
# 프론트엔드만 빌드
docker build -t community-frontend ./test/frontend

# 프론트엔드 실행
docker run -p 3000:3000 community-frontend

# 전체 스택 실행
docker-compose up --build
```

### 2. 환경별 설정

#### 개발 환경
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://54.180.251.210:8080/api/v1
```

#### 프로덕션 환경
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

### 3. 헬스 체크

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}
```

---

## 개발 워크플로우

### 1. 브랜치 전략
```
main         - 프로덕션 배포
develop      - 개발 통합
feature/*    - 기능 개발
bugfix/*     - 버그 수정
hotfix/*     - 긴급 수정
```

### 2. 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드, 설정 변경
```

### 3. 코드 리뷰 체크리스트
- [ ] TypeScript 타입 정의가 올바른가?
- [ ] 에러 처리가 적절한가?
- [ ] 로딩 상태가 표시되는가?
- [ ] 접근성이 고려되었는가?
- [ ] 성능 이슈가 없는가?
- [ ] 보안 취약점이 없는가?

---

## 참고 자료

### 공식 문서
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [SWR](https://swr.vercel.app)
- [Zustand](https://docs.pmnd.rs/zustand)

### 백엔드 API 문서
- `/home/ec2-user/TEST/DDD2/DOCKER_TEST_GUIDE.md`: 백엔드 API 상세 가이드

### 개발 도구
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools) (Zustand 호환)

---

## 진행 상황 추적

### 완료된 항목
- [x] Phase 1: 기본 인프라 구축

### 현재 진행 중
- [ ] Phase 2: 인증 시스템 구현

### 예정된 작업
- [ ] Phase 3: 게시판 핵심 기능
- [ ] Phase 4: 댓글 시스템
- [ ] Phase 5: 사용자 프로필 및 포인트
- [ ] Phase 6: 레이아웃 및 내비게이션
- [ ] Phase 7: UI 컴포넌트 라이브러리
- [ ] Phase 8: 고급 기능
- [ ] Phase 9: 관리자 기능
- [ ] Phase 10: 성능 최적화 및 테스트
- [ ] Phase 11: 배포 및 CI/CD

---

## 문제 해결 가이드

### 자주 발생하는 이슈

#### 1. CORS 에러
**문제**: 프론트엔드에서 백엔드 API 호출 시 CORS 에러 발생

**해결**:
```typescript
// next.config.ts
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://community-api:8080/api/:path*',
    },
  ];
}
```

#### 2. 토큰 갱신 실패
**문제**: Access Token 만료 후 갱신 실패

**해결**: Axios interceptor에서 재시도 로직 확인

#### 3. Hydration 에러
**문제**: 서버와 클라이언트 렌더링 불일치

**해결**:
```typescript
// 클라이언트에서만 렌더링
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;
```

---

## 마무리

이 가이드는 프로덕션급 커뮤니티 플랫폼 프론트엔드 개발을 위한 포괄적인 로드맵입니다. 각 단계를 순차적으로 진행하면서 필요에 따라 조정하고 확장하세요.

**개발 순서 권장사항**:
1. Phase 1-2: 기본 인프라 및 인증 (1주)
2. Phase 3-4: 게시판 및 댓글 (2주)
3. Phase 5-6: 프로필 및 레이아웃 (1.5주)
4. Phase 7-8: UI 컴포넌트 및 고급 기능 (2주)
5. Phase 9-11: 관리자, 최적화, 배포 (1.5주)

**총 예상 기간**: 약 8주 (1-2명 개발자 기준)

행운을 빕니다! 🚀
