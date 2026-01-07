'use client';

import fileBlue from '@/public/common/folder/fileBlue.svg';
import fileWhite from '@/public/common/folder/fileWhite.svg';
import optionBlue from '@/public/common/folder/optionsBlue.svg';
import optionWhite from '@/public/common/folder/optionWhite.svg';

import clsx from 'clsx';
import Image from 'next/image';
import { formatDate, formatDateTime } from '../utils/formatDateTime';
import FieldActionMenu, { FieldActionMenuItem } from './FieldActionMenu';

interface FolderProps {
  name: string;
  modified?: string;
  created?: string;

  startDate?: string;
  endDate?: string;

  isManage?: boolean;
  isPhase: boolean;
  isActive?: boolean;

  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
  onCloseMenu?: () => void;

  onClick?: () => void;
  getFieldMenuItems?: () => FieldActionMenuItem[];
}

const Folder = ({
  name,
  modified,
  created,
  startDate,
  endDate,
  isManage = false,
  isPhase,
  isActive,
  onClick,
  getFieldMenuItems,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
}: FolderProps) => {
  const menuItems = getFieldMenuItems?.() ?? [];

  return (
    <div
      onClick={onClick}
      className={clsx(
        'shadow-card group relative flex h-20 w-full cursor-pointer items-center justify-between border p-6 transition-colors duration-150',
        isActive || isMenuOpen
          ? 'border-white bg-[#4676FB]'
          : 'border-[#E9EFF4] bg-white hover:border-white hover:bg-[#4676FB]'
      )}
    >
      <div className="gap-25 flex items-center">
        <div className="flex items-center gap-8">
          {/*폴더 아이콘 */}
          <div className="relative h-6 w-6">
            <Image
              src={fileBlue}
              alt="folder"
              width={24}
              height={24}
              className={clsx(
                'absolute transition-opacity',
                isActive ? 'opacity-0' : 'opacity-100',
                !isActive && 'group-hover:opacity-0'
              )}
            />

            <Image
              src={fileWhite}
              alt="folder"
              width={24}
              height={24}
              className={clsx(
                'absolute transition-opacity',
                isActive ? 'opacity-100' : 'opacity-0',
                !isActive && 'group-hover:opacity-100'
              )}
            />
          </div>

          {/* 폴더명 */}
          <p
            className={clsx(
              'w-26 font-light transition-colors group-hover:text-white',
              isMenuOpen ? 'text-[#ffffff]' : 'text-[#4676FB]'
            )}
          >
            {name ?? ''}
          </p>
        </div>

        {modified && (
          <>
            {/* 수정 날짜 */}
            <p
              className={clsx(
                'flex items-center whitespace-nowrap text-base transition-colors group-hover:text-white',
                isMenuOpen ? 'text-[#ffffff]' : 'text-[#3A3A49]'
              )}
            >
              {formatDateTime(modified ?? '')}
            </p>
            {/* 생성 날짜 */}
            <span
              className={clsx(
                'flex items-center whitespace-nowrap text-base transition-colors group-hover:text-white',
                isMenuOpen ? 'text-[#ffffff]' : 'text-[#3A3A49]'
              )}
            >
              {' '}
              {formatDateTime(created ?? '')}
            </span>
          </>
        )}

        {/* Phase 기간 컬럼 */}
        <div>
          {isPhase && (
            <span
              className={clsx(
                'w-46 flex items-center gap-2 whitespace-nowrap text-base transition-colors group-hover:text-white',
                isMenuOpen ? 'text-[#ffffff]' : 'text-[#3A3A49]'
              )}
            >
              <div>{formatDate(startDate ?? '')}</div>
              {'-'}
              <div>{formatDate(endDate ?? '')}</div>
            </span>
          )}
          {/* Phase 아닐 경우 (정렬 유지용 더미) */}
          {!isPhase && <div className="w-46 h-1"></div>}
        </div>
        {}
      </div>

      {/* 옵션 아이콘 */}
      {isManage && onToggleMenu && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu();
          }}
          className="relative flex h-5 w-5 items-center"
        >
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
      {isMenuOpen && onCloseMenu && getFieldMenuItems && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-5 top-6 mt-2"
        >
          <FieldActionMenu
            items={menuItems}
            onClose={onCloseMenu}
            position="absolute"
          />
        </div>
      )}
    </div>
  );
};

export default Folder;
