import clsx from 'clsx';

const Th = ({
  className,
  children,
  onContextMenu,
}: {
  className?: string;
  children: React.ReactNode;
  onContextMenu?: (e: React.MouseEvent<HTMLTableCellElement>) => void;
}) => {
  return (
    <th
      onContextMenu={onContextMenu}
      className={clsx(
        'border-b border-[#E9E9E7] px-3 py-2 font-medium',
        // 세로 줄(엑셀 느낌)
        'border-r last:border-r-0',
        onContextMenu && 'cursor-context-menu', // 좌클릭 UX 힌트
        className
      )}
    >
      {children}
    </th>
  );
};

export default Th;
