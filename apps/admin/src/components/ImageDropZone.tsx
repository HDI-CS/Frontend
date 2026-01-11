'use client';
import clsx from 'clsx';
import { DragEvent } from 'react';

interface ImageDropZoneProps {
  disabled?: boolean;
  onFileDrop: (file: File) => void;
  className?: string;
  children: React.ReactNode;
}

const ImageDropZone = ({
  disabled,
  onFileDrop,
  className,
  children,
}: ImageDropZoneProps) => {
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    onFileDrop(file);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={clsx(
        'relative',
        !disabled && 'transition hover:bg-black/5',
        className
      )}
    >
      {children}
    </div>
  );
};

export default ImageDropZone;
