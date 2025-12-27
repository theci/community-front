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

// 최대 5단계까지 제한, 이후는 5단계 유지
const currentDepth = Math.min(depth, 5);
const nextDepth = Math.min(depth + 1, 5);

// depth별 배경색 차별화
const bgColorClass = currentDepth === 0
  ? 'bg-gray-50'      // 최상위 댓글
  : currentDepth === 1
  ? 'bg-blue-50'      // 1단계 답글
  : currentDepth === 2
  ? 'bg-green-50'     // 2단계 답글
  : currentDepth === 3
  ? 'bg-yellow-50'    // 3단계 답글
  : currentDepth === 4
  ? 'bg-purple-50'    // 4단계 답글
  : 'bg-pink-50';     // 5단계 이상 답글

// 답글 화살표 표시 (레벨 배지는 제거)
{currentDepth > 0 && (
  <span className="text-xs font-semibold text-blue-600">↳</span>
)}

// 재귀적으로 depth 전달
<CommentItem
  comment={reply}
  depth={nextDepth}
  // ...
/>
```

**추가 수정 사항**:
```typescript
// CommentList.tsx - 최상위 댓글에 depth={0} 명시
<CommentItem depth={0} {...props} />

// CommentItem.tsx - 답글 추가 시 자동으로 펼치기
useEffect(() => {
  if (comment.replies && comment.replies.length > 0) {
    setShowReplies(true);
  }
}, [comment.replies]);
```

### 학습 포인트
- 재귀 컴포넌트에서 깊이 추적 중요
- `Math.min(depth, 5)`으로 최대 깊이 제한
- Tailwind CSS 조건부 클래스 활용
- 시각적 계층 구조: 색상 + 아이콘 + 들여쓰기 조합
- useEffect로 답글 자동 펼치기 구현

---

## 6. 게시글 이미지 업로드 문제 (중복 & 깨짐)

### 문제 1: 이미지 1개 업로드 시 2개로 중복
- 이미지 버튼 클릭 후 1개 선택 시 `![굿아이디어.jpg](temp:0)` 가 2번 삽입됨

### 원인
중첩된 상태 업데이트로 인한 React 렌더링 문제

**문제가 있던 코드**:
```typescript
// app/(main)/posts/create/page.tsx
files.forEach((file) => {
  setImageFiles((prev) => {
    const newImageFiles = [...prev, { file, localUrl }];

    // ❌ setImageFiles 안에서 setContent 호출 (중첩된 상태 업데이트)
    setContent((prevContent) => {
      const newContent = prevContent + imageMarkdown;
      return newContent;
    });

    return newImageFiles;
  });
});
```

문제점:
- `setImageFiles` 함수 안에서 `setContent`를 호출하는 중첩 구조
- React 배치 업데이트 시 예상치 못한 동작 발생
- `forEach` 루프에서 각 파일마다 별도 상태 업데이트

### 해결 1: 상태 업데이트 분리

```typescript
// 수정된 코드
const handleImageInsert = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.multiple = true;
  input.onchange = (e: Event) => {
    const files = Array.from(target.files || []);
    if (files.length === 0) return;

    // 파일 크기 검증
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name}: 파일 크기가 너무 큽니다. (최대 10MB)`);
        return false;
      }
      return true;
    });

    // ✅ 1. 커서 위치를 먼저 저장
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
    const cursorPosition = textarea ? textarea.selectionStart : content.length;

    // ✅ 2. 모든 파일을 한 번에 처리
    const newImageItems = validFiles.map((file) => ({
      file,
      localUrl: URL.createObjectURL(file),
    }));

    const startIndex = imageFiles.length;

    // ✅ 3. 마크다운 텍스트 생성
    const imageMarkdowns = newImageItems
      .map((item, i) => `\n![${item.file.name}](temp:${startIndex + i})\n`)
      .join('');

    // ✅ 4. 상태 업데이트를 분리해서 순차적으로 처리
    setImageFiles((prev) => [...prev, ...newImageItems]);
    setContent((prev) =>
      prev.substring(0, cursorPosition) + imageMarkdowns + prev.substring(cursorPosition)
    );

    // 커서 위치 조정
    if (textarea) {
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          cursorPosition + imageMarkdowns.length,
          cursorPosition + imageMarkdowns.length
        );
      }, 0);
    }
  };
  input.click();
};
```

---

### 문제 2: 발행된 게시글에서 이미지 깨짐 (403/401 에러)

초기 에러:
```
GET http://54.180.251.210:3001/api/v1/files/posts/attachments/.../image.jpg 401 (Unauthorized)
```

이후 에러:
```
GET https://test-airgateway.s3.ap-northeast-2.amazonaws.com/posts/attachments/.../image.jpg 403 (Forbidden)
```

### 원인 분석

**단계 1**: 백엔드 `fileUrl` 필드가 상대 경로 반환
```json
{
  "fileUrl": "/api/v1/files/posts/attachments/2025/12/27/image.jpg",
  "filePath": "posts/attachments/2025/12/27/image.jpg"
}
```

- `fileUrl`을 그대로 사용하면 브라우저가 상대 경로로 인식
- 프론트엔드 서버(3001 포트)로 요청 → 401 Unauthorized

**단계 2**: S3 직접 URL로 변경했지만 여전히 접근 불가
```typescript
const s3Url = `https://test-airgateway.s3.ap-northeast-2.amazonaws.com/${attachment.filePath}`;
```

- S3 버킷이 기본적으로 private 설정
- 공개 읽기 권한 없음 → 403 Forbidden

**단계 3**: 백엔드 API로 프록시 시도
```
GET http://54.180.251.210:8080/api/v1/files/posts/attachments/.../image.jpg
→ 401 Unauthorized (인증 필요)
```

### 해결 2: S3 버킷 공개 설정

**AWS S3 버킷 정책 추가**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::test-airgateway/posts/attachments/*"
    }
  ]
}
```

**프론트엔드 최종 코드**:
```typescript
// app/(main)/posts/create/page.tsx
if (imageFiles.length > 0) {
  const files = imageFiles.map((img) => img.file);
  const uploadedAttachments = await attachmentService.uploadAttachments(
    createdPost.id,
    files,
    user.id
  );

  // temp: URL을 S3 직접 URL로 교체
  uploadedAttachments.forEach((attachment, index) => {
    const s3Url = `https://test-airgateway.s3.ap-northeast-2.amazonaws.com/${attachment.filePath}`;

    const regex = new RegExp(`temp:${index}`, 'g');
    finalContent = finalContent.replace(regex, s3Url);
  });

  // 게시글 업데이트로 URL 반영
  await postService.updatePost(createdPost.id, {
    title: createdPost.title,
    content: finalContent,
    contentType: 'MARKDOWN',
    categoryId: createdPost.category?.id,
  }, user.id);
}
```

### 학습 포인트

#### 1. React 상태 관리 원칙
- **중첩된 setState 호출 금지**: 한 setState 안에서 다른 setState 호출 X
- **배치 업데이트 이해**: React는 여러 setState를 배치로 처리
- **순차적 상태 업데이트**: 서로 독립적인 상태는 분리해서 업데이트

#### 2. 파일 업로드 워크플로우
```
1. 로컬 미리보기: URL.createObjectURL() → blob:http://...
2. 임시 마크다운: ![image.jpg](temp:0)
3. 서버 업로드: S3에 파일 저장
4. URL 교체: temp:0 → 실제 S3 URL
5. 게시글 업데이트: 최종 content 저장
```

#### 3. S3 파일 접근 방식 비교

| 방식 | URL 예시 | 장점 | 단점 |
|------|----------|------|------|
| **S3 직접** | `https://bucket.s3.region.amazonaws.com/path` | 빠름, CDN 가능 | 공개 설정 필요 |
| **백엔드 프록시** | `http://api.com/api/v1/files/path` | 권한 제어 가능 | 서버 부하, 느림 |
| **Presigned URL** | `https://bucket.s3...?AWSAccessKeyId=...` | 임시 권한 부여 | URL 만료 관리 |

**공개 블로그/포럼**: S3 직접 URL 권장 (성능 최적화)

#### 4. 디버깅 팁
```typescript
// URL 교체 로그 확인
console.log('교체 전:', finalContent);
console.log('교체 대상:', `temp:${index}`);
console.log('교체 후:', finalContent.replace(regex, s3Url));

// 정규식 일치 개수 확인
const matches = (finalContent.match(regex) || []).length;
console.log('일치 개수:', matches); // 0이면 교체 실패
```

#### 5. TypeScript 타입 정의
```typescript
// lib/types/attachment.ts
export interface Attachment {
  id: number;
  postId: number;
  fileName: string;
  originalName: string;    // ⚠️ originalFileName이 아님!
  fileType: AttachmentType;
  filePath: string;         // S3 키 (상대 경로)
  fileUrl: string;          // 백엔드 API 경로 (상대 경로)
  fileSize: number;
  mimeType: string;
  displayOrder: number;
}
```

---

## 참고 파일
- `lib/services/authService.ts` - 인증 API 서비스
- `lib/store/authStore.ts` - Zustand 인증 상태 관리
- `app/(main)/posts/create/page.tsx` - 게시글 작성 페이지
- `app/(main)/posts/[id]/page.tsx` - 게시글 상세 페이지
- `lib/services/postService.ts` - 게시글 API 서비스
- `lib/services/attachmentService.ts` - 첨부파일 API 서비스
- `lib/types/post.ts` - 게시글 타입 정의
- `lib/types/attachment.ts` - 첨부파일 타입 정의
- `components/features/comment/CommentItem.tsx` - 댓글 아이템 컴포넌트
- `components/features/comment/CommentList.tsx` - 댓글 목록 컴포넌트
