import clsx from 'clsx';
import { ReactNode } from 'react';

interface LinedFieldProps {
  label: string;
  activeField: string | null;
  children: ReactNode;
  isImg?: boolean;
}

const LinedField = ({
  label,
  activeField,
  children,
  isImg,
}: LinedFieldProps) => {
  return (
    <li
      className={clsx(
        'border-l-3 mb-0 flex h-full w-full items-center py-1 pl-2',
        activeField === label ? 'border-[#4676FB]' : 'border-[#E9E9E7]',
        isImg ? 'min-h-90 flex' : 'min-h-10'
      )}
    >
      {isImg ? (
        <div className="flex h-full w-full flex-col">
          {children}
          <span
            className={clsx(
              'w-37 mb-0 text-base',
              activeField === label
                ? 'border-1 rounded border-[#4676FB] p-1 font-normal'
                : 'text-[#3A3A49]',
              isImg ? 'text-sm font-normal text-[#8D8D8D]' : ''
            )}
          >
            {label}
          </span>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-between">
          <span
            className={clsx(
              'w-37 text-bold16 min-w-37 mb-0',
              activeField === label
                ? 'rounded p-1 font-normal'
                : 'text-[#3A3A49]'
            )}
          >
            {label}
          </span>
          {children}
        </div>
      )}
    </li>
  );
};

export default LinedField;
