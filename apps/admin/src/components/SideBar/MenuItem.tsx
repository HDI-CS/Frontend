import { truncateText } from '@/src/utils/truncateText';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';

const MenuItem = ({
  label,
  open,
  isBold = false,
  children,
  onClick,
  active,
}: {
  label: string;
  isBold?: boolean;
  open?: boolean;
  active?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div className="flex flex-col">
      <div
        onClick={onClick}
        className={clsx(
          'text-neutral-regularBlack text-regular16 flex cursor-pointer items-center gap-1 px-3 py-2.5',
          active && 'bg-[#4676FB] text-white',
          isBold ? 'text-bold16 ': 'text-regular16 '
        )}
      >
        <ChevronRight
          className={clsx(
            'h-4 w-4 text-[#4676FB] transition-transform',
            open && 'rotate-90',
            active && 'text-[#ffffff]'
          )}
        />
        {truncateText(label, 8)}
      </div>

      {open && <div className="mt-1 flex flex-col gap-1 pl-4">{children}</div>}
    </div>
  );
};

export default MenuItem;
