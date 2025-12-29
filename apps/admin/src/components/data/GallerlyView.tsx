'use client';
import empty from '@/public/data/EmptyIMg.svg';
import { DataItemWithIndex } from '@/src/features/data/DataYearPage';
import useGridManager from '@/src/hooks/useGridManager';
import { useAuthStore } from '@/src/store/authStore';
import clsx from 'clsx';
import Image from 'next/image';
import FieldActionMenu from '../FieldActionMenu';
import DataDetailModal from './DataDetailModal';

export default function GalleryView({
  rows,
  lastIndex,
  onAdd,
}: {
  rows: DataItemWithIndex[];
  lastIndex: number;
  onAdd: () => void;
}) {
  const { type } = useAuthStore();

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
  const rowItem = rows.find((r) => r.id === dataId);

  return (
    <div className="grid grid-cols-5 gap-4">
      {rows.map((row, index) => (
        <div
          key={row.id}
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
          <div className="h-35 flex items-stretch gap-2">
            <span className="w-[3.18px] rounded-full bg-[#E5E5E5]" />

            <Image
              src={row.logoImage ? row.logoImage : empty}
              alt={row.name}
              width={200}
              height={100}
              className="object-contain"
            />
          </div>

          {/* 정보 */}
          <InfoRow label="ID" value={row.code} />
          <InfoRow label="브랜드명" value={row.name} />
          <InfoRow label="부문·카테고리" value={row.sectorCategory} />
        </div>
      ))}

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
          items={getFieldMenuItems(rowMenu.row)}
          onClose={() => {
            setRowMenu(null);
            setActiveRowId(null);
          }}
          position="fixed"
        />
      )}
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
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-stretch gap-2">
      {/* 세로 막대 */}
      <span className="w-[3.18px] rounded-full bg-[#E5E5E5]" />

      {/* 내용 */}
      <div className="flex w-full justify-between py-1 text-[#3A3A49]">
        <span className="text-sm text-[#8D8D8D]">{label}</span>
        <span className="text-right">{value}</span>
      </div>
    </div>
  );
}
