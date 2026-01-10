import { CategoryByType } from '@/src/features/data/DataYearPage';
import useGridManager, { SortType } from '@/src/hooks/useGridManager';
import { UserType } from '@/src/schemas/auth';
import { IndustryCategory } from '@/src/schemas/industry-data';
import { VisualCategory } from '@/src/schemas/visual-data';
import { useSearchStore } from '@/src/store/searchStore';
import { ColumnDef, VisualRow, WithIndex } from '@/src/types/data/visual-data';
import clsx from 'clsx';
import FieldActionMenu from '../FieldActionMenu';
import DataDetailModal from './DataDetailModal';
import IdSortMenu from './table/IdSortMenu';
import Td from './table/Td';
import Th from './table/Th';

interface GridTableProps<T extends { id: number }, TType extends UserType> {
  type: UserType;
  rows: WithIndex<T>[];
  columns: ColumnDef<WithIndex<T>>[];
  lastIndex: number;
  orderBy: 'ASC' | 'DESC';
  activeCategory: CategoryByType[TType] | null;
  setSortType: (sortType: SortType) => void;
  setOrderBy: (sort: 'ASC' | 'DESC') => void;
  onAddRow: () => void;
}

const typeMapper = {
  code: 'ID',
  companyName: 'COMPANY',
  productName: 'PRODUCT',
  modelName: 'MODEL',

  name: 'NAME',
  sectorCategory: 'SECTOR',
  mainProduct: 'MAINPRODUCT',
  mainProductCategory: 'MAINCATEGORY',
} as const;

type SortableKey = keyof typeof typeMapper;

const isSortableKey = (key: string): key is SortableKey => {
  return key in typeMapper;
};

const GridTable = <T extends { id: number }, TType extends UserType>({
  type,
  rows,
  columns,
  onAddRow,
  orderBy,
  setOrderBy,
  setSortType,
  lastIndex,
  activeCategory,
}: GridTableProps<T, TType>) => {
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

  const activeIndex = useSearchStore((s) => s.activeIndex);

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

  return (
    <>
      <div className="border border-t-0 border-[#E5E5E5] bg-white p-2">
        {/* 테이블 스크롤 영역 */}
        <div className="max-h-[680px] overflow-auto">
          <table className="min-w-max border-separate border-spacing-0 whitespace-nowrap">
            {/* 헤더 */}
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="text-left text-sm font-light text-[#8D8D8D]">
                {columns.map((col) => (
                  <Th
                    key={col.key}
                    className={col.thClassName}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (isSortableKey(col.key)) {
                        setSortType(typeMapper[col.key]);
                        setIdMenu({
                          x: e.clientX,
                          y: e.clientY,
                        });
                      }
                    }} 
                  >
                    {col.header}
                  </Th>
                ))}
              </tr>
            </thead>

            {/* 바디 */}
            <tbody>
              {rows.map((row, idx) => {
                const isActiveRow = idx + 1 === activeIndex;
                console.log(row)

                return (
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
                        rowId: row.id,
                      });
                      setActiveRowId(row.id);
                    }}
                    onDoubleClick={() => {
                      setIsEdit(false); //  읽기 모드
                      setDataId(row.id);
                    }}
                  >
                    {columns.map((col) => {
                      return (
                        <Td key={col.key} className={col.className}>
                          {col.cell(row, isActiveRow)}
                        </Td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* 하단 + 추가 행  */}
              <tr>
                <Td className="flex w-[64px] items-center justify-center hover:bg-[#F4F7FF]">
                  <button
                    onClick={onAddRow}
                    className="flex h-full cursor-pointer items-center justify-center rounded px-5 py-5 text-center text-3xl text-[#4676FB]"
                    aria-label="add row"
                  >
                    +
                  </button>
                </Td>
                <Td colSpan={8} />
              </tr>
            </tbody>
          </table>

          {/* id (Code) 정렬 드롭다운 */}
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
              items={getFieldMenuItems(rowMenu.rowId)}
              onClose={() => {
                setRowMenu(null);
                setActiveRowId(null);
              }}
              position="fixed"
            />
          )}
        </div>

        {/* 우클릭 -> 편집모드 */}
        {dataId &&
          (type === 'VISUAL'
            ? (() => {
                const visualRow = rows.find((r) => r.id === dataId) as
                  | WithIndex<VisualRow>
                  | undefined;

                if (!visualRow) return null;
                return (
                  <DataDetailModal<VisualRow, 'VISUAL'>
                    type={'VISUAL'}
                    row={visualRow}
                    dataId={dataId}
                    activeCategory={activeCategory as VisualCategory}
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
                );
              })()
            : (() => {
                const industryRow = rows.find((r) => r.id === dataId);

                if (!industryRow) return null;

                return (
                  <DataDetailModal
                    type={'INDUSTRY'}
                    row={industryRow}
                    dataId={dataId}
                    activeCategory={activeCategory as IndustryCategory}
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
                );
              })())}
      </div>
    </>
  );
};
export default GridTable;
