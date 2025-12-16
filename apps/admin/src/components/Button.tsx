'use client';

import clsx from 'clsx';

interface ButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Button({
  text,
  onClick,
  className,
  type,
  disabled,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(className, 'rounded-lg')}
      type={type}
    >
      {text}
    </button>
  );
}
