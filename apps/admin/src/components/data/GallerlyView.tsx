'use client';
import {
  VisualDataItem,
  VisualDataItemWithUI,
} from '@/src/types/data/visual-data';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import FieldActionMenu, { FieldActionMenuItem } from '../FieldActionMenu';
import DataDetailModal from './DataDetailModal';

export default function GalleryView({
  items,
  onAdd,
}: {
  items: VisualDataItemWithUI[];
  onAdd: () => void;
}) {
  const [dataId, setDataId] = useState<number | null>(null);

  // Edit
  const [isEdit, setIsEdit] = useState(false);

  // 행(Field 액션용)
  const [rowMenu, setRowMenu] = useState<{
    x: number;
    y: number;
    row: VisualDataItem;
  } | null>(null);

  // UI : 클릭된 row 하이라이트
  const [activeRowId, setActiveRowId] = useState<number | null>(null);

  // row별 동작 정의
  const getFieldMenuItems = (row: VisualDataItem): FieldActionMenuItem[] => [
    {
      key: 'edit',
      label: 'edit field',
      onClick: () => {
        setIsEdit(true);
        setDataId(row.id);
      },
    },
    {
      key: 'duplicate',
      label: 'duplicate field',
      onClick: () => {
        console.log('duplicate field', row);
        // 서버에 먼저 요청 → 성공 시 데이터를 새롭게 받음
      },
    },
    {
      key: 'delete',
      label: 'delete field',
      variant: 'danger',
      onClick: () => {
        // 서버에 먼저 요청 → 성공 시 데이터를 새롭게 받음
      },
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {items.map((row, index) => (
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
          <div className="flex items-stretch gap-2">
            <span className="w-[3.18px] rounded-full bg-[#E5E5E5]" />

            <Image
              src={row.logoImage}
              alt={row.name}
              width={200}
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
          dataId={dataId}
          isEdit={isEdit}
          onClose={() => {
            setIsEdit(false);
            setDataId(null);
            setActiveRowId(null); // ui용
          }}
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
