import empty from '@/public/data/EmptyIMg.svg';
import { DataItemWithIndex } from '@/src/features/data/DataYearPage';
import useGridManager from '@/src/hooks/useGridManager';
import { useAuthStore } from '@/src/store/authStore';
import clsx from 'clsx';
import Image from 'next/image';
import FieldActionMenu from '../FieldActionMenu';
import DataDetailModal from './DataDetailModal';
import IdSortMenu from './table/IdSortMenu';
import Td from './table/Td';
import Th from './table/Th';

const GridTable = ({
  rows,
  onAddRow,
  orderBy,
  setOrderBy,
  lastIndex,
}: {
  rows: DataItemWithIndex[];
  orderBy: 'first' | 'last';
  isEdit?: boolean; // field 수정 가능한지 아닌지
  lastIndex: number;

  onAddRow: () => void;
  setOrderBy: (sort: 'first' | 'last') => void;
}) => {
  const { type } = useAuthStore();
  const {
    dataId,
    activeRowId,
    isEdit,
    idMenu,
    rowMenu,

    setDataId,
    setActiveRowId,
    setIsEdit,
    setIdMenu,
    setRowMenu,
    getFieldMenuItems,
  } = useGridManager(type!);

  const currentIndex =
    dataId == null ? -1 : rows.findIndex((r) => r.id === dataId);

  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === -1 || currentIndex >= rows.length - 1;

  const handlePrev = () => {
    const prev = rows[currentIndex - 1];
    if (!prev) return;

    setDataId(prev.id);
  };

  const handleNext = () => {
    const next = rows[currentIndex + 1];
    if (!next) return;

    setDataId(next.id);
  };

  const rowItem = rows.find((r) => r.id === dataId);

  return (
    <>
      <div className="border border-t-0 border-[#E5E5E5] bg-white p-2">
        {/* 테이블 스크롤 영역 */}
        <div className="max-h-[680px] overflow-auto">
          <table className="w-full border-separate border-spacing-0">
            {/* 헤더 */}
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border text-left text-sm font-light text-[#8D8D8D]">
                <Th className="w-[64px]">번호</Th>
                <Th
                  className="w-[90px]"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setIdMenu({
                      x: e.clientX,
                      y: e.clientY,
                    });
                  }}
                >
                  ID
                </Th>
                <Th className="w-[140px]">브랜드명</Th>
                <Th className="w-[140px]">부문·카테고리</Th>
                <Th className="min-w-[260px]">대표 제품 카테고리</Th>
                <Th className="min-w-[240px]">대표 제품</Th>
                <Th className="w-[160px]">타겟(성별/연령)</Th>
                <Th className="min-w-[180px]">홈페이지</Th>
                <Th className="w-[120px] text-center">로고이미지</Th>
              </tr>
            </thead>

            {/* 바디 */}
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={clsx(
                    'group h-[66px] cursor-pointer text-sm',
                    activeRowId === row.id
                      ? 'bg-[#F4F7FF]'
                      : 'hover:bg-[#F4F7FF]'
                  )}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setRowMenu({
                      x: e.clientX,
                      y: e.clientY,
                      row,
                    });
                    setActiveRowId(row.id);
                  }}
                  onDoubleClick={() => {
                    setIsEdit(false); //  읽기 모드
                    setDataId(row.id);
                  }}
                >
                  <Td className="w-[64px] text-center">{row._no}</Td>
                  <Td className="w-[90px] px-3">{row.code}</Td>
                  <Td className="w-[140px] px-3">{row.name}</Td>
                  <Td className="w-[140px]">{row.sectorCategory}</Td>
                  <Td className="min-w-[260px]">{row.mainProductCategory}</Td>
                  <Td className="min-w-[240px]">{row.mainProduct}</Td>
                  <Td className="w-[160px]">{row.target}</Td>
                  <Td className="min-w-[180px]">
                    <a
                      href={
                        row.referenceUrl.startsWith('http')
                          ? row.referenceUrl
                          : `https://${row.referenceUrl}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#4B5563] underline-offset-2 hover:underline"
                    >
                      {row.referenceUrl}
                    </a>
                  </Td>
                  <Td className="w-[120px] text-center">
                    <Image
                      src={row.logoImage ? row.logoImage : empty}
                      alt={`${row.name} logo`}
                      className="mx-auto h-[44px] w-[44px] rounded object-cover"
                      width={10}
                      height={10}
                    />
                  </Td>
                </tr>
              ))}

              {/* 하단 + 추가 행 (스샷 느낌) */}
              <tr>
                <Td className="flex w-[64px] items-center justify-center hover:bg-[#F4F7FF]">
                  <button
                    onClick={onAddRow}
                    className="flex h-full w-[28px] items-center justify-center rounded py-5 text-center text-3xl text-[#4676FB]"
                    aria-label="add row"
                  >
                    +
                  </button>
                </Td>
                <Td colSpan={8} />
              </tr>
            </tbody>
          </table>

          {idMenu && (
            <IdSortMenu
              x={idMenu.x}
              y={idMenu.y}
              onClose={() => setIdMenu(null)}
              orderBy={orderBy}
              setOrderBy={setOrderBy}
            />
          )}
          {rowMenu && (
            <FieldActionMenu
              x={rowMenu.x}
              y={rowMenu.y}
              items={getFieldMenuItems(rowMenu.row)}
              onClose={() => {
                setRowMenu(null);
                setActiveRowId(null);
              }}
              position="fixed"
            />
          )}
        </div>

        {/* 우클릭 -> 편집모드 */}
        {dataId && (
          <DataDetailModal
            row={rowItem}
            dataId={dataId}
            isEdit={isEdit}
            onClose={() => {
              setIsEdit(false);
              setDataId(null);
              setActiveRowId(null); // ui용
            }}
            currentIndex={currentIndex}
            totalLength={rows.length}
            lastIndex={lastIndex}
            onPrev={handlePrev}
            onNext={handleNext}
            isFirst={isFirst}
            isLast={isLast}
          />
        )}
      </div>
    </>
  );
};
export default GridTable;
