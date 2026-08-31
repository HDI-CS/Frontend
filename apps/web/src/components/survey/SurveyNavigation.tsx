import { clsx } from 'clsx';

interface SurveyNavigationProps {
  onComplete?: () => void;
  canComplete?: boolean;
  className?: string;
}

export default function SurveyNavigation({
  onComplete,
  canComplete = false,
  className,
}: SurveyNavigationProps) {
  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <button
        onClick={onComplete}
        disabled={!canComplete}
        className={clsx('rounded-lg px-6 py-2 transition-colors duration-300', {
          'bg-blue-600 text-white hover:bg-blue-700': canComplete,
          'pointer-events-none bg-gray-300 text-gray-400': !canComplete,
        })}
      >
        평가 완료
      </button>
    </div>
  );
}
