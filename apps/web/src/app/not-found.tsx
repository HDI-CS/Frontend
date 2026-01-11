'use client';

import { useEffect } from 'react';

import { Button } from '@/components/Button';
import { useMe } from '@/hooks/useMe';

export default function NotFound() {
  // 사용자 정보 가져오기
  const { data: meData } = useMe();

  // not-found 페이지가 렌더링될 때 Header를 숨기기 위해 body 클래스 추가
  useEffect(() => {
    document.body.classList.add('not-found-page');
    return () => {
      document.body.classList.remove('not-found-page');
    };
  }, []);

  const handleGoHome = () => {
    // React Query 데이터를 기준으로 라우팅
    if (meData?.result?.userType) {
      window.location.href = `/inbox/${meData.result.userType.toLowerCase()}`;
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-8">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-100/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gray-200/30 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        {/* 404 숫자 */}
        <div className="mb-6">
          <h1 className="text-8xl font-bold tracking-tight text-gray-300 md:text-9xl">
            404
          </h1>
          <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-blue-500"></div>
        </div>

        {/* 메시지 */}
        <div className="mb-8 space-y-3">
          <h2 className="text-2xl font-semibold text-gray-800 md:text-3xl">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="leading-relaxed text-gray-600">
            요청하신 페이지가 존재하지 않거나
            <br />
            이동되었을 수 있습니다.
          </p>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button
            text="홈으로 돌아가기"
            onClick={handleGoHome}
            className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white shadow-md transition-colors hover:bg-blue-700 hover:shadow-lg"
          />
          <Button
            text="이전 페이지"
            onClick={() => window.history.back()}
            className="rounded-lg border border-gray-300 bg-white px-8 py-3 font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-50 hover:shadow-lg"
          />
        </div>

        {/* 도움말 */}
        {/* <div className="mt-12 text-sm text-gray-500">
          <p>
            문제가 지속되면{' '}
            <Link
              href="/contact"
              className="text-blue-600 underline hover:text-blue-700"
            >
              고객지원
            </Link>
            에 문의해주세요.
          </p>
        </div> */}
      </div>

      {/* 하단 데코레이션 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform">
        <div className="flex space-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-2 w-2 animate-pulse rounded-full bg-gray-300"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
