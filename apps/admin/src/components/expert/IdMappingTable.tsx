import excelIcon from '@/public/data/Excel.svg';
import { ID_MAPPING_DUMMY, IdMappingType } from '@/src/constants/expert';
import useGridManager from '@/src/hooks/useGridManager';

import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Td from '../data/table/Td';
import Th from '../data/table/Th';
import BaseGridTable from '../evaluation/BaseGridTable';
import IdAssignmentModal from './IdAssignmentModal';
import IdNumberBtn from './IdNumberBtn';

const IdMappingTable = () => {
  const {
    activeRowId,
    setActiveRowId,
    selectedExpertRow,
    setSelectedExpertRow,
  } = useGridManager();

  const [mappingData, setMappingData] = useState<IdMappingType[]>([]);

  // const [loading, setLoading] = useState(true);

  // 검색어
  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text;

    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));

    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={index} className="font-medium text-[#4676FB]">
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  // editName : 이름 칸 누를 시 -> 편집 모드
  // const [editName, setEditName] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const [isIdAssignmentModalOpen, setIsIdAssignmentModalOpen] = useState(false);

  // 같은 이름 중복 제거
  const filteredExperts = Array.from(
    new Map(
      mappingData
        .filter((expert) => expert.expertName.includes(search))
        .map((expert) => [expert.expertName, expert]) // key = 이름
    ).values()
  );

  // products : 특정 전문가가 평가해야 할 제품 목록
  // const products = ID_MAPPING_DUMMY.find(
  //   (e) => e.expertId === 1
  // )?.assignedProductIds;

  /* 초기 데이터 세팅 */
  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      // await API
      setMappingData(ID_MAPPING_DUMMY);
      // setLoading(false);
    };

    fetchData();
  }, []);

  const handleAddRow = () => {
    setMappingData((prev) => {
      if (!prev) return [createEmptyRow()];

      return [...prev, createEmptyRow()];
    });
  };

  const createEmptyRow = (): IdMappingType => ({
    expertId: Date.now(), // 임시 ID
    expertName: '',
    assignedProductIds: [],
  });

  // handleChangeExpertName : 이름 변경 핸들러
  const handleChangeExpertName = (expertId: number, value: string) => {
    setMappingData((prev) =>
      prev?.map((row) =>
        row.expertId === expertId ? { ...row, expertName: value } : row
      )
    );
  };

  // 화살표 disabled 관리
  const lastIndex = mappingData.length - 1;

  // 현재 index 계산
  const currentIndex = mappingData.findIndex(
    (r) => r.expertId === selectedExpertRow?.expertId
  );

  // 이전
  const handlePrev = () => {
    if (currentIndex <= 0) return;
    const prevRow = mappingData[currentIndex - 1];
    if (!prevRow) return;

    setSelectedExpertRow(prevRow);
    setActiveRowId(prevRow.expertId);
    // setDataId(prevRow.);
  };

  // 다음
  const handleNext = () => {
    if (currentIndex >= mappingData.length - 1) return;
    const nextRow = mappingData[currentIndex + 1];
    if (!nextRow) return;

    setSelectedExpertRow(nextRow);
    setActiveRowId(nextRow.expertId);
    // setDataId(nextRow.id);
  };

  return (
    <div onClick={() => setActiveRowId(null)} className=" ">
      <div className="mb-1 flex w-full justify-end">
        <button className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#E5E5E5] bg-white hover:opacity-50">
          <Image src={excelIcon} alt="excel" width={16} height={16} />
        </button>{' '}
      </div>
      <BaseGridTable>
        <thead className="text-neutral-gray bg-white">
          <tr className="hover:bg-system-blueBg cursor-pointer">
            <Th className="text-regular16 w-[51px] text-start">번호</Th>
            <Th className="text-regular16 w-[153px] text-start">성함</Th>
            <Th className="text-regular16 w-300 text-start">
              디자인 AI 해석 및 평가 리스트 수행 번호
            </Th>
          </tr>
        </thead>

        <tbody>
          {mappingData?.map((row, index) => {
            return (
              <tr
                key={row.expertId}
                className={clsx(
                  'h-21 text-neutral-regularBlack hover:bg-[#F4F7FF]',
                  activeRowId === row.expertId
                    ? 'bg-[#F4F7FF]'
                    : 'bg-neutral-white'
                )}
              >
                <Td className="text-regular16 text-neutral-regularBlack px-4 py-1 text-center">
                  {index + 1}
                </Td>

                <Td
                  className={clsx(
                    'text-regular16 text-neutral-regularBlack',
                    activeRowId === row.expertId ? 'px-0' : 'px-4 py-1'
                  )}
                >
                  {activeRowId === row.expertId ? (
                    <>
                      <div className="relative">
                        <input
                          className="border-primary-blue w-full rounded-none border px-3 py-2 focus:outline-none focus:ring-0"
                          value={row.expertName}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSearch(value);
                            handleChangeExpertName(row.expertId, value);
                            setOpen(true);
                          }}
                          onFocus={() => setOpen(true)}
                          onClick={(e) => e.stopPropagation()}
                          onBlur={() => {
                            // 드롭다운 클릭 시간 확보
                            setTimeout(() => setOpen(false), 150);
                            setActiveRowId(null);
                            setSearch('');
                          }}
                        />

                        {open &&
                          search.length > 0 &&
                          filteredExperts.length > 0 && (
                            <ul className="absolute z-10 mt-1 w-full border bg-white shadow">
                              {filteredExperts.map((expert) => (
                                <li
                                  key={expert.expertId}
                                  className="cursor-pointer px-3 py-2 hover:bg-[#F4F7FF]"
                                  onMouseDown={() => {
                                    // blur보다 먼저 실행되게
                                    handleChangeExpertName(
                                      row.expertId,
                                      expert.expertName
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  {highlightText(expert.expertName, search)}
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>
                    </>
                  ) : (
                    <p
                      className="min-h-4 w-[130px] cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveRowId(row.expertId);
                      }}
                    >
                      {row.expertName}
                    </p>
                  )}
                </Td>
                <Td className="text-neutral-regularBlack h-21 text-regular16 px-4 py-1 text-start align-middle">
                  <div
                    onDoubleClick={() => {
                      setActiveRowId(row.expertId);
                      setSelectedExpertRow(row);
                      setIsIdAssignmentModalOpen(true);
                    }}
                    className="flex h-full w-full items-center"
                  >
                    <div className="flex flex-wrap items-center gap-1">
                      {row.assignedProductIds.map((product) => (
                        <IdNumberBtn key={product} item={product} />
                      ))}
                    </div>
                  </div>
                </Td>
              </tr>
            );
          })}
          <tr>
            <Td className="h-21 flex w-[64px] items-center justify-center hover:bg-[#F4F7FF]">
              <div className="cursor-pointer px-3 py-3" onClick={handleAddRow}>
                <button
                  className="flex h-[28px] w-[28px] items-center justify-center rounded text-center text-3xl text-[#4676FB]"
                  aria-label="add row"
                >
                  +
                </button>
              </div>
            </Td>
          </tr>
        </tbody>
      </BaseGridTable>
      {activeRowId && isIdAssignmentModalOpen && selectedExpertRow && (
        <IdAssignmentModal
          index={activeRowId}
          expert={selectedExpertRow}
          lastIndex={lastIndex}
          currentIndex={currentIndex}
          totalLength={mappingData.length}
          onClose={() => {
            setIsIdAssignmentModalOpen(false);
            setActiveRowId(null);
          }}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
};
export default IdMappingTable;
