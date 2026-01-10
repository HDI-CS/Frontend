'use client';
import excelIcon from '@/public/data/Excel.svg';
import sortIcon from '@/public/data/sortIcon.svg';
import CategoryTab from '@/src/components/data/CategoryTab';
import Td from '@/src/components/data/table/Td';
import Th from '@/src/components/data/table/Th';
import ViewToggle from '@/src/components/data/ViewToggle';
import BaseGridTable from '@/src/components/evaluation/BaseGridTable';
import DataPage from '@/src/features/data/DataYearPage';

import { useDatasetsByYear } from '@/src/hooks/data/useDatasetsByYear';
import { useMe } from '@/src/hooks/useMe';
import {
  IndustrialDataCategoryGroups,
  IndustrialDataItem,
} from '@/src/schemas/industry-data';
import {
  VisualDataCategoryGroups,
  VisualDataItem,
} from '@/src/schemas/visual-data';
import clsx from 'clsx';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { type } from 'os';
import { useEffect } from 'react';

type CategoryGroup<T> = {
  categoryName: string;
  data: T[];
};

export type DataPageProps =
  | {
      type: 'VISUAL';
      yearId: number;
      categories: CategoryGroup<VisualDataItem>[];
    }
  | {
      type: 'INDUSTRY';
      yearId: number;
      categories: CategoryGroup<IndustrialDataItem>[];
    };

const IndexPage = () => {
  // const type = pathname.startsWith('/industry') ? 'INDUSTRY' : 'VISUAL';

  const {
    data: userInfo,
    isLoading: isMeLoading,
    // isFetching: isMeFetching,
    error: meError,
  } = useMe();

  useEffect(() => {
    console.log(userInfo?.result.userType);
  }, [userInfo]);

  // 페이지 진입 시 최신 사용자 정보 동기화

  const { year } = useParams<{ year: string }>();
  const yearId = Number(year);

  const { userType } = userInfo?.result || {};

  const { data, isLoading, isError } = useDatasetsByYear({
    type: userType ?? 'VISUAL',
    yearId: yearId,
  });

  if (!userType) {
    return null; // 또는 로딩 UI
  }

  if (isMeLoading) return <div> 어드민 정보 로딩 중..</div>;
  if (meError) return <div> 데이터를 불러오는 중 오류가 발생했습니다.</div>;

  if (isLoading) {
    const tableHeaders = Array.from({ length: 12 });
    const tableRows = Array.from({ length: 8 });

    return (
      <div className="min-h-screen bg-[#F4F7FF] px-2 pt-1.5">
        {/* 상단 */}
        <div className="relative flex items-center justify-between border-b-0 border-[#E5E5E5]">
          <CategoryTab type={'VISUAL'} isLoading />

          <div className="hidden md:absolute md:left-1/2 md:block md:-translate-x-1/2">
            <ViewToggle activeTab="grid" setActiveTab={() => {}} />
          </div>

          <div className="flex gap-3">
            <button
              className={clsx(
                'invisible relative flex h-[32px] w-[32px] items-center justify-center rounded bg-white'
              )}
            >
              <Image src={sortIcon} alt="sort" className="hover:opacity-50" />
            </button>

            <button className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#E5E5E5] bg-white hover:opacity-50">
              <Image src={excelIcon} alt="excel" width={16} height={16} />
            </button>
          </div>
        </div>

        {/* 테이블 Skeleton */}
        <BaseGridTable>
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="text-left text-sm font-light text-[#8D8D8D]">
              {tableHeaders.map((_, idx) => (
                <Th key={idx} className="px-4 py-4">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                </Th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tableRows.map((_, rowIdx) => (
              <tr key={rowIdx} className="h-21">
                {tableHeaders.map((_, colIdx) => (
                  <Td key={colIdx} className="px-4 py-4">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                  </Td>
                ))}
              </tr>
            ))}
          </tbody>
        </BaseGridTable>
      </div>
    );
  }

  if (meError) return <div>유저 정보 에러</div>;
  if (!userType) return null;
  if (isError) return <div>에러 발생</div>;
  if (!data) return null;

  switch (userType) {
    case 'VISUAL':
      return (
        <DataPage
          type={userType}
          yearId={yearId}
          categories={data.result as VisualDataCategoryGroups}
        />
      );

    case 'INDUSTRY':
      return (
        <DataPage
          type={userType}
          yearId={yearId}
          categories={data.result as IndustrialDataCategoryGroups}
        />
      );

    default:
      throw new Error(`Unsupported dataset type: ${type}`);
  }
};
export default IndexPage;
