import clsx from 'clsx';

const Td = ({
  className,
  colSpan,
  children,
}: {
  className?: string;
  colSpan?: number;
  children?: React.ReactNode;
}) => {
  return (
    <td
      colSpan={colSpan}
      className={clsx(
        'border-b border-[#EFEFEF] px-3 align-middle text-[#111827]',
        'border-r last:border-r-0',
        className
      )}
    >
      {children}
    </td>
  );
};
export default Td;
