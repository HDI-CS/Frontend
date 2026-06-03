'use client';

import { clsx } from 'clsx';
import { useParams, useRouter } from 'next/navigation';

interface SurveyNavigationWithArrowsProps {
  onComplete?: () => void;
  canComplete?: boolean;
  isSubmitted?: boolean;
  onTempSave?: () => void;
  canTempSave?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  currentStep?: number;
  totalSteps?: number;
  isLoading?: boolean;
  isTempSaving?: boolean;
  className?: string;
}

export default function SurveyNavigationWithArrows({
  onComplete,
  canComplete = false,
  isSubmitted = false,
  onTempSave,
  canTempSave = false,
  onPrevious,
  onNext,
  canGoPrevious = false,
  canGoNext = false,
  // currentStep = 1,
  // totalSteps = 1,
  isLoading = false,
  isTempSaving = false,
  className,
}: SurveyNavigationWithArrowsProps) {
  const router = useRouter();
  const { type } = useParams();

  const handleBackToList = () => {
    const surveyType = (type as string).toLowerCase();
    router.push(`/inbox/${surveyType}`);
  };

  const isAnyLoading = isLoading || isTempSaving;

  // 버튼 텍스트 결정
  const buttonLabel = () => {
    if (isLoading) return '제출 중...';
    if (isTempSaving) return '저장 중...';
    if (isSubmitted) return '제출완료';
    if (canComplete) return '평가제출';
    if (canTempSave) return '임시저장';
    return '설문 중';
  };

  // 버튼 클릭 핸들러 결정
  const buttonHandler =
    isAnyLoading || isSubmitted
      ? undefined
      : canComplete
        ? onComplete
        : onTempSave;

  // 버튼 비활성 조건
  const isButtonDisabled =
    isAnyLoading || isSubmitted || (!canTempSave && !canComplete);

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

          {/* 임시저장 / 평가제출 통합 버튼 */}
          <button
            onClick={buttonHandler}
            disabled={isButtonDisabled}
            className={clsx(
              'w-full whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-36 sm:px-4 lg:w-40 lg:px-5 xl:w-44 xl:px-6',
              {
                // 로딩 중
                'cursor-not-allowed bg-blue-400 text-white': isLoading,
                'cursor-not-allowed bg-amber-400 text-white': isTempSaving,
                // 전체 완료 → 파란색 제출 버튼
                'bg-blue-600 text-white hover:bg-blue-700':
                  canComplete && !isSubmitted,
                // 일부 응답 → amber 임시저장 버튼
                'bg-amber-500 text-white hover:bg-amber-600':
                  !canComplete && canTempSave && !isSubmitted,
                // 비활성
                'cursor-not-allowed bg-gray-300 text-gray-500':
                  (!canTempSave && !canComplete) || isSubmitted,
              }
            )}
          >
            <span className="flex items-center justify-center gap-2">
              {isAnyLoading && (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              )}
              {buttonLabel()}
            </span>
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
      {/* {totalSteps > 1 && (
        <div className="absolute left-1/2 top-[-50px] flex -translate-x-1/2 transform flex-col items-center gap-2">
        
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
          <div className="text-xs text-gray-500">
            {currentStep} / {totalSteps}
          </div>
        </div>
      )} */}
    </div>
  );
}
