import trueImg from '@/public/evaluation/complete.svg';
import falseImg from '@/public/evaluation/false.svg';
import { SurveyQustion } from '@/src/types/evaluation';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Td from '../data/table/Td';
import Th from '../data/table/Th';
import BaseGridTable from './BaseGridTable';
import ProgressBar from './ProgressBar';

interface AllExpertGridTableProps {
  activeId: number | null;
  rows: SurveyQustion[];
  setActiveId: (id: number | null) => void;
}

const AllExpertGridTable = ({
  activeId,
  rows,
  setActiveId,
}: AllExpertGridTableProps) => {
  const router = useRouter();
  const maxCount =
    rows.length > 0
      ? Math.max(...rows.map((row) => row.qualitativeEvaluation.length))
      : 0;

  return (
    <BaseGridTable>
      <thead className="text-neutral-gray bg-white">
        <tr className="">
          <Th className="text-regular16 w-[60px] text-start">번호</Th>
          <Th className="text-regular16 w-[108px] text-start">평가자명</Th>
          <Th className="text-regular16 w-[150px] text-start">진행도</Th>
          <Th className="text-regular16 w-[146px] text-start">
            가중치 평가 유무
          </Th>

          {/*  정성평가 헤더  생성 */}
          {Array.from({ length: maxCount }).map((_, index) => (
            <Th key={index} className="text-regular16 w-[125px] text-center">
              {index + 1}. 정성평가
            </Th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, index) => {
          // const qualitativeCount = getQualitativeCount(
          //   row.qualitativeEvaluation
          // );

          return (
            <tr
              key={row.id}
              onClick={() => setActiveId(row.id)}
              onDoubleClick={() => {
                setActiveId(row.id); // memberId
                router.push(`/index/evaluation/year1/phase1/${row.id}`);
              }}
              className={clsx(
                'h-25 hover:bg-[#F4F7FF]',
                activeId === row.id ? 'bg-[#F4F7FF]' : 'bg-neutral-white'
              )}
            >
              <Td className="text-regular16 px-4 py-1 text-center">
                {index + 1}
              </Td>

              <Td className="text-regular16 px-4 py-1">{row.name}</Td>
              <Td className="px-4 py-1 text-start">
                <div className="flex items-center gap-0.5">
                  <ProgressBar current={row.progress} total={30} />
                </div>
              </Td>
              <Td className="px-4 py-1">
                <div className="flex items-center justify-center">
                  <Image
                    width={20}
                    height={20}
                    src={row.isWeighted ? trueImg : falseImg}
                    alt="qualitative"
                  />
                </div>
              </Td>
              {/* 정성평가 데이터 */}
              {Array.from({ length: maxCount }).map((_, index) => {
                const qualitative = row.qualitativeEvaluation[index];

                return (
                  <Td key={index} className="w-[125px] px-4 py-1">
                    <div className="flex items-center justify-center">
                      <Image
                        width={20}
                        height={20}
                        src={
                          qualitative
                            ? qualitative.isQualitative
                              ? trueImg
                              : falseImg
                            : falseImg
                        }
                        alt="qualitative"
                      />
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
