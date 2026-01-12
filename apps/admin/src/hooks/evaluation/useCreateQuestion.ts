import { evaluationQueryKeys } from '@/src/queries/evaluationQuery';
import { UserType } from '@/src/schemas/auth';
import { SurveyQuestionByTypeWithSampleTextArray } from '@/src/schemas/survey';
import { createEvaluationQuestion } from '@/src/services/evaluation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
interface createProps {
  body: SurveyQuestionByTypeWithSampleTextArray;
  yearId: number;
}
export const useCreateQuestion = (type: UserType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      body,
      yearId} : createProps
    ) => createEvaluationQuestion(type, yearId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: evaluationQueryKeys.lists(type!),
      });
    },
  });
};
