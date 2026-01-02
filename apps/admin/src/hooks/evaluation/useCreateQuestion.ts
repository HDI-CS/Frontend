import { evaluationQueryKeys } from '@/src/queries/evaluationQuery';
import { UserType } from '@/src/schemas/auth';
import { SurveyQuestionByTypeList } from '@/src/schemas/survey';
import { createEvaluationQuestion } from '@/src/services/evaluation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateQuestion = (type: UserType, yearId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SurveyQuestionByTypeList) =>
      createEvaluationQuestion(type, yearId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: evaluationQueryKeys.listByYear(type!, yearId),
      });
    },
  });
};
