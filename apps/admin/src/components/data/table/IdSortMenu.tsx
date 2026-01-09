import { useEffect } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  orderBy: 'first' | 'last';
  setOrderBy: (order: 'first' | 'last') => void;
}

const IdSortMenu = ({
  x,
  y,
  onClose,
  setOrderBy,
  orderBy,
}: ContextMenuProps) => {
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [onClose]);

  return (
    <div
      className="fixed z-50 w-44 border border-[#E5E5E5] bg-white text-sm shadow-lg"
      style={{ top: y, left: x }}
    >
      <button
        onClick={() => {
          setOrderBy('first');
          console.log(orderBy);
        }}
        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
      >
        sort First → Last
      </button>
      <button
        onClick={() => {
          setOrderBy('last');
          console.log(orderBy);
        }}
        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
      >
        sort Last → First
      </button>
    </div>
  );
};

export default IdSortMenu;
