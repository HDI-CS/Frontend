import { UserType } from '@/src/schemas/auth';
import { getEvaluationFolders } from '@/src/services/evaluation';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

export const useEvaluationFolders = (type: UserType) => {
  return useQuery({
    queryKey: ['evaluation-folders', type],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, type] = queryKey as ['evaluation-folders', UserType];
      return getEvaluationFolders(type);
    },
  });
};
