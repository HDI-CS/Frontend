'use client';
import clsx from 'clsx';

import { CategoryByType } from '@/src/features/data/DataYearPage';
import { UserType } from '@/src/schemas/auth';
import { useState } from 'react';
import ModalComponent from '../ModalComponent';

export interface CategoryTabItem {
  key: string;
  label: string;
}

interface CategoryTabProps<T extends UserType> {
  type: UserType;
  categories?: CategoryByType[T][];
  activeKey?: string;
  onChange?: (key: CategoryByType[T]) => void;
  onAdd?: () => void;
  isLoading?: boolean;
}

const CategoryTab = <T extends UserType>({
  activeKey,
  categories,
  onChange,
  isLoading,
}: CategoryTabProps<T>) => {
  const [open, setOpen] = useState(false);
  if (isLoading) {
    const skeletonFactors = Array(2).fill(null);
    return skeletonFactors.map((_, index) => (
      <button
        key={index}
        className={clsx(
          'flex w-35 items-center gap-1 rounded-t-[4px] border border-b-0 border-[#E5E5E5] px-4 text-lg',
          'h-9 bg-[#F6F7F8] p-2 text-[#3A3A49] hover:bg-gray-200'
        )}
      >
        {''}
      </button>
    ));
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
                'flex items-center gap-1 rounded-t-[4px] border border-b-0 border-[#E5E5E5] px-4 text-lg',
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
