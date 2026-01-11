import { SurveyCompletionStatus, SurveyProgress } from '@/types/survey';
import { WeightEvaluationCategory } from '@/types/weight-evaluation';

/**
 * 설문 문항 완료 여부 확인
 */
export const isSurveyQuestionsCompleted = (
  questionsAnswered: Record<string, number>,
  requiredQuestions: string[],
  qualitativeAnswer: string,
  minQualitativeLength: number = 200
): boolean => {
  const allQuestionsAnswered = requiredQuestions.every(
    (questionId) => questionsAnswered[questionId] !== undefined
  );
  const qualitativeValid = qualitativeAnswer.length >= minQualitativeLength;

  return allQuestionsAnswered && qualitativeValid;
};

/**
 * 가중치 평가 완료 여부 확인
 */
export const isWeightEvaluationCompleted = (
  categories: WeightEvaluationCategory[]
): boolean => {
  return categories.every((category) => {
    const total = Object.values(category.weights).reduce(
      (sum, weight) => sum + weight,
      0
    );
    return total === 100;
  });
};

/**
 * 전체 설문 완료 상태 계산
 */
export const calculateSurveyCompletionStatus = (
  questionsAnswered: Record<string, number>,
  requiredQuestions: string[],
  qualitativeAnswer: string,
  weightEvaluationCategories: WeightEvaluationCategory[]
): SurveyCompletionStatus => {
  const surveyQuestionsCompleted = isSurveyQuestionsCompleted(
    questionsAnswered,
    requiredQuestions,
    qualitativeAnswer
  );

  const weightEvaluationCompleted = isWeightEvaluationCompleted(
    weightEvaluationCategories
  );

  const isFullyCompleted =
    surveyQuestionsCompleted && weightEvaluationCompleted;

  return {
    surveyQuestionsCompleted,
    weightEvaluationCompleted,
    isFullyCompleted,
  };
};

/**
 * 설문 진행 상태를 로컬 스토리지에 저장
 */
export const saveSurveyProgress = (
  surveyId: string,
  progress: Partial<SurveyProgress>
): void => {
  try {
    const existingData = localStorage.getItem(`survey_progress_${surveyId}`);
    const currentProgress = existingData ? JSON.parse(existingData) : {};

    const updatedProgress = {
      ...currentProgress,
      ...progress,
      surveyId,
    };

    localStorage.setItem(
      `survey_progress_${surveyId}`,
      JSON.stringify(updatedProgress)
    );
  } catch (error) {
    console.error('설문 진행 상태 저장 실패:', error);
  }
};

/**
 * 설문 진행 상태를 로컬 스토리지에서 불러오기
 */
export const loadSurveyProgress = (surveyId: string): SurveyProgress | null => {
  try {
    const data = localStorage.getItem(`survey_progress_${surveyId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('설문 진행 상태 불러오기 실패:', error);
    return null;
  }
};

/**
 * 설문 완료 상태를 로컬 스토리지에서 삭제
 */
export const clearSurveyProgress = (surveyId: string): void => {
  try {
    localStorage.removeItem(`survey_progress_${surveyId}`);
  } catch (error) {
    console.error('설문 진행 상태 삭제 실패:', error);
  }
};

// 설문 관련 값만 초기화
export const clearSurveyProgressStorage = () => {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('survey_progress_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('설문 로컬스토리지 초기화 실패:', error);
  }
};
