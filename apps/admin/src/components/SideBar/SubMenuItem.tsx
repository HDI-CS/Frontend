import { truncateText } from '@/src/utils/truncateText';
import clsx from 'clsx';

const SubMenuItem = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'text-regular16 h-9 cursor-pointer px-3 py-2.5 text-sm',
        active
          ? 'bg-[#4676FB] text-white'
          : 'text-neutral-regularBlack hover:bg-[#F4F7FF]'
      )}
    >
      {truncateText(label, 8)}
    </div>
  );
};

export default SubMenuItem;
