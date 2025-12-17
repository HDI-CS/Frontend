'use client';

import fileBlue from '@/public/common/folder/fileBlue.svg';
import fileWhite from '@/public/common/folder/fileWhite.svg';
import optionBlue from '@/public/common/folder/optionsBlue.svg';
import optionWhite from '@/public/common/folder/optionWhite.svg';

import clsx from 'clsx';
import Image from 'next/image';

interface FolderProps {
  name: string;
  modified: string;
  created: string;
  isManage?: boolean;
  onClick?: () => void;
}

const Folder = ({
  name,
  modified,
  created,
  isManage,
  onClick,
}: FolderProps) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'shadow-2xs group flex h-20 w-full cursor-pointer items-center justify-between border border-[#E9EFF4] p-6 shadow-black/10 transition-colors',
        'bg-white hover:border-[#FFFFFF] hover:bg-[#4676FB]'
      )}
    >
      <div className="gap-25 flex items-center">
        <div className="flex items-center gap-8">
          {/* 아이콘 */}
          <div className="relative">
            {/* 기본 (Blue) */}
            <Image
              src={fileBlue}
              alt="folder"
              width={24}
              height={24}
              className="absolute opacity-100 transition-opacity group-hover:opacity-0"
            />
            {/* Hover (White) */}
            <Image
              src={fileWhite}
              alt="folder"
              width={24}
              height={24}
              className="absolute opacity-0 transition-opacity group-hover:opacity-100"
            />
          </div>

          {/* 폴더명 */}
          <span className="w-25 text-[#4676FB] transition-colors group-hover:text-white">
            {name}
          </span>
        </div>

        <span className="flex items-center text-gray-400 transition-colors group-hover:text-white">
          {modified}
        </span>
        <span className="flex items-center text-gray-400 transition-colors group-hover:text-white">
          {created}
        </span>
      </div>

      {/* 옵션 아이콘 */}
      {isManage && (
        <div className="relative flex h-6 w-6 items-center">
          <Image
            src={optionBlue}
            alt="option"
            fill
            className="opacity-100 transition-opacity group-hover:opacity-0"
          />
          <Image
            src={optionWhite}
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
