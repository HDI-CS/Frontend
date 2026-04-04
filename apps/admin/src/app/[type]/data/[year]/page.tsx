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
import { useDataYears } from '@/src/hooks/data/useDataYears';
import { useMe } from '@/src/hooks/useMe';
import {
  IndustrialDataCategoryGroups,
  IndustrialDataItem,
} from '@/src/schemas/industry-data';
import {
  VisualDataCategoryGroups,
  VisualDataItem,
} from '@/src/schemas/visual-data';
import { Years } from '@/src/types/data/visual-data';
import clsx from 'clsx';
import Image from 'next/image';
import { useParams } from 'next/navigation';
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
      yearName: Years;
    }
  | {
      type: 'INDUSTRY';
      yearId: number;
      categories: CategoryGroup<IndustrialDataItem>[];
      yearName: Years;
    };

const IndexPage = () => {

  const { data: userInfo, isLoading: isMeLoading, error: meError } = useMe();

  useEffect(() => {
    console.log(userInfo?.result.userType);
  }, [userInfo]);

  // 페이지 진입 시 최신 사용자 정보 동기화

  const { year } = useParams<{ year: string }>();
  const yearId = Number(year);

  const { userType } = userInfo?.result || {};

  const { data, isLoading } = useDatasetsByYear({
    type: userType ?? 'VISUAL',
    yearId: yearId,
  });

  const { data: yearData } = useDataYears(
    userType ?? 'VISUAL'
  );

  const yearName = yearData?.result.find(
    (y: { yearId: number; folderName: Years }) => y.yearId === yearId
  )?.folderName;

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

  if (isMeLoading)
    return (
      <div className="text-primary-blue text-regular16 flex min-h-screen items-center justify-center bg-[#F4F7FF] px-2 pt-1.5">
        어드민 정보 로딩 중..{' '}
      </div>
    );
  if (meError)
    return (
      <div className="text-primary-blue text-regular16 flex min-h-screen items-center justify-center bg-[#F4F7FF] px-2 pt-1.5">
        사용자 정보를 확인할 수 없습니다
      </div>
    );

  if (!userType) {
    return (
      <div className="text-primary-blue text-regular16 flex min-h-screen items-center justify-center bg-[#F4F7FF] px-2 pt-1.5">
        사용자 정보를 불러오지 못했습니다
      </div>
    );
  }

  console.log('✅ 데이터 페이지 렌더링 - 사용자 유형:', userType);
  console.log('📊 데이터 페이지 렌더링 - 연도 ID:', yearId);
  console.log('📅 데이터 페이지 렌더링 - 연도 이름:', yearName);
  if (!data || !yearName) return null;

  switch (userType) {
    case 'VISUAL':
      return (
        <DataPage
          type={userType}
          yearId={yearId}
          categories={data.result as VisualDataCategoryGroups}
          yearName={yearName}
        />
      );

    case 'INDUSTRY':
      return (
        <DataPage
          type={userType}
          yearId={yearId}
          categories={data.result as IndustrialDataCategoryGroups}
          yearName={yearName}
        />
      );

    default:
    // throw new Error(`Unsupported dataset type: ${type}`);
  }
};
export default IndexPage;
