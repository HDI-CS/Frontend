'use client';

import clsx from 'clsx';
import Image from 'next/image';

interface FolderProps {
  name: string;
  modified: string;
  created: string;
  isManage?: boolean;
}

const Folder = ({ name, modified, created, isManage }: FolderProps) => {
  return (
    <div
      className={clsx(
        'group flex w-full cursor-pointer justify-between border border-[#E9EFF4] p-6 shadow transition-colors',
        'bg-white hover:border-[#FFFFFF] hover:bg-[#4676FB]'
      )}
    >
      <div className="gap-25 flex">
        <div className="flex items-center gap-8">
          {/* 아이콘 */}
          <div className="relative h-6 w-6">
            {/* 기본 (Blue) */}
            <Image
              src="/folder/fileBlue.svg"
              alt="folder"
              width={24}
              height={24}
              className="absolute opacity-100 transition-opacity group-hover:opacity-0"
            />
            {/* Hover (White) */}
            <Image
              src="/folder/fileWhite.svg"
              alt="folder"
              width={24}
              height={24}
              className="absolute opacity-0 transition-opacity group-hover:opacity-100"
            />
          </div>

          {/* 폴더명 */}
          <span className="text-[#4676FB] transition-colors group-hover:text-white">
            {name}
          </span>
        </div>

        <span className="text-gray-400 transition-colors group-hover:text-white">
          {modified}
        </span>
        <span className="text-gray-400 transition-colors group-hover:text-white">
          {created}
        </span>
      </div>

      {/* 옵션 아이콘 */}
      {isManage && (
        <div className="relative h-6 w-6">
          <Image
            src="/folder/optionsBlue.svg"
            alt="option"
            fill
            className="opacity-100 transition-opacity group-hover:opacity-0"
          />
          <Image
            src="/folder/optionWhite.svg"
            alt="option"
            fill
            className="opacity-0 transition-opacity group-hover:opacity-100"
          />
        </div>
      )}
    </div>
  );
};

export default Folder;
