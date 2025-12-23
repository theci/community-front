export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          Community Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          DDD 기반 프로덕션급 커뮤니티 플랫폼
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">게시판</h2>
            <p className="text-gray-600 dark:text-gray-400">
              게시글 작성, 댓글, 좋아요, 스크랩 기능
            </p>
          </div>
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
