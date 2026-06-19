interface ConfirmModalProps {
  show: boolean;
  message: string;
  type?: 'success' | 'warning';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function ConfirmModal({
  show,
  message,
  type = 'success',
  confirmLabel = '다음으로',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl bg-white px-8 py-10 shadow-xl">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${type === 'success' ? 'bg-[#3AC0A0]' : 'bg-[#FF616D]'}`}
        >
          {type === 'success' ? (
            <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13L9 17L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4M12 17h.01"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <p className="text-center text-xl font-bold text-gray-800">
          {message.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < message.split('\n').length - 1 && <br />}
            </span>
          ))}
        </p>{' '}
        <div className="flex w-full gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full rounded-xl bg-gray-300 py-4 text-base font-medium text-gray-700 transition-colors hover:bg-gray-400 active:bg-gray-500"
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={onConfirm}
            className="w-full rounded-xl bg-slate-700 py-4 text-base font-medium text-white transition-colors hover:bg-slate-800 active:bg-slate-900"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
