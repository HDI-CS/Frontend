import close from '@/public/data/close.svg';
import Image from 'next/image';
interface BaseModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  subtitle?: string;
  button: string;
}

const ModalComponent = ({
  title,
  onClose,
  children,
  maxWidth = 'max-w-[720px]',
  subtitle,
  button,
}: BaseModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidth} flex max-h-[80vh] flex-col gap-5 overflow-hidden rounded-lg bg-white p-8 text-[#2D2E2E]`}
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

        {/* button */}
        <div className="flex justify-center">
          <span className="cursor-pointer rounded bg-[#4676FB] px-7 py-2 text-[#ffffff] hover:opacity-80">
            {button}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
