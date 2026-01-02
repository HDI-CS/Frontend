import { evaluationQueryKeys } from '@/src/queries/evaluationQuery';
import { UserType } from '@/src/schemas/auth';
import { EvaluationYearsResponse } from '@/src/schemas/survey';
import { getEvaluationFolders } from '@/src/services/evaluation';
import { useQuery } from '@tanstack/react-query';

export const useEvaluationYears = (type: UserType) => {
  return useQuery<EvaluationYearsResponse>({
    queryKey: evaluationQueryKeys.lists(type!),
    queryFn: () => getEvaluationFolders(type!), // enabled가 true일 때만 실행됨
    enabled: !!type,
  });
};
