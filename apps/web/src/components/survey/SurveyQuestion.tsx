import { clsx } from 'clsx';
import { useEffect, useMemo, useRef } from 'react';

import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface SurveyQuestionProps {
  questionId: string;
  question: string;
  questionNumber?: string;
  value?: number;
  onChange: (value: number) => void;
  onSave?: (questionId: string, value: number) => void;
  isSaving?: boolean;
  className?: string;
}

export default function SurveyQuestion({
  questionId,
  question,
  questionNumber,
  value,
  onChange,
  onSave,
  isSaving = false,
  className,
}: SurveyQuestionProps) {
  const radioRefs = useRef<(HTMLInputElement | null)[]>([]);

  const options = useMemo(
    () => [
      { value: 1, label: '전혀 동의하지 않음' },
      { value: 2, label: '동의하지 않음' },
      { value: 3, label: '보통' },
      { value: 4, label: '동의함' },
      { value: 5, label: '매우 동의함' },
    ],
    []
  );

  // 선택된 값이 변경될 때 해당 radio 버튼에 포커스
  useEffect(() => {
    if (value !== undefined) {
      const selectedIndex = options.findIndex(
        (option) => option.value === value
      );
      if (selectedIndex !== -1 && radioRefs.current[selectedIndex]) {
        radioRefs.current[selectedIndex]?.focus();
      }
    }
  }, [value, options]);

  // 값 변경 핸들러
  const handleValueChange = (newValue: number) => {
    onChange(newValue);
    // 저장 함수가 있으면 호출
    if (onSave) {
      onSave(questionId, newValue);
    }
  };

  // 탭으로 포커스가 들어올 때 선택된 항목으로 포커스 이동
  const handleFocus = (event: React.FocusEvent) => {
    if (value !== undefined) {
      const selectedIndex = options.findIndex(
        (option) => option.value === value
      );
      if (selectedIndex !== -1 && radioRefs.current[selectedIndex]) {
        // 현재 포커스된 요소가 선택된 요소가 아니라면 선택된 요소로 이동
        if (event.target !== radioRefs.current[selectedIndex]) {
          radioRefs.current[selectedIndex]?.focus();
        }
      }
    }
  };

  // 키보드 네비게이션 핸들러
  const handleKeyDown = (event: React.KeyboardEvent, currentIndex: number) => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        radioRefs.current[prevIndex]?.focus();
        handleValueChange(options[prevIndex]?.value || 1);
        break;
      }
      case 'ArrowRight':
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex =
          currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        radioRefs.current[nextIndex]?.focus();
        handleValueChange(options[nextIndex]?.value || 1);
        break;
      }
      case ' ': {
        event.preventDefault();
        handleValueChange(options[currentIndex]?.value || 1);
        break;
      }
    }
  };

  return (
    <div className={clsx('min-h-25 flex gap-4', className)}>
      {/* Vertical Bar */}
      <div className="w-1 flex-shrink-0 self-stretch rounded-full bg-[#DDE1FF]"></div>

      {/* Question Content */}
      <div className="flex-1 space-y-4 py-3">
        {/* Question with Number */}
        <div className="flex items-center gap-2">
          {questionNumber && (
            <p className="text-sm font-semibold text-gray-700">
              {questionNumber}.
            </p>
          )}
          <p
            id={`question-${questionId}`}
            className="text-sm font-medium leading-relaxed text-gray-900"
          >
            {question}
          </p>
          {/* 저장 상태 표시 */}
          {isSaving && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <LoadingSpinner size="sm" />
              <span>저장 중...</span>
            </div>
          )}
        </div>

        {/* Rating Scale */}
        <section
          className="flex items-end gap-4 px-4 md:gap-6"
          role="radiogroup"
          aria-labelledby={`question-${questionId}`}
        >
          {/* Left Label */}
          <span className="flex-shrink-0 text-[11px] text-gray-600 md:text-xs">
            전혀 동의하지 않음
          </span>

          {/* Scale Numbers */}
          <div className="flex items-center gap-6 sm:gap-8 md:gap-10">
            {options.map((option, index) => (
              <label
                key={option.value}
                className="flex cursor-pointer flex-col items-center gap-2"
              >
                <span
                  id={`option-${questionId}-${option.value}`}
                  className="text-xs font-medium text-gray-700"
                >
                  {option.value}
                </span>
                <input
                  ref={(el) => {
                    radioRefs.current[index] = el;
                  }}
                  type="radio"
                  name={questionId}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleValueChange(option.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={handleFocus}
                  tabIndex={0}
                  aria-describedby={`option-${questionId}-${option.value}`}
                  className={clsx(
                    'h-4 w-4 rounded-full border-2 border-gray-300',
                    'text-blue-600 transition-all duration-200',
                    'hover:scale-105 hover:border-blue-400',
                    value === option.value && 'border-blue-600 bg-blue-600'
                  )}
                />
              </label>
            ))}
          </div>

          {/* Right Label */}
          <span className="flex-shrink-0 text-[11px] text-gray-600 md:text-xs">
            매우 동의함
          </span>
        </section>
      </div>
    </div>
  );
}
