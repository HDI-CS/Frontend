import { evaluationQueryKeys } from '@/src/queries/evaluationQuery';
import { UserType } from '@/src/schemas/auth';
import { EvaluationSurveyResponse } from '@/src/schemas/survey';
import { getEvaluationQuestion } from '@/src/services/evaluation';
import { useQuery } from '@tanstack/react-query';

export const useEvaluationQuestion = (type: UserType, yearId: number) => {
  return useQuery<EvaluationSurveyResponse>({
    queryKey: evaluationQueryKeys.listByYear(type!, yearId),
    queryFn: () => getEvaluationQuestion(type!, yearId), // enabled가 true일 때만 실행됨
    enabled: !!type && !!yearId,
  });
};
