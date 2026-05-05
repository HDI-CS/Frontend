'use client';

import { clsx } from 'clsx';
import { useParams, useRouter } from 'next/navigation';

interface SurveyNavigationWithArrowsProps {
  onComplete?: () => void;
  canComplete?: boolean;
  isSubmitted?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  currentStep?: number;
  totalSteps?: number;
  className?: string;
}

export default function SurveyNavigationWithArrows({
  onComplete,
  canComplete = false,
  isSubmitted = false,
  onPrevious,
  onNext,
  canGoPrevious = false,
  canGoNext = false,
  currentStep = 1,
  totalSteps = 1,
  className,
}: SurveyNavigationWithArrowsProps) {
  const router = useRouter();
  const { type } = useParams();

  const handleBackToList = () => {
    const surveyType = (type as string).toLowerCase();
    router.push(`/inbox/${surveyType}`);
  };

  return (
    <div
      className={clsx(
        'flex w-full max-w-full flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2 lg:gap-3 xl:gap-4',
        className
      )}
    >
      {/* 좌우 네비게이션 버튼 (모바일에서는 상단에 표시) */}
      <div className="flex w-full items-center justify-between gap-2 sm:contents sm:w-auto">
        {/* 이전 설문 버튼 */}
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={clsx(
            'flex shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
            'h-8 w-8 sm:h-9 sm:w-9 xl:h-10 xl:w-10',
            {
              'border-blue-500 bg-white text-blue-500 hover:border-blue-600 hover:bg-blue-50':
                canGoPrevious,
              'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300':
                !canGoPrevious,
            }
          )}
          title="이전 설문"
        >
          <svg
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 중앙 버튼들 */}
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-2 lg:gap-3 xl:gap-4">
          {/* 리스트로 돌아가기 버튼 */}
          <button
            onClick={handleBackToList}
            className="w-full whitespace-nowrap rounded-xl bg-slate-700 px-4 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-800 active:bg-slate-900 sm:w-36 sm:px-4 lg:w-40 lg:px-5 xl:w-44 xl:px-6"
          >
            리스트로 돌아가기
          </button>

          {/* 평가완료 버튼 */}
          <button
            onClick={onComplete}
            disabled={!canComplete}
            className={clsx(
              'w-full whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-36 sm:px-4 lg:w-40 lg:px-5 xl:w-44 xl:px-6',
              {
                'bg-blue-600 text-white': !isSubmitted,
                'cursor-not-allowed bg-gray-300 text-gray-500': isSubmitted,
                'bg-gray-300 text-gray-500': !canComplete,
              }
            )}
          >
            {canComplete ? '평가완료' : '설문중'}
          </button>
        </div>

        {/* 다음 설문 버튼 */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={clsx(
            'flex shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
            'h-8 w-8 sm:h-9 sm:w-9 xl:h-10 xl:w-10',
            {
              'border-blue-500 bg-white text-blue-500 hover:border-blue-600 hover:bg-blue-50':
                canGoNext,
              'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300':
                !canGoNext,
            }
          )}
          title="다음 설문"
        >
          <svg
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* 진행 상황 표시 및 현재 위치 정보 */}
      {totalSteps > 1 && (
        <div className="absolute left-1/2 top-[-50px] flex -translate-x-1/2 transform flex-col items-center gap-2">
          {/* 진행 상황 점들 */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={clsx(
                  'h-2 w-2 rounded-full transition-colors duration-200',
                  {
                    'bg-blue-500': index + 1 === currentStep,
                    'bg-gray-300': index + 1 !== currentStep,
                  }
                )}
              />
            ))}
          </div>
          {/* 현재 위치 텍스트 */}
          <div className="text-xs text-gray-500">
            {currentStep} / {totalSteps}
          </div>
        </div>
      )}
    </div>
  );
}
