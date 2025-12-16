import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';

const MenuItem = ({
  label,
  open,
  children,
  onClick,
  active,
}: {
  label: string;
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
          'flex cursor-pointer items-center gap-1 px-3 py-2 text-sm',
          active && 'bg-[#4676FB] text-white'
        )}
      >
        <ChevronRight
          className={clsx(
            'h-4 w-4 text-[#000000] transition-transform',
            open && 'rotate-90',
            active && 'text-[#ffffff]'
          )}
        />
        <span>{label}</span>
      </div>

      {open && <div className="mt-1 flex flex-col gap-1 pl-4">{children}</div>}
    </div>
  );
};

export default MenuItem;
