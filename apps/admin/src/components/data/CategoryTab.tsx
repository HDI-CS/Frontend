'use client';
import clsx from 'clsx';

import { UserType } from '@/src/schemas/auth';
import { IndustryCategory } from '@/src/schemas/industry-data';
import { VisualCategory } from '@/src/schemas/visual-data';
import { useState } from 'react';
import ModalComponent from '../ModalComponent';

export interface CategoryTabItem {
  key: string;
  label: string;
}

interface CategoryTabProps {
  type: UserType;
  categories?: (VisualCategory | IndustryCategory)[];
  activeKey?: string;
  onChange?: (key: VisualCategory | IndustryCategory) => void;
  onAdd?: () => void;
  isLoading?: boolean;
}

const CategoryTab = ({
  activeKey,
  categories,
  onChange,
  isLoading,
}: CategoryTabProps) => {
  const [open, setOpen] = useState(false);
  if (isLoading) {
    const skeletonFactors = Array(2).fill(null);
    return (
      <div className="flex items-end gap-1">
        {skeletonFactors.map((_, index) => (
          <button
            key={index}
            className={clsx(
              'w-35 flex items-center gap-1 rounded-t-[4px] border border-b-0 border-[#E5E5E5] px-4 text-lg',
              'h-9 bg-[#F6F7F8] p-2 text-[#3A3A49] hover:bg-gray-200'
            )}
          >
            {''}
          </button>
        ))}
      </div>
    );
  }

  if (categories && onChange)
    return (
      <div className="flex items-end gap-1">
        {categories.map((cat) => {
          const isActive = activeKey === cat;
          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={clsx(
                'flex cursor-pointer items-center gap-1 rounded-t-[4px] border border-b-0 border-[#E5E5E5] px-4 text-lg',
                isActive
                  ? '-mb-px h-10 border-b-white bg-white p-2.5 font-bold text-[#4676FB]'
                  : 'h-9 bg-[#F6F7F8] p-2 text-[#3A3A49] hover:bg-gray-200'
              )}
            >
              {cat}
            </button>
          );
        })}
        {open && (
          <ModalComponent
            button="저장"
            title="카테고리"
            onClose={() => setOpen(false)}
            onSubmit={() => setOpen(false)}
          >
            카테고리
          </ModalComponent>
        )}
      </div>
    );
};
export default CategoryTab;
