'use client';

import Td from '@/src/components/data/table/Td';
import Th from '@/src/components/data/table/Th';
import AllExpertGridTable from '@/src/components/evaluation/AllExpertGridTable';
import BaseGridTable from '@/src/components/evaluation/BaseGridTable';
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
  const { data, isLoading: searchDataLoading } = useGetEvaluationStatus(
    type,
    Number(roundId)
  );
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

  {
    /* 테이블 Skeleton */
  }
  if (searchDataLoading) {
    const tableHeaders = Array.from({ length: 10 });
    const tableRows = Array.from({ length: 10 });
    return (
      <div className="bg-system-blueBg p-1.5">
        <BaseGridTable>
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="text-left text-sm font-light text-[#8D8D8D]">
              <Th className="text-regular16 w-[60px] text-start">번호</Th>
              <Th className="text-regular16 w-[120px] text-start">평가자명</Th>
              <Th className="text-regular16 w-[150px] text-start">진행도</Th>
              <Th className="text-regular16 w-[146px] text-start">
                가중치 평가 유무
              </Th>
              {tableHeaders.map((_, idx) => (
                <Th key={idx} className="text-regular16 w-[125px] text-center">
                  {''}
                </Th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tableRows.map((_, rowIdx) => (
              <tr key={rowIdx} className="h-25">
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

  return (
    <div className="bg-system-blueBg min-h-screen p-1.5">
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
