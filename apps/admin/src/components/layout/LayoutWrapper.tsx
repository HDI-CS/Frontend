'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import clsx from 'clsx';
import Header from './Header';

// Header를 숨겨야 하는 라우트들
const HIDE_HEADER_ROUTES = ['/auth'];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isNotFoundPage, setIsNotFoundPage] = useState(false);

  // not-found 페이지 체크를 위한 effect
  useEffect(() => {
    const checkNotFoundPage = () => {
      setIsNotFoundPage(document.body.classList.contains('not-found-page'));
    };

    // 초기 체크
    checkNotFoundPage();

    // MutationObserver로 body 클래스 변경 감지
    const observer = new MutationObserver(checkNotFoundPage);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // 현재 경로가 Header를 숨겨야 하는 라우트인지 확인
  const shouldHideHeader =
    HIDE_HEADER_ROUTES.some((route) => pathname.startsWith(route)) ||
    isNotFoundPage;

  return (
    <>
      {!shouldHideHeader && <Header name="관리자페이지" />}
      <main className={clsx(shouldHideHeader ? 'p-0' : 'pt-19 pb-4')}>
        {children}
      </main>
    </>
  );
}
