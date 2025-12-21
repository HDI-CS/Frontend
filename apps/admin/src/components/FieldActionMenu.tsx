import clsx from 'clsx';
import { useEffect } from 'react';

// FieldActionMenu  ← 메뉴 UI만 담당
//  ├─ position="fixed"   → Grid (마우스 기준)
//  └─ position="absolute" → Folder (트리거 기준)

// GridTable
//  └─ 좌표 계산 (clientX / clientY)

// Folder
//  └─ relative 컨테이너 + absolute 메뉴
//
// A 폴더 옵션 클릭 → A 열림

// B 폴더 옵션 클릭 → A 닫히고 B만 열림

// 같은 폴더 다시 클릭 → 닫힘

// 바깥 클릭 → 닫힘

// 폴더 이동 시 → 메뉴 자동 닫힘

export interface FieldActionMenuItem {
  key: string;
  label: string;
  variant?: 'default' | 'danger';
  onClick: () => void;
}

interface FieldActionMenuProps {
  items: FieldActionMenuItem[];
  onClose: () => void;

  /* Grid용 (옵션) */
  x?: number;
  y?: number;

  /* Folder용 (옵션) */
  position?: 'fixed' | 'absolute';
}

const FieldActionMenu = ({
  x,
  y,
  items,
  onClose,
  position = 'absolute',
}: FieldActionMenuProps) => {
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [onClose]);

  return (
    <div
      className={clsx(
        'z-50 min-w-[200px] border border-[#E9E9E7] bg-white shadow-lg',
        position === 'fixed' ? 'fixed' : 'absolute'
      )}
      style={position === 'fixed' ? { top: y, left: x } : undefined}
      onClick={onClose}
    >
      {items.map((item, i) => (
        <button
          key={item.key}
          onClick={(e) => {
            e.stopPropagation();
            item.onClick();
            onClose();
          }}
          className={clsx(
            'mx-4 flex w-[calc(100%-32px)] py-2 text-left text-sm text-[#3A3A49] hover:opacity-45',
            item.variant === 'danger' && 'text-[#DA1E28]',
            i === items.length - 1 && 'border-t border-[#E4E2E4]'
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default FieldActionMenu;
