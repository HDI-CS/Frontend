import useGridManager from '@/src/hooks/useGridManager';
import { UserType } from '@/src/schemas/auth';
import { ColumnDef, VisualRow, WithIndex } from '@/src/types/data/visual-data';
import clsx from 'clsx';
import FieldActionMenu from '../FieldActionMenu';
import DataDetailModal from './DataDetailModal';
import IdSortMenu from './table/IdSortMenu';
import Td from './table/Td';
import Th from './table/Th';

interface GridTableProps<T extends { id: number }> {
  type: UserType;
  rows: WithIndex<T>[];
  columns: ColumnDef<WithIndex<T>>[];
  lastIndex: number;
  orderBy: 'first' | 'last';
  activeCategory: string;
  setOrderBy: (sort: 'first' | 'last') => void;
  onAddRow: () => void;
}

const GridTable = <T extends { id: number }>({
  type,
  rows,
  columns,
  onAddRow,
  orderBy,
  setOrderBy,
  lastIndex,
  activeCategory,
}: GridTableProps<T>) => {
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

  return (
    <>
      <div className="border border-t-0 border-[#E5E5E5] bg-white p-2">
        {/* 테이블 스크롤 영역 */}
        <div className="max-h-[680px] overflow-auto">
          <table className="w-full border-separate border-spacing-0">
            {/* 헤더 */}
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border text-left text-sm font-light text-[#8D8D8D]">
                {columns.map((col) =>
                  col.key === 'code' ? (
                    <Th
                      key={col.key}
                      className={col.thClassName}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setIdMenu({
                          x: e.clientX,
                          y: e.clientY,
                        });
                      }}
                    >
                      {col.header}
                    </Th>
                  ) : (
                    <Th key={col.key} className={col.thClassName}>
                      {col.header}
                    </Th>
                  )
                )}
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
                      rowId: row.id,
                    });
                    setActiveRowId(row.id);
                  }}
                  onDoubleClick={() => {
                    setIsEdit(false); //  읽기 모드
                    setDataId(row.id);
                  }}
                >
                  {columns.map((col) => (
                    <Td key={col.key} className={col.className}>
                      {col.cell(row)}
                    </Td>
                  ))}
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
                    activeCategory={activeCategory}
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
                    activeCategory={activeCategory}
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
