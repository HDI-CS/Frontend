import { useCallback, useEffect, useMemo, useRef } from 'react';

interface UseDirtyGuardProps {
  answers: Record<string, number>;
  qualitativeAnswer: string;
  isSubmittedLocal: boolean;
}

export const useDirtyGuard = ({
  answers,
  qualitativeAnswer,
  isSubmittedLocal,
}: UseDirtyGuardProps) => {
  const initialAnswersRef = useRef<Record<string, number>>({});
  const initialQualitativeRef = useRef<string>('');

  const isDirty = useMemo(() => {
    if (isSubmittedLocal) return false;
    const answersChanged = Object.entries(answers).some(
      ([key, value]) => initialAnswersRef.current[key] !== value
    );
    return (
      answersChanged || qualitativeAnswer !== initialQualitativeRef.current
    );
  }, [answers, qualitativeAnswer, isSubmittedLocal]);

  // 브라우저 새로고침/탭 닫기 방지
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // 브라우저 뒤로가기 방지
  useEffect(() => {
    if (!isDirty) return;
    history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      const confirmed = window.confirm(
        '저장하지 않은 내용이 있습니다. 페이지를 떠나시겠습니까?'
      );
      if (confirmed) {
        history.back();
      } else {
        history.pushState(null, '', window.location.href);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isDirty]);

  // 화살표 네비게이션 래퍼
  const guardNavigation = useCallback(
    (callback: () => void) => {
      if (isDirty) {
        const confirmed = window.confirm(
          '저장하지 않은 내용이 있습니다. 페이지를 떠나시겠습니까?'
        );
        if (!confirmed) return;
      }
      callback();
    },
    [isDirty]
  );

  // 기준값 세팅 함수 (useEffect에서 서버 데이터 로드 후 호출)
  const setInitialValues = useCallback(
    (serverAnswers: Record<string, number>, serverQualitative: string) => {
      initialAnswersRef.current = serverAnswers;
      initialQualitativeRef.current = serverQualitative;
    },
    [] // ref는 불변이므로 의존성 없음
  );

  // 임시저장/최종제출 후 기준값 갱신
  const syncInitialValues = useCallback(
    (currentAnswers: Record<string, number>, currentQualitative: string) => {
      initialAnswersRef.current = { ...currentAnswers };
      initialQualitativeRef.current = currentQualitative;
    },
    []
  );

  return {
    isDirty,
    guardNavigation,
    setInitialValues,
    syncInitialValues,
  };
};
