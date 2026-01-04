import trueImg from '@/public/evaluation/complete.svg';
import falseImg from '@/public/evaluation/false.svg';
import { UserType } from '@/src/schemas/auth';
import { MemberEvaluationStatus } from '@/src/schemas/evaluation';
import { useSearchStore } from '@/src/store/searchStore';
import { highlightText } from '@/src/utils/highlightText';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Td from '../data/table/Td';
import Th from '../data/table/Th';
import BaseGridTable from './BaseGridTable';
import ProgressBar from './ProgressBar';

interface AllExpertGridTableProps {
  activeId: number | null;
  rows: MemberEvaluationStatus[];
  type: UserType;
  yearId: number;
  roundId: number;
  setActiveId: (id: number | null) => void;
}

const AllExpertGridTable = ({
  activeId,
  rows,
  yearId,
  roundId,
  type,
  setActiveId,
}: AllExpertGridTableProps) => {
  const router = useRouter();

  /* ---------- table ui ---------- */

  const MIN_QUALITATIVE_COL = 8;

  const qualitativeCount =
    rows.length > 0
      ? Math.max(
          ...rows.map(
            (row) =>
              row.evalStatuses.filter((s) => s.evalType === 'QUALITATIVE')
                .length
          )
        )
      : 0;
  const columnCount = Math.max(MIN_QUALITATIVE_COL, qualitativeCount);

  /* ---------- highlight ---------- */

  const { keyword, activeIndex , setResultFromData} = useSearchStore();
  const activeRowIdFromSearch =
    keyword && activeIndex > 0 ? rows[activeIndex - 1]?.memberId : null;

  useEffect(() => {
    if (!keyword) {
      setResultFromData(null); // 검색 없으면 초기화
    } else {
      setResultFromData(rows);
    }
  }, [keyword, rows, setResultFromData]);

  return (
    <BaseGridTable>
      <thead className="text-neutral-gray sticky top-0 bg-white">
        <tr className="">
          <Th className="text-regular16 w-[60px] text-start">번호</Th>
          <Th className="text-regular16 w-[108px] text-start">평가자명</Th>
          <Th className="text-regular16 w-[150px] text-start">진행도</Th>
          <Th className="text-regular16 w-[146px] text-start">
            가중치 평가 유무
          </Th>

          {/*  정성평가 헤더  생성 */}
          {Array.from({ length: columnCount }).map((_, index) => {
            const hasData = qualitativeCount > index;

            return (
              <Th key={index} className="text-regular16 w-[125px] text-center">
                {hasData ? `${index + 1}. 정성평가` : ''}
              </Th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, index) => {
          // const qualitativeCount = getQualitativeCount(
          //   row.qualitativeEvaluation
          // );
          // 가중치 평가 수행 유무
          const isWeightedDone = row.evalStatuses.some(
            (s) => s.evalType === 'WEIGHTED' && s.evalStatus === 'DONE'
          );

          return (
            <tr
              key={row.memberId}
              onClick={() => setActiveId(row.memberId)}
              onDoubleClick={() => {
                setActiveId(row.memberId); // memberId
                router.push(
                  `/${type.toLowerCase()}/evaluation/${yearId}/${roundId}/${row.memberId}`
                );
              }}
              className={clsx(
                'h-25 hover:bg-[#F4F7FF]',
                activeId === row.memberId ? 'bg-[#F4F7FF]' : 'bg-neutral-white'
              )}
            >
              <Td className="text-regular16 px-4 py-1 text-center">
                {index + 1}
              </Td>

              <Td className="text-regular16 px-4 py-1">
                {highlightText(row.memberName, keyword, {
                  active: row.memberId === activeRowIdFromSearch,
                })}
              </Td>
              <Td className="px-4 py-1 text-start">
                <div className="flex items-center gap-0.5">
                  <ProgressBar
                    current={row.evaluatedCount}
                    total={row.totalCount}
                  />
                </div>
              </Td>
              {/* 가중치 데이터 */}
              <Td className="px-4 py-1">
                <div className="flex items-center justify-center">
                  <Image
                    width={20}
                    height={20}
                    src={isWeightedDone ? trueImg : falseImg}
                    alt="weighted"
                  />
                </div>
              </Td>
              {/* 정성평가 데이터 */}
              {Array.from({ length: columnCount }).map((_, index) => {
                const qualitativeStatuses = row.evalStatuses.filter(
                  (s) => s.evalType === 'QUALITATIVE'
                );
                const qualitative = qualitativeStatuses[index];

                return (
                  <Td key={index} className="w-[125px] px-4 py-1">
                    <div className="flex items-center justify-center">
                      {qualitative ? (
                        <Image
                          width={20}
                          height={20}
                          src={
                            qualitative?.evalStatus === 'DONE'
                              ? trueImg
                              : falseImg
                          }
                          alt="qualitative"
                        />
                      ) : (
                        <div className="h-[20px] w-[20px]" />
                      )}
                    </div>
                  </Td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </BaseGridTable>
  );
};

export default AllExpertGridTable;

// activeIndex 이동 시 자동 스크롤까지

// useEffect(() => {
//   if (!activeRowIdFromSearch) return;

//   const el = document.getElementById(
//     `row-${activeRowIdFromSearch}`
//   );
//   el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
// }, [activeRowIdFromSearch]);
{
  /* <tr id={`row-${row.memberId}`} ...> */
}
