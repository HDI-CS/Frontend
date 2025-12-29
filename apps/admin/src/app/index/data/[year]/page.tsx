'use client';
import DataPage from '@/src/features/data/DataYearPage';
import { useDatasetsByYear } from '@/src/hooks/data/useDatasetsByYear';
import { useMe } from '@/src/hooks/useMe';
import { useParams } from 'next/navigation';

const IndexPage = () => {
  const {
    data: userInfo,
    isLoading: isMeLoading,
    // isFetching: isMeFetching,
    error: meError,
    // refetch: refetchMe,
  } = useMe();

  const { year } = useParams<{ year: string }>();
  const yearNumber = Number(year);

  const { userType } = userInfo?.result || {};

  const { data, isLoading, isError } = useDatasetsByYear({
    type: userType,
    year: yearNumber,
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

  const categorizedData = data.result;

  return (
    <DataPage
      categories={categorizedData}
      type={userType}
      yearId={yearNumber}
    />
  );
};
export default IndexPage;
