'use client';

import { clsx } from 'clsx';
import { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={clsx(
        'bottom-35 min-h-15 fixed right-0 z-50 flex min-w-72 -translate-x-1/2 items-center justify-between gap-3 rounded-xl px-5 py-3 shadow-lg',
        type === 'error'
          ? 'border border-red-200 bg-red-50'
          : 'border border-green-200 bg-green-50'
      )}
    >
      <div className="flex items-center gap-3 rounded-xl">
        {/* 아이콘 */}
        <div
          className={clsx(
            'flex h-6 w-6 items-center justify-center rounded-full',
            type === 'error' ? 'bg-red-500' : 'bg-green-500'
          )}
        >
          {type === 'error' ? (
            <svg
              className="h-3.5 w-3.5 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 9v4M12 17h.01"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              className="h-3.5 w-3.5 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 13L9 17L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* 메시지 */}
        <span
          className={clsx(
            'text-sm font-medium',
            type === 'error' ? 'text-red-700' : 'text-green-700'
          )}
        >
          {message}
        </span>
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className={clsx(
          'ml-2 text-lg leading-none',
          type === 'error'
            ? 'text-red-400 hover:text-red-600'
            : 'text-green-400 hover:text-green-600'
        )}
      >
        ×
      </button>
    </div>
  );
}
