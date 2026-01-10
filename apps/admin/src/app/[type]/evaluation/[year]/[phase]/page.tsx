'use client';

import AllExpertGridTable from '@/src/components/evaluation/AllExpertGridTable';
import {
  useGetEvaluationStatus,
  useGetEvaluationStatusByKeyword,
} from '@/src/hooks/evaluation/useGetEvaluationStatus';
import { MemberEvaluationStatus } from '@/src/schemas/evaluation';
import { useSearchStore } from '@/src/store/searchStore';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';

const PhasePage = () => {
  const pathname = usePathname();
  const type = pathname.startsWith('/industry') ? 'INDUSTRY' : 'VISUAL';
  const keyword = useSearchStore((s) => s.keyword);

  const segments = pathname.split('/').filter(Boolean);
  const yearId = segments[2];

  const roundId = segments[3];

  const [activeId, setActiveId] = useState<number | null>(null);
  const { data } = useGetEvaluationStatus(type, Number(roundId));
  const { data: searchData } = useGetEvaluationStatusByKeyword(
    type,
    Number(roundId),
    keyword
  );

  const rows = useMemo<MemberEvaluationStatus[]>(() => {
    // 검색어 있을 때
    if (keyword.length && searchData?.result) {
      return searchData.result;
    }
    // 기본 데이터
    if (data?.result) {
      return data.result;
    }
    //  항상 배열 반환
    return [];
  }, [keyword, searchData, data]);

  return (
    <div className="bg-system-blueBg p-1.5">
      <AllExpertGridTable
        activeId={activeId}
        setActiveId={setActiveId}
        rows={rows}
        type={type}
        roundId={Number(roundId)}
        yearId={Number(yearId)}
      />
    </div>
  );
};
export default PhasePage;
