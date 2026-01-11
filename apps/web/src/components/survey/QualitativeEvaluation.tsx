import { clsx } from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { loadSurveyProgress } from '@/utils/survey';

interface QualitativeEvaluationProps {
  value?: string;
  surveyId: string;
  onChange: (value: string) => void;
  onSave?: (textResponse: string) => void;
  isSaving?: boolean;
  className?: string;
}

export default function QualitativeEvaluation({
  value = '',
  surveyId,
  onChange,
  onSave,
  isSaving = false,
  className,
}: QualitativeEvaluationProps) {
  const [localValue, setLocalValue] = useState(value);
  const [characterCount, setCharacterCount] = useState(value.length);
  const [isFocused, setIsFocused] = useState(false);
  const [hasUserInput, setHasUserInput] = useState(false);
  const [isComposing, setIsComposing] = useState(false); // 한글 입력 조합 중 상태
  const minCharacters = 300;
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxWaitTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 최대 대기 시간 타이머
  const compositionFallbackRef = useRef<NodeJS.Timeout | null>(null); // IME 조합 폴백 타이머
  const lastInputTimeRef = useRef<number>(0);
  const lastSavedValueRef = useRef<string>(value); // 마지막 저장된 값 추적
  const firstUnsavedChangeTimeRef = useRef<number | null>(null); // 첫 미저장 변경 시간
  const pendingValueRef = useRef<string>(localValue); // 저장 대기 중인 값
  const isMinimumMet = characterCount >= minCharacters;

  // 글자수가 300자 이하인 경우 서버에 요청은 하지 않지만 브라우저에는 남아있고
  // 새로 고침 시에도 값을 그대로 가져올 수 있도록
  useEffect(() => {
    const saved = loadSurveyProgress(surveyId);

    // 서버 값이 없을 때거나 localstorage 정성평가 글자수가 300 이하인 경우 localStorage 복원
    if (
      saved?.qualitativeAnswer &&
      value === '' &&
      !hasUserInput &&
      !isFocused &&
      saved.qualitativeAnswer.length < 300
    ) {
      setLocalValue(saved.qualitativeAnswer);
      setCharacterCount(saved.qualitativeAnswer.length);
      lastSavedValueRef.current = saved.qualitativeAnswer;
    }
  }, [surveyId, hasUserInput, value, isFocused]);

  // 서버 데이터가 변경되면 로컬 상태도 업데이트 (매우 안전한 조건으로만)
  useEffect(() => {
    // 다음 경우에는 외부 value를 절대 받지 않음:
    // 1. 사용자가 입력 중
    // 2. 저장 중
    // 3. 한글 조합 중 (IME 보호)
    // 4. 포커스되어 있는 경우 (사용자가 현재 편집 중)
    if (
      !hasUserInput &&
      !isSaving &&
      !isComposing &&
      !isFocused &&
      !isMinimumMet
    ) {
      setLocalValue(value);
      setCharacterCount(value.length);
      lastSavedValueRef.current = value;
    }
  }, [value, hasUserInput, isSaving, isComposing, isFocused, isMinimumMet]);

  // 실제 저장 실행 함수
  const executeSave = useCallback(
    (textValue: string) => {
      if (onSave && !isSaving && textValue !== lastSavedValueRef.current) {
        lastSavedValueRef.current = textValue;
        onSave(textValue);
        setHasUserInput(false); // 저장 후 입력 상태 초기화 -> "✓ 저장됨" 표시
        firstUnsavedChangeTimeRef.current = null; // 저장 후 초기화

        // 모든 타이머 정리
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
          debounceTimeoutRef.current = null;
        }
        if (maxWaitTimeoutRef.current) {
          clearTimeout(maxWaitTimeoutRef.current);
          maxWaitTimeoutRef.current = null;
        }
        if (compositionFallbackRef.current) {
          clearTimeout(compositionFallbackRef.current);
          compositionFallbackRef.current = null;
        }
      }
    },
    [onSave, isSaving]
  );

  // 디바운스된 저장 함수 - 한글 조합 중이 아닐 때만 동작
  const debouncedSave = useCallback(
    (textValue: string, forceImmediate = false) => {
      const now = Date.now();

      // 첫 변경 시간 기록
      if (firstUnsavedChangeTimeRef.current === null) {
        firstUnsavedChangeTimeRef.current = now;
      }

      // 즉시 저장이 요청되었거나, IME 조합 중이 아니고 포커스되어 있을 때
      const canSave = forceImmediate || (!isComposing && isFocused);

      if (!canSave) {
        return;
      }

      // 기존 디바운스 타이머 취소
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }

      // 최대 대기 시간(8초) 체크
      const maxWaitTime = 8000;
      const timeSinceFirstChange = firstUnsavedChangeTimeRef.current
        ? now - firstUnsavedChangeTimeRef.current
        : 0;

      if (forceImmediate || timeSinceFirstChange >= maxWaitTime) {
        // 즉시 저장 또는 최대 대기 시간 초과
        executeSave(textValue);
      } else {
        // 일반 디바운스 (2초)
        debounceTimeoutRef.current = setTimeout(() => {
          executeSave(textValue);
        }, 2000);

        // 최대 대기 시간 타이머 설정 (한 번만)
        if (!maxWaitTimeoutRef.current && firstUnsavedChangeTimeRef.current) {
          const remainingMaxWaitTime = maxWaitTime - timeSinceFirstChange;
          maxWaitTimeoutRef.current = setTimeout(() => {
            // 최대 대기 시간 도달 시 강제 저장
            // IME 조합 중이면 조합 상태를 해제하고 저장
            if (isComposing) {
              setIsComposing(false);
              // 폴백 타이머도 취소
              if (compositionFallbackRef.current) {
                clearTimeout(compositionFallbackRef.current);
                compositionFallbackRef.current = null;
              }
            }

            // 다음 프레임에 저장 실행
            requestAnimationFrame(() => {
              executeSave(pendingValueRef.current);
            });
            maxWaitTimeoutRef.current = null;
          }, remainingMaxWaitTime);
        }
      }
    },
    [executeSave, isComposing, isFocused]
  );

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (maxWaitTimeoutRef.current) {
        clearTimeout(maxWaitTimeoutRef.current);
      }
      if (compositionFallbackRef.current) {
        clearTimeout(compositionFallbackRef.current);
      }
    };
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // 로컬 상태는 항상 즉시 업데이트 (입력 반응성 유지)
    setLocalValue(newValue);
    setCharacterCount(newValue.length);
    setHasUserInput(true);
    lastInputTimeRef.current = Date.now();
    pendingValueRef.current = newValue; // 최신 값 저장

    // 부모 컴포넌트에 변경사항 전달
    onChange(newValue);

    // 한글 조합이 끝난 후에만 디바운스된 저장 함수 호출
    if (!isComposing && !isSaving) {
      debouncedSave(newValue);
    } else if (isComposing) {
      // 조합 중일 때는 폴백 타이머 설정
      // 3초 후에도 compositionend가 발생하지 않으면 강제로 저장
      if (compositionFallbackRef.current) {
        clearTimeout(compositionFallbackRef.current);
      }
      compositionFallbackRef.current = setTimeout(() => {
        // 조합 상태를 해제
        setIsComposing(false);

        // 다음 프레임에 저장 실행 (상태 업데이트 후)
        requestAnimationFrame(() => {
          const currentValue = pendingValueRef.current;
          if (!isSaving && currentValue !== lastSavedValueRef.current) {
            debouncedSave(currentValue);
          }
        });
        compositionFallbackRef.current = null;
      }, 3000); // 3초 폴백
    }
  };

  // 한글 입력 시작 (자음/모음 조합 시작)
  const handleCompositionStart = () => {
    setIsComposing(true);

    // IME 조합 시작 시 진행 중인 디바운스 타이머를 즉시 취소
    // 이렇게 하면 조합 중에 저장이 실행되는 것을 완전히 방지
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    // maxWait 타이머는 유지 (조합이 끝나면 저장될 수 있도록)
  };

  // 한글 입력 완료 (완성된 글자 입력 완료)
  const handleCompositionEnd = (
    e: React.CompositionEvent<HTMLTextAreaElement>
  ) => {
    const newValue = (e.target as HTMLTextAreaElement).value;

    // 폴백 타이머 취소 (정상적으로 compositionend가 발생했으므로)
    if (compositionFallbackRef.current) {
      clearTimeout(compositionFallbackRef.current);
      compositionFallbackRef.current = null;
    }

    // IME 조합 상태를 먼저 해제
    setIsComposing(false);

    // 조합이 완전히 끝난 후에만 저장 트리거
    // requestAnimationFrame을 사용하여 다음 프레임에 실행
    // 이렇게 하면 IME가 완전히 정리된 후 저장이 실행됨
    requestAnimationFrame(() => {
      if (!isSaving && newValue !== lastSavedValueRef.current) {
        debouncedSave(newValue);
      }
    });
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // 한글 조합 중에는 blur를 무시 (IME 보호)
    if (isComposing) {
      return;
    }

    setIsFocused(false);

    // 포커스를 잃을 때 진행 중인 모든 타이머를 취소
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current);
      maxWaitTimeoutRef.current = null;
    }
    if (compositionFallbackRef.current) {
      clearTimeout(compositionFallbackRef.current);
      compositionFallbackRef.current = null;
    }

    // 수정 사항이 있고, 저장 중이 아니며, 마지막 저장된 값과 다르면 즉시 저장
    if (
      hasUserInput &&
      onSave &&
      !isSaving &&
      localValue !== lastSavedValueRef.current
    ) {
      console.log(localValue);
      lastSavedValueRef.current = localValue;
      onSave(localValue); // 이게 주범

      setHasUserInput(false);
      firstUnsavedChangeTimeRef.current = null; // 초기화
    }
  };

  return (
    <div className={clsx('min-h-30 flex gap-4', className)}>
      {/* Vertical Bar */}
      <div className="w-1 flex-shrink-0 self-stretch rounded-full bg-gray-50"></div>

      {/* Content */}
      <div className="flex-1 space-y-3">
        {/* Title */}
        <section>
          <div className="flex items-center gap-2">
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              정성 평가
            </h3>
            {/* 저장 상태 표시 */}
            {isSaving && (
              <div className="animate-fade-in flex items-center gap-1 text-xs text-blue-600">
                <LoadingSpinner size="sm" />
                <span>저장 중...</span>
              </div>
            )}
            {hasUserInput && !isSaving && !isComposing && (
              <div className="animate-fade-in flex items-center gap-1 text-xs text-gray-500">
                <span>• 입력 중 (곧 자동 저장됩니다)</span>
              </div>
            )}
            {!hasUserInput &&
              !isSaving &&
              localValue !== '' &&
              isMinimumMet && (
                <div className="animate-fade-in flex items-center gap-1 text-xs text-green-600">
                  <span>✓ 저장됨</span>
                </div>
              )}
            {!hasUserInput &&
              !isSaving &&
              localValue !== '' &&
              !isMinimumMet && (
                <div className="animate-fade-in flex items-center gap-1 text-xs text-green-800">
                  <span>✓ 임시 저장됨 (300자 이상 시 최종 저장)</span>
                </div>
              )}
          </div>
          <p className="text-sm leading-relaxed text-gray-700">
            앞서 평가한 내용에 대한 전반적인 이유를 구체적으로 작성해 주세요.
          </p>
          <p className="text-xs text-gray-500">
            (디자인 8대요소 - 심미성, 조형성, 독창성, 사용성, 기능성, 윤리성,
            경제성, 목적성을 중심으로 300자 이상)
          </p>
        </section>

        {/* Text Input */}
        <div className="relative flex flex-col gap-2">
          <textarea
            id="qualitative-evaluation"
            value={localValue}
            onChange={handleTextChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="디자인 8대요소를 바탕으로 평가한 내용의 구체적인 이유를 작성해주세요."
            className={clsx(
              'min-h-30 w-full rounded-lg border px-4 py-3 text-sm',
              'placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-blue-500',
              'resize-none transition-all duration-200',
              isMinimumMet
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            )}
            rows={8}
          />
        </div>

        {/* Validation Message */}
        {characterCount > 0 && (
          <div className="space-y-1">
            {!isMinimumMet && characterCount > 0 && (
              <div className="animate-fade-in flex items-center gap-1 pl-1 text-xs text-orange-600">
                <div className="h-1 w-1 flex-shrink-0 rounded-full bg-orange-400"></div>
                <span>
                  최소 {minCharacters}자 이상 입력해주세요. (
                  {minCharacters - characterCount}자 더 필요)
                </span>
              </div>
            )}
            {isMinimumMet && (
              <div className="animate-fade-in flex items-center gap-2 text-xs text-green-600">
                <div className="h-1 w-1 flex-shrink-0 rounded-full bg-green-400"></div>
                <span>✓ 최소 글자 수를 충족했습니다.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
