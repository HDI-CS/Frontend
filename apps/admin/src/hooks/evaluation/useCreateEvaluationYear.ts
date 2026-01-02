import { evaluationQueryKeys } from '@/src/queries/evaluationQuery';
import { UserType } from '@/src/schemas/auth';
import { createEvaluation } from '@/src/services/evaluation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateEvaluationYear = (
  type: UserType,
  onSuccess?: (yearId: number) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createEvaluation(type),
    onSuccess: (data) => {
      const yearId = data.result.yearId;
      queryClient.invalidateQueries({
        queryKey: evaluationQueryKeys.lists(type!),
      });

      onSuccess?.(yearId);
    },
  });
};
