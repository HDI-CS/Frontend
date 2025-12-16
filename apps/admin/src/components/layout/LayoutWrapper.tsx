'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import clsx from 'clsx';
import SideBar from '../SideBar/SideBar';
import Header from './Header';
import SubHeader from './SubHeader';

// Header를 숨겨야 하는 라우트들
const HIDE_HEADER_ROUTES = ['/auth'];

// SubHeader 보여주는 라우터들
const SUB_HEADER_ROUTES = ['/index'];

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

  // subHeader는 /index 하위 라우터에서만
  const showSubHeader = SUB_HEADER_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <>
      {!shouldHideHeader && <Header name="관리자페이지" />}
      {/* 사이드바 + 콘텐츠를 가로로 */}
      <div className="flex flex-1">
        {!shouldHideHeader && <SideBar />}
        <div className="flex-1">
          {/* SubHeader */}
          {!shouldHideHeader && showSubHeader && <SubHeader />}
          <main className={clsx('flex-1', shouldHideHeader ? 'p-0' : 'p-4')}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
