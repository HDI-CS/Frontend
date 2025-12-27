'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import getHeaderOptions from '@/src/utils/getHeaderOptions';
import clsx from 'clsx';
import SideBar from '../SideBar/SideBar';
import Header from './Header';
import SubHeader from './SubHeader';

// Header를 숨겨야 하는 라우트들
const HIDE_HEADER_ROUTES = ['/auth'];

// SubHeader 보여주는 라우터들
const SUB_HEADER_RULES = new Map<string, number>([
  ['/index', 1],
  ['/index/data', 2],
  ['/index/expert', 2],
  ['/index/evaluation', 2],
  ['/index/evaluation/year1', 3],
  ['/index/evaluation/year2', 3],
  ['/index/expert/id-mapping', 3],
  ['/index/expert/id-mapping/year1', 4],
]);

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const headerOptions = getHeaderOptions(pathname);

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

  // subHeader
  const getPathDepth = (pathname: string) =>
    pathname.split('/').filter(Boolean).length;

  const showSubHeader =
    SUB_HEADER_RULES.get(pathname) === getPathDepth(pathname);

  return (
    <div className="">
      {/*  기본 가로 스크롤 차단 */}
      {!shouldHideHeader && (
        <Header name="관리자페이지" isInput={headerOptions.isInput} />
      )}
      {/* 사이드바 + 콘텐츠를 가로로 */}
      <div className="flex flex-1">
        {!shouldHideHeader && <SideBar />}
        <div className="min-w-0 flex-1">
          {/* SubHeader */}
          {!shouldHideHeader && showSubHeader && <SubHeader />}
          <main
            className={clsx(
              'flex-1 overflow-hidden',
              shouldHideHeader ? 'p-0' : ''
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

// 스크롤이 들어가야 하는 flex 자식에 min-w-0를 꼭 줘야 함.
