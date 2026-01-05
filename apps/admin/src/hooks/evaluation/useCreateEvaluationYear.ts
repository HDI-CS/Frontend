import { datasetQueryKeys } from '@/src/queries/dataQuery';
import { evaluationQueryKeys } from '@/src/queries/evaluationQuery';
import { UserType } from '@/src/schemas/auth';
import {
  createEvaluation,
  createRoundEvaluation,
} from '@/src/services/evaluation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// 년도 평가 생성

export const useCreateEvaluationYear = (
  type: UserType,
  onSuccess?: (yearId: number) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createEvaluation(type),
    onSuccess: (data) => {
      const yearId = data.result.yearId;
      // 평가 관련
      queryClient.invalidateQueries({
        queryKey: evaluationQueryKeys.lists(type),
      });

      //  데이터 연도 목록도 같이
      queryClient.invalidateQueries({
        queryKey: datasetQueryKeys.lists(),
      });

      onSuccess?.(yearId);
    },
  });
};

// 차수 평가 생성

export const useCreateEvaluationRound = (type: UserType, yearId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createRoundEvaluation(type, yearId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: evaluationQueryKeys.lists(type!),
      });
    },
  });
};
