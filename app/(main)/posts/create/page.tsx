'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { postService, categoryService } from '@/lib/services';
import { Category, PostStatus } from '@/lib/types';
import { useAuth } from '@/lib/hooks';
import { Button, Input, Card } from '@/components/ui';

export default function CreatePostPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [tags, setTags] = useState<string>('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 디버깅: 사용자 정보 확인
    console.log('Auth State:', { authLoading, isAuthenticated, user });

    // 인증 확인
    if (!authLoading && !isAuthenticated) {
      alert('로그인이 필요합니다.');
      router.push('/login?redirect=/posts/create');
      return;
    }

    // 카테고리 로드
    loadCategories();
  }, [authLoading, isAuthenticated, user, router]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleSubmit = async (e: FormEvent, status: PostStatus) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    // 디버깅: 사용자 정보 확인
    console.log('User info when submitting:', user);

    if (!user?.id) {
      console.error('User ID missing. Full user object:', user);
      setError('사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      setLoading(true);

      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const postData = {
        title: title.trim(),
        content: content.trim(),
        summary: summary.trim() || undefined,
        categoryId: categoryId,
        tagIds: undefined, // 태그는 이름으로 전송하는 경우도 있음 (백엔드 API 확인 필요)
        status,
      };

      const createdPost = await postService.createPost(postData, user.id);

      // 발행 상태일 경우, publish API 호출
      if (status === PostStatus.PUBLISHED) {
        await postService.publishPost(createdPost.id, user.id);
        alert('게시글이 발행되었습니다.');
        router.push(`/posts/${createdPost.id}`);
      } else {
        alert('임시저장되었습니다.');
        router.push('/posts');
      }
    } catch (err: any) {
      console.error('Failed to create post:', err);
      setError(err.response?.data?.message || '게시글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <Link href="/posts" className="text-blue-600 hover:text-blue-700 font-medium">
            ← 목록으로
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">게시글 작성</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <Card>
          <form>
            {/* 카테고리 선택 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <select
                value={categoryId || ''}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">카테고리 선택 (선택사항)</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 제목 */}
            <div className="mb-6">
              <Input
                label="제목"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                required
                maxLength={200}
              />
              <p className="mt-1 text-sm text-gray-500 text-right">
                {title.length}/200
              </p>
            </div>

            {/* 요약 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                요약 (선택사항)
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="게시글 요약을 입력하세요"
                rows={2}
                maxLength={300}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              />
              <p className="mt-1 text-sm text-gray-500 text-right">
                {summary.length}/300
              </p>
            </div>

            {/* 본문 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                본문 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                rows={15}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
              />
              <p className="mt-1 text-sm text-gray-500">
                마크다운 에디터는 추후 업데이트 예정입니다.
              </p>
            </div>

            {/* 태그 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태그 (선택사항)
              </label>
              <Input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="태그를 쉼표로 구분하여 입력하세요 (예: React, TypeScript, Next.js)"
              />
              <p className="mt-1 text-sm text-gray-500">
                태그는 쉼표(,)로 구분하여 입력하세요.
              </p>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Link href="/posts">
                <Button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                  disabled={loading}
                >
                  취소
                </Button>
              </Link>
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, PostStatus.DRAFT)}
                className="bg-gray-600 hover:bg-gray-700 text-white"
                disabled={loading}
              >
                임시저장
              </Button>
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, PostStatus.PUBLISHED)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
                isLoading={loading}
              >
                {loading ? '발행 중...' : '발행'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
