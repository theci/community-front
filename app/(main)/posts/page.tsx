'use client';

import { useState, useEffect } from 'react';
import { postService } from '@/lib/services';
import { Post } from '@/lib/types';
import { PostCard } from '@/components/features/post/PostCard';
import { Button } from '@/components/ui';
import Link from 'next/link';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');

  const loadPosts = async (currentPage: number, sort: string) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (sort === 'latest') {
        response = await postService.getPosts(currentPage, 20, 'createdAt,desc');
        console.log('Post list response:', response);
        console.log('Posts content:', response?.content);
        console.log('Total posts:', response?.pageInfo?.totalElements);
        setPosts(response?.content || []);
        setTotalPages(response?.pageInfo?.totalPages || 0);
      } else if (sort === 'popular') {
        const popularPosts = await postService.getPopularPosts(20);
        console.log('Popular posts:', popularPosts);
        setPosts(popularPosts || []);
        setTotalPages(1);
      } else if (sort === 'trending') {
        const trendingPosts = await postService.getTrendingPosts(7);
        console.log('Trending posts:', trendingPosts);
        setPosts(trendingPosts || []);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error('Failed to load posts:', err);
      setError(err.response?.data?.message || '게시글을 불러오는데 실패했습니다.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(page, sortBy);
  }, [page, sortBy]);

  const handleSortChange = (newSort: 'latest' | 'popular' | 'trending') => {
    setSortBy(newSort);
    setPage(0);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">게시판</h1>
          <Link href="/posts/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              글쓰기
            </Button>
          </Link>
        </div>

        {/* 정렬 옵션 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleSortChange('latest')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === 'latest'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => handleSortChange('popular')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === 'popular'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            인기순
          </button>
          <button
            onClick={() => handleSortChange('trending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === 'trending'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            트렌딩
          </button>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 게시글 목록 */}
        {!loading && !error && posts && (
          <>
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">아직 작성된 게시글이 없습니다.</p>
                <Link href="/posts/create">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    첫 게시글 작성하기
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && posts.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={handlePreviousPage}
                  disabled={page === 0}
                  className={`px-4 py-2 rounded-lg border ${
                    page === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  이전
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (page < 3) {
                      pageNum = i;
                    } else if (page > totalPages - 4) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 rounded-lg ${
                          page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages - 1}
                  className={`px-4 py-2 rounded-lg border ${
                    page >= totalPages - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
