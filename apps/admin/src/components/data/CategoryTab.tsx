import clsx from 'clsx';

import { CategoryByType } from '@/src/features/data/DataYearPage';
import { UserType } from '@/src/schemas/auth';

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
  if (isLoading) {
    const skeletonFactors = Array(2).fill(null);
    return (
      <div className="flex items-end gap-1">
        {skeletonFactors.map((_, index) => (
          <button
            key={index}
            className={clsx(
              'w-35 flex items-center gap-1 rounded-t-[4px] border border-b-0 border-[#E5E5E5] px-4',
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
                'flex cursor-pointer items-center gap-1 rounded-t-[4px] border border-b-0 border-[#E5E5E5] px-4',
                isActive
                  ? 'text-bold18 -mb-px h-10 border-b-white bg-white p-2.5 text-[#4676FB] max-xl:text-[5px]'
                  : 'text-regular18 h-9 bg-[#F6F7F8] p-2 text-[#3A3A49] hover:bg-gray-200'
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>
    );
};
export default CategoryTab;
