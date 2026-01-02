'use client';
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
  // const pathname = usePathname();
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

  if (isLoading) return <div>로딩중...</div>;
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
