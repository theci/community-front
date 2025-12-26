'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    // 이미 메인 페이지에 있으므로 리다이렉트 불필요
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          Community Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          DDD 기반 프로덕션급 커뮤니티 플랫폼
        </p>

        <div className="flex gap-4 justify-center mb-12">
          {!mounted ? (
            <div className="px-6 py-3">
              <div className="animate-pulse h-10 w-32 bg-gray-200 rounded-lg"></div>
            </div>
          ) : isAuthenticated ? (
            <>
              <div className="px-6 py-3 bg-gray-100 rounded-lg">
                <p className="text-gray-700">
                  환영합니다, <span className="font-semibold">{user?.nickname || user?.username}</span>님!
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                로그인
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                회원가입
              </Link>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Link href="/posts" className="p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-2xl font-semibold mb-2">게시판</h2>
            <p className="text-gray-600 dark:text-gray-400">
              게시글 작성, 댓글, 좋아요, 스크랩 기능
            </p>
          </Link>
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">사용자</h2>
            <p className="text-gray-600 dark:text-gray-400">
              회원가입, 로그인, 프로필 관리
            </p>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">포인트 시스템</h2>
            <p className="text-gray-600 dark:text-gray-400">
              포인트 적립, 레벨 시스템, 랭킹
            </p>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">권한 관리</h2>
            <p className="text-gray-600 dark:text-gray-400">
              역할 기반 접근 제어 (RBAC)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
