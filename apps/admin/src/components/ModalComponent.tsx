import close from '@/public/data/close.svg';
import left from '@/public/evaluation/leftAllow.svg';
import leftDisabled from '@/public/evaluation/noLeft.svg';
import rightDisabled from '@/public/evaluation/noRight.svg';
import right from '@/public/evaluation/rightAllow.svg';
import clsx from 'clsx';
import Image from 'next/image';
interface BaseModalProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  subtitle?: string;
  button?: string;
  editBasicInfo?: boolean; // 높이 조절용
  allow?: boolean;

  onPrev?: () => void;
  onNext?: () => void;

  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;

  onClose: () => void;
  onSubmit: () => void;
}

const ModalComponent = ({
  title,
  children,
  maxWidth = 'max-w-[720px]',
  subtitle,
  button,
  editBasicInfo = false,
  allow = false,
  isPrevDisabled,
  isNextDisabled,

  onClose,
  onSubmit,
  onPrev,
  onNext,
}: BaseModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* wrapper : 모달 + 화살표 기준 */}
      <div className="relative flex items-center">
        {/* ⬅ LEFT ARROW */}
        {allow && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isPrevDisabled) onPrev?.();
            }}
            disabled={isPrevDisabled}
            className={clsx(
              'absolute -left-20 top-1/2 -translate-y-1/2 cursor-pointer rounded-full',
              isPrevDisabled ? 'cursor-not-allowed' : 'hover:bg-white/50'
            )}
          >
            <Image src={isPrevDisabled ? leftDisabled : left} alt="left" />
          </button>
        )}

        {/* MODAL */}

        <div
          className={clsx(
            `w-full ${maxWidth} flex min-w-[700px] flex-col gap-5 overflow-hidden rounded-lg bg-white p-8 text-[#2D2E2E]`,
            editBasicInfo ? ' ' : 'h-[800px]'
          )}
        >
          {/* Header */}
          <div className="border-b-1 flex items-start justify-between border-[#E9E9E7] py-3">
            <div className="flex flex-col gap-1">
              {subtitle && (
                <span className="text-base font-normal">{subtitle}</span>
              )}
              <span className="text-[32px] font-semibold">{title}</span>
            </div>
            <Image
              src={close}
              alt="close"
              onClick={onClose}
              width={32}
              height={32}
              className="cursor-pointer hover:opacity-60"
            />
          </div>

          {/* Body */}
          <div className="overflow-y-auto">{children}</div>
          {button && (
            <div onClick={onSubmit} className="flex justify-center">
              {/* button */}
              <span className="cursor-pointer rounded bg-[#4676FB] px-7 py-2 text-[#ffffff] hover:opacity-80">
                {button}
              </span>
            </div>
          )}
        </div>
        {/* RIGHT ARROW */}
        {allow && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isNextDisabled) onNext?.();
            }}
            disabled={isNextDisabled}
            className={clsx(
              '-right-19.5 absolute top-1/2 -translate-y-1/2 cursor-pointer rounded-full',
              isNextDisabled
                ? 'cursor-not-allowed opacity-40'
                : 'hover:bg-white/50'
            )}
          >
            <Image src={isNextDisabled ? rightDisabled : right} alt="right" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ModalComponent;
