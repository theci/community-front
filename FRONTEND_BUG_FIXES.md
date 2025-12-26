# Frontend 에러 수정 기록

Next.js 프로젝트에서 발생한 에러와 해결 방법을 정리한 문서입니다.

---

## 1. 게시글 작성 시 "사용자 정보를 불러올 수 없습니다" 에러

### 문제
- 로그인 후 게시글 작성 시 "사용자 정보를 불러올 수 없습니다" 에러 발생
- `user` 객체가 `null`로 나타남

### 원인
백엔드 API 응답 형식과 프론트엔드 파싱 불일치

**백엔드 실제 응답**:
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": { "id": 1, "email": "...", ... }
  }
}
```

**프론트엔드 코드**:
```typescript
// authService.ts (잘못된 코드)
const response = await apiClient.post('/auth/login', credentials);
return response.data; // { success, data, timestamp } 전체를 반환
```

이렇게 하면 `response.data`는 `{ success: true, data: {...} }` 전체이고,
실제 user 정보는 `response.data.data.user`에 있음

### 해결
`response.data.data`로 접근하도록 수정

```typescript
// lib/services/authService.ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data; // ✅ 올바른 접근
  },
};
```

### 학습 포인트
- API 응답 구조를 정확히 파악해야 함
- 타입스크립트 제네릭을 사용해 API 래핑 구조 표현
- 다른 서비스(`postService.ts`)의 패턴을 참고하면 도움됨

---

## 2. 작성한 게시글이 목록에 나타나지 않는 문제

### 문제
- 게시글 작성 후 상세 페이지는 정상 조회됨
- 하지만 게시글 목록(`/posts`)에는 나타나지 않음
- API 응답: `content: []`, `totalElements: 0`

### 원인
백엔드 API 구조 이해 부족

**백엔드 동작 방식**:
1. `POST /api/v1/posts` → 게시글 생성 (항상 **DRAFT** 상태)
2. `POST /api/v1/posts/{postId}/publish` → 게시글 발행 (DRAFT → **PUBLISHED**)
3. `GET /api/v1/posts` → **발행된 게시글만** 조회

**프론트엔드 잘못된 구현**:
```typescript
// 게시글 작성만 하고 publish API 호출 안 함
const createdPost = await postService.createPost(postData, user.id);
router.push(`/posts/${createdPost.id}`); // DRAFT 상태로 저장됨
```

프론트엔드가 `status: PUBLISHED`를 보내도, 백엔드가 이를 무시하고 DRAFT로 저장

### 해결
"발행" 버튼 클릭 시 publish API 자동 호출

```typescript
// app/(main)/posts/create/page.tsx
const createdPost = await postService.createPost(postData, user.id);

// ✅ 발행 상태일 경우, publish API 호출
if (status === PostStatus.PUBLISHED) {
  await postService.publishPost(createdPost.id, user.id);
  alert('게시글이 발행되었습니다.');
  router.push(`/posts/${createdPost.id}`);
}
```

### 추가 수정: API 응답 구조 불일치

**백엔드 실제 응답**:
```json
{
  "content": [...],
  "pageInfo": {
    "totalPages": 5,
    "totalElements": 100,
    "currentPage": 0
  }
}
```

**프론트엔드 잘못된 코드**:
```typescript
setTotalPages(response.totalPages); // ❌ undefined
```

**수정**:
```typescript
// lib/types/post.ts
export interface PostListResponse {
  content: Post[];
  pageInfo: PageInfo; // ✅ 페이지 정보를 객체로 분리
}

// app/(main)/posts/page.tsx
setTotalPages(response.pageInfo.totalPages); // ✅ 올바른 접근
```

### 학습 포인트
- 백엔드 API 명세를 정확히 이해해야 함
- 게시글 생성과 발행이 분리된 워크플로우
- API 응답 구조가 중첩되어 있을 때 타입 정의 중요

---

## 핵심 교훈

### 1. API 통신 디버깅 방법
```typescript
// 항상 API 응답을 로그로 확인
console.log('API Response:', response);
console.log('Data:', response.data);
```

### 2. 타입스크립트 활용
```typescript
// 제네릭으로 API 래핑 구조 표현
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// 사용 예시
const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login');
```

### 3. 기존 코드 참고
- 같은 프로젝트 내 다른 서비스 코드 확인
- `postService.ts`는 올바른 패턴 → `authService.ts` 수정 시 참고

### 4. curl로 백엔드 직접 테스트
```bash
# 게시글 목록이 비어있는지 확인
curl "http://54.180.251.210:8080/api/v1/posts?page=0&size=20"
```

---

---

## 3. ReactMarkdown className 에러

### 문제
- `react-markdown` 라이브러리에서 `className` prop 지원 중단
- 에러: "Unexpected `className` prop, remove it"

### 원인
`react-markdown` v9+ 버전에서 `className` prop이 제거됨

### 해결
부모 div에 스타일 적용

```typescript
// Before (에러)
<ReactMarkdown className="text-gray-800">
  {post.content}
</ReactMarkdown>

// After (수정)
<div className="prose prose-lg max-w-none text-gray-800">
  <ReactMarkdown>
    {post.content}
  </ReactMarkdown>
</div>
```

### 학습 포인트
- 라이브러리 업데이트 시 CHANGELOG 확인 필요
- 스타일은 wrapper div로 감싸서 적용

---

## 4. 좋아요/스크랩 상태 조회 시 500 에러

### 문제
- 게시글 상세 페이지에서 좋아요/스크랩 상태 조회 실패
- 에러: `Request failed with status code 500`

### 원인
백엔드 API가 `currentUserId` 쿼리 파라미터를 필수로 요구함

**백엔드 API**:
```
GET /api/v1/posts/{postId}/like/status?currentUserId={userId}
GET /api/v1/posts/{postId}/scrap/status?currentUserId={userId}
```

**프론트엔드 잘못된 코드**:
```typescript
// currentUserId 없이 호출
const status = await postService.getLikeStatus(postId);
```

### 해결
API 호출 시 `currentUserId` 쿼리 파라미터 추가

```typescript
// lib/services/postService.ts
getLikeStatus: async (postId: number, currentUserId?: number) => {
  const params = currentUserId ? { currentUserId } : {};
  const response = await apiClient.get(`/posts/${postId}/like/status`, { params });
  return response.data.data;
}

// app/(main)/posts/[id]/page.tsx
const loadLikeStatus = async () => {
  if (!user?.id) return; // 로그인하지 않은 경우 스킵
  const status = await postService.getLikeStatus(postId, user.id);
  setLiked(status.liked);
};
```

### 학습 포인트
- 백엔드 API 명세에서 필수 파라미터 확인
- axios에서 쿼리 파라미터는 `{ params }` 옵션으로 전달
- 로그인하지 않은 경우 early return으로 불필요한 API 호출 방지

---

## 5. 댓글 계층 구조 시각적 구분 부족

### 문제
- 댓글과 대댓글이 화면상으로 구분되지 않음
- 답글 레벨을 파악하기 어려움
- 깊은 중첩 시 가독성 저하

### 원인
CommentItem 컴포넌트에 depth 기반 스타일링 부재

### 해결
5단계 깊이까지 들여쓰기 및 시각적 차별화 구현

```typescript
// components/features/comment/CommentItem.tsx
interface CommentItemProps {
  depth?: number; // 댓글 깊이 추가
  // ...
}

// 최대 5단계까지 제한
const currentDepth = Math.min(depth, 5);
const nextDepth = Math.min(depth + 1, 5);

// depth별 배경색 차별화
const bgColorClass = currentDepth === 0
  ? 'bg-gray-50'      // 최상위
  : currentDepth === 1
  ? 'bg-blue-50'      // 1단계 답글
  : currentDepth === 2
  ? 'bg-green-50'     // 2단계 답글
  : currentDepth === 3
  ? 'bg-yellow-50'    // 3단계 답글
  : currentDepth === 4
  ? 'bg-purple-50'    // 4단계 답글
  : 'bg-pink-50';     // 5단계 답글

// 답글 표시
{currentDepth > 0 && (
  <>
    <span className="text-xs font-semibold text-blue-600">↳</span>
    <span className="text-xs px-1.5 py-0.5 bg-white rounded">
      답글 Lv.{currentDepth}
    </span>
  </>
)}

// 재귀적으로 depth 전달
<CommentItem
  comment={reply}
  depth={nextDepth}
  // ...
/>
```

### 학습 포인트
- 재귀 컴포넌트에서 깊이 추적 중요
- `Math.min()`으로 최대 깊이 제한
- Tailwind CSS 조건부 클래스 활용
- 시각적 계층 구조: 색상 + 아이콘 + 텍스트 조합

---

## 참고 파일
- `lib/services/authService.ts` - 인증 API 서비스
- `lib/store/authStore.ts` - Zustand 인증 상태 관리
- `app/(main)/posts/create/page.tsx` - 게시글 작성 페이지
- `app/(main)/posts/[id]/page.tsx` - 게시글 상세 페이지
- `lib/services/postService.ts` - 게시글 API 서비스
- `lib/types/post.ts` - 게시글 타입 정의
- `components/features/comment/CommentItem.tsx` - 댓글 아이템 컴포넌트
- `components/features/comment/CommentList.tsx` - 댓글 목록 컴포넌트
