import useGridManager from '@/src/hooks/useGridManager';

import { useExpertAssignment } from '@/src/hooks/expert/useAssignmentExpert';
import { useSearchCandidate } from '@/src/hooks/expert/useSearchCandidate';
import { useDebounce } from '@/src/hooks/useDebounde';
import { UserType } from '@/src/schemas/auth';
import { dataIdsSetArray, ExpertBasicArray } from '@/src/schemas/expert';
import { useSearchStore } from '@/src/store/searchStore';
import { dataIdsTempSet } from '@/src/types/expert';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import Td from '../data/table/Td';
import Th from '../data/table/Th';
import BaseGridTable from '../evaluation/BaseGridTable';
import IdAssignmentModal from './IdAssignmentModal';
import IdNumberBtn from './IdNumberBtn';
import MappingExcelDown from './MappingExcelDown';

interface IdMappingTableProps {
  type: UserType;
  year: number;
  round: number;
}
const IdMappingTable = ({ type, round }: IdMappingTableProps) => {
  const {
    activeRowId,
    setActiveRowId,
    selectedExpertRow,
    setSelectedExpertRow,
  } = useGridManager(type!);

  /*
   * 검색어 (전역 store)
   */
  const keyword = useSearchStore((s) => s.keyword);

  /* 서버에서 전문가 + 할당된 데이터셋 목록 조회  */
  const { data } = useExpertAssignment(type, round, keyword);

  /*  행 추가를 위한 상태 관리 : 전문가 검색을 통한 등록 이후에 서버에 저장, 등록하지 않으면 사라짐  */
  const [mappingData, setMappingData] = useState<dataIdsTempSet[]>();
  /* 초기 데이터 세팅 */

  // const localData = useMemo<DatasetByCategory>(() => {
  //   const init: DatasetByCategory = {};

  //   for (const c of categories) {
  //     init[c.categoryName] = c.data ?? [];
  //   }

  //   if (keyword.length && data?.result) {
  //     const normalizedSearchData: DatasetItems = Array.isArray(data.result)
  //       ? data.result
  //       : [data.result];

  //     return {
  //       ...init,
  //       [activeCategory]: normalizedSearchData,
  //     };
  //   }
  //   return init;
  // }, [keyword, activeCategory, categories, data]);

  // ** 서버에서 내려온 기존 행은 읽기 전용,
  //** + 버튼으로 임시로 추가한 행만 이름 칸이 input(편집 가능) 이 되게

  const initData = useMemo<dataIdsSetArray>(() => {
    if (data?.result) {
      const normalized = data.result.map((row) => ({
        ...row,
        isTemp: false, // 서버 데이터
      }));

      setMappingData(normalized);
      return normalized;
    }
    return [];
  }, [data]);

  /**
   * 검색어 하이라이트 처리
   * - 이름 검색 시 일치하는 부분을 파란색으로 강조
   */
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

  /**
   * 검색 input 관련 상태
   */
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<ExpertBasicArray>([]);

  // search는 즉시 업데이트하고,
  // 서버 요청은 debounce된 값으로만 보냄
  const debouncedSearch = useDebounce({ value: search, delay: 400 });
  // 서버 검색 mutation
  const { mutate: searchExpert } = useSearchCandidate(type, debouncedSearch);
  useEffect(() => {
    if (!debouncedSearch.trim()) return;

    searchExpert(undefined, {
      onSuccess: (data) => {
        setResults(data?.result);
        setOpen(true);
      },
    });
  }, [debouncedSearch, searchExpert]);

  const [open, setOpen] = useState(false);

  /*  모달 열리고 닫힐 때 마다 배열 비우기 */
  // useEffect(() => {
  //   setResults([]);
  // }, [open]);

  /**
   * ID 할당 모달 오픈 여부
   */
  const [isIdAssignmentModalOpen, setIsIdAssignmentModalOpen] = useState(false);

  // products : 특정 전문가가 평가해야 할 제품 목록
  // const products = ID_MAPPING_DUMMY.find(
  //   (e) => e.expertId === 1
  // )?.assignedProductIds;

  const handleAddRow = () => {
    setMappingData((prev) => {
      if (!prev) return [createEmptyRow()];

      return [...prev, createEmptyRow()];
    });
  };
  const createEmptyRow = (): dataIdsTempSet => ({
    memberId: Date.now(), // 임시 ID
    name: '',
    dataIds: [],
    isTemp: true, // 임시 행
  });
  const [isExpertTemp, setIsExpertTemp] = useState(true);

  // handleChangeExpertName : 이름 변경 핸들러
  // const handleChangeExpertName = (expertId: number, value: string) => {
  //   setMappingData((prev) =>
  //     prev?.map((row) =>
  //       row.expertId === expertId ? { ...row, expertName: value } : row
  //     )
  //   );
  // };

  /**
   * 모달 내 이전/다음 이동을 위한 인덱스 계산
   */

  // 화살표 disabled 관리
  const lastIndex = initData.length - 1;

  // 현재 index 계산
  const currentIndex = initData.findIndex(
    (r) => r.memberId === selectedExpertRow?.memberId
  );

  // 이전
  const handlePrev = () => {
    if (currentIndex <= 0) return;
    const prevRow = initData[currentIndex - 1];
    if (!prevRow) return;

    setSelectedExpertRow(prevRow);
    setActiveRowId(prevRow.memberId);
    // setDataId(prevRow.);
  };

  // 다음
  const handleNext = () => {
    if (currentIndex >= initData.length - 1) return;
    const nextRow = initData[currentIndex + 1];
    if (!nextRow) return;

    setSelectedExpertRow(nextRow);
    setActiveRowId(nextRow.memberId);
    // setDataId(nextRow.id);
  };

  return (
    <div onClick={() => setActiveRowId(null)} className=" ">
      <MappingExcelDown type={type} roundId={round} />
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
                key={row.memberId}
                className={clsx(
                  'h-21 text-neutral-regularBlack hover:bg-[#F4F7FF]',
                  activeRowId === row.memberId
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
                    activeRowId === row.memberId ? 'px-0' : 'px-4 py-1'
                  )}
                >
                  {row.isTemp && activeRowId === row.memberId ? (
                    <div className="relative">
                      <input
                        className="border-primary-blue w-full rounded-none border px-3 py-2 focus:outline-none focus:ring-0"
                        value={search ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSearch(value);

                          // handleChangeExpertName(row.memberId, value);
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

                      {open && results.length > 0 && (
                        <ul className="absolute z-10 mt-1 w-full border bg-white shadow">
                          {results.map((expert) => (
                            <li
                              key={expert.memberId}
                              className="cursor-pointer px-3 py-2 hover:bg-[#F4F7FF]"
                              onMouseDown={() => {
                                // 선택 후 데이터 매칭까지 완료 후 -> 전문가 데이터 확정
                                setMappingData((prev) =>
                                  prev?.map((r) =>
                                    r.memberId === row.memberId
                                      ? {
                                          ...r,
                                          memberId: expert.memberId,
                                          name: expert.name,
                                          isTemp: true, //  아직은 임시 데이터
                                        }
                                      : r
                                  )
                                );
                                setOpen(false);
                              }}
                            >
                              {highlightText(expert.name, search)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <p
                      className="min-h-4 w-[130px] cursor-pointer"
                      onClick={(e) => {
                        if (!row.isTemp) return; // 서버 데이터는 클릭해도 편집 X

                        e.stopPropagation();
                        setActiveRowId(row.memberId);
                        setSearch(row.name);
                      }}
                    >
                      {row.name}
                    </p>
                  )}
                </Td>
                {/*  디자인 AI 해석 및 평가 리스트 수행 번호 */}
                <Td className="text-neutral-regularBlack h-21 text-regular16 px-4 py-1 text-start align-middle">
                  <div
                    onDoubleClick={() => {
                      setIsExpertTemp(row.isTemp ?? true);
                      setActiveRowId(row.memberId);
                      setSelectedExpertRow(row);
                      setIsIdAssignmentModalOpen(true);
                    }}
                    className="flex h-full w-full items-center"
                  >
                    <div className="flex flex-wrap items-center gap-1">
                      {row.dataIds.map((product) => (
                        <IdNumberBtn
                          key={product.datasetId}
                          item={product.dataCode}
                        />
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
          type={type}
          round={round}
          isTemp={isExpertTemp}
          expert={selectedExpertRow}
          index={activeRowId}
          lastIndex={lastIndex}
          currentIndex={currentIndex}
          totalLength={initData.length}
          onClose={() => {
            setIsIdAssignmentModalOpen(false);
            setActiveRowId(null);
            setIsExpertTemp(false);
          }}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
};
export default IdMappingTable;
