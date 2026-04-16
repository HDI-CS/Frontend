import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface SortModalProps {
  sort: 'ASC' | 'DESC';
  setSort: (sort: 'ASC' | 'DESC') => void;
}

const SortModal = ({ sort, setSort }: SortModalProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-w-70 absolute right-0 top-8 z-10 flex flex-col gap-3 rounded border border-[#E9E9E7] bg-[#ffffff] p-3">
      <span className="text-start text-sm font-normal text-[#8D8D8D]">
        Sort by
      </span>
      <div className="flex flex-col gap-1">
        <div
          onClick={() => setOpen((prev) => !prev)}
          className="border-1 flex items-center justify-between border-[#E9E9E7] p-2"
        >
          {sort === 'ASC' ? 'sort First → Last' : 'sort Last → First'}
          <ChevronRight
            className={clsx(
              'h-4.5 w-4.5 text-[#D0D7DD] transition-transform',
              open && 'rotate-90'
            )}
          />
        </div>
        {open && (
          <div className="border-1 border-[#E9E9E7]">
            <div
              onClick={() => setSort('ASC')}
              className="px-4 py-2 text-start hover:bg-[#E9E9E7]"
            >
              sort First → Last
            </div>
            <div
              onClick={() => setSort('DESC')}
              className="px-4 py-2 text-start hover:bg-[#E9E9E7]"
            >
              sort Last → First
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortModal;
