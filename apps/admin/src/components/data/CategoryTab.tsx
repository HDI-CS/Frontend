'use client';
import clsx from 'clsx';

import plusIcon from '@/public/data/plusIcon.svg';
import Image from 'next/image';
import { useState } from 'react';
import ModalComponent from '../ModalComponent';

export interface CategoryTabItem {
  key: string;
  label: string;
}

interface CategoryTabProps {
  categories: CategoryTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  onAdd?: () => void;
}

const CategoryTab = ({ categories, activeKey, onChange }: CategoryTabProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-end gap-1">
      {categories.map((cat) => {
        const isActive = activeKey === cat.key;
        return (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            className={clsx(
              'flex items-center gap-1 rounded-t-[4px] border border-b-0 border-[#E5E5E5] px-4 text-lg',
              isActive
                ? '-mb-px h-10 border-b-white bg-white p-2.5 font-bold text-[#4676FB]'
                : 'h-9 bg-[#F6F7F8] p-2 text-[#3A3A49] hover:bg-gray-200'
            )}
          >
            {cat.label}
          </button>
        );
      })}
      <button
        onClick={() => setOpen(true)}
        className="flex h-[36px] items-center rounded-t-[4px] border border-b-0 border-[#E5E5E5] bg-[#F6F7F8] px-4 hover:bg-gray-200"
      >
        <Image src={plusIcon} alt="plus" width={14} height={14} />
      </button>
      {open && (
        <ModalComponent
          button="저장"
          title="카테고리"
          onClose={() => setOpen(false)}
        >
          카테고리
        </ModalComponent>
      )}
    </div>
  );
};
export default CategoryTab;
