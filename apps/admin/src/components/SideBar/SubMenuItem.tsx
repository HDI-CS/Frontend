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
        'cursor-pointer px-4 py-1.5 text-sm',
        active ? 'bg-[#4676FB] text-white' : 'text-[#3A3A49] hover:bg-[#F4F7FF]'
      )}
    >
      {label}
    </div>
  );
};

export default SubMenuItem;
