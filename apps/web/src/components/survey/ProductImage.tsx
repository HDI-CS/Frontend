import { UserType } from '@/schemas/auth';
import { clsx } from 'clsx';
import Image from 'next/image';

interface ProductImageProps {
  type: UserType;
  imagePath: string;
  label?: string;
  className?: string;
  imageClassName?: string;
}

export default function ProductImage({
  type,
  imagePath,
  label,
  className,
  imageClassName,
}: ProductImageProps) {
  return (
    <div className={clsx('flex w-full gap-4', className)}>
      {/* Vertical Bar */}
      <div className="w-1 flex-shrink-0 self-stretch rounded-full bg-blue-50"></div>

      {/* Image Content */}
      <div className={clsx('flex-1 space-y-3', type == 'VISUAL' && 'px-34')}>
        {/* Product Image */}
        <div
          className={clsx('w-full overflow-hidden rounded-lg', imageClassName)}
        >
          <Image
            src={imagePath}
            alt={label || '제품 이미지'}
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
