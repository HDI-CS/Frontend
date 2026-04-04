'use client';
import empty from '@/public/data/EmptyIMg.svg';
import { GalleryFieldDef } from '@/src/features/data/uiDef';
import useGridManager from '@/src/hooks/useGridManager';
import { UserType } from '@/src/schemas/auth';
import { IndustryCategory } from '@/src/schemas/industry-data';
import { VisualCategory } from '@/src/schemas/visual-data';
import { BaseRow, VisualRow, WithIndex } from '@/src/types/data/visual-data';
import { truncateText } from '@/src/utils/truncateText';
import clsx from 'clsx';
import Image from 'next/image';
import FieldActionMenu from '../FieldActionMenu';
import DataDetailModal from './DataDetailModal';

interface GalleryViewProps<T extends BaseRow> {
  type: UserType;
  rows: WithIndex<T>[];
  galleryFields: GalleryFieldDef<WithIndex<T>>[];
  lastIndex: number;
  orderBy: 'ASC' | 'DESC';
  activeCategory: string;

  setOrderBy: (sort: 'ASC' | 'DESC') => void;
  onAdd: () => void;
}

const GalleryView = <T extends BaseRow>({
  type,
  rows,
  galleryFields,
  lastIndex,
  activeCategory,
  onAdd,
}: GalleryViewProps<T>) => {
  // const meta = type === 'VISUAL' ? rowMeta.VISUAL : rowMeta.INDUSTRY;
  const {
    dataId,
    activeRowId,
    // selectedRowId,
    isEdit,
    rowMenu,

    setDataId,
    setActiveRowId,
    setIsEdit,
    setRowMenu,
    // setSelectedRowId,
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
  // const rowItem = rows.find((r) => r.id === dataId);
  const InfoRow = ({ label, value }: { label: string; value: string }) => {
    return (
      <div className="flex items-center gap-2">
        <div key={label} className="flex h-7 items-stretch gap-2">
          <span className="w-[3.18px] rounded-full bg-[#E5E5E5]" />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-between">
          <p className="text-neutral-gray max-xl:font-regular max-xl:text-[12px] max-xl:leading-none">
            {label}
          </p>
          <p className="max-xl:text-[14px]"> {truncateText(value, 5)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      {rows.map((row, index) => {
        return (
          <div
            key={row.id}
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
            className={clsx(
              'relative flex flex-col gap-4 border border-[#E9E9E7] p-6 hover:bg-[#F4F7FF] hover:shadow-sm',
              activeRowId === row.id ? 'bg-[#F4F7FF]' : 'bg-white'
            )}
          >
            {/* 번호 */}
            <div className="border-b-1 left-3 top-2 border-[#E9E9E7] py-2 text-xl font-bold text-[#3A3A49]">
              {index + 1}
            </div>
            {/* 로고 */}
            {galleryFields.map((g) =>
              g.label === '로고 이미지' ? (
                <div key={g.label} className="h-35 flex items-stretch gap-2">
                  <span className="w-[3.18px] rounded-full bg-[#E5E5E5]" />

                  <Image
                    src={g.value(row) ? g.value(row) : empty}
                    alt="로고 이미지"
                    width={200}
                    height={100}
                    className="object-contain"
                  />
                </div>
              ) : (
                <InfoRow key={g.label} label={g.label} value={g.value(row)} />
              )
            )}

            {/* 정보 */}
            {/* <InfoRow label="ID" value={row.code} />
            <InfoRow label="브랜드명" value={row.name} />
            <InfoRow label="부문·카테고리" value={row.sectorCategory} /> */}
          </div>
        );
      })}

      {/* Add new field 카드 */}
      <button
        onClick={onAdd}
        className="min-h-95 flex flex-col items-center justify-center border border-[#E9E9E7] bg-white text-base font-normal text-[#4676FB] hover:bg-[#F4F7FF]"
      >
        <span>+</span>
        Add new field
      </button>
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
  );
};
export default GalleryView;
