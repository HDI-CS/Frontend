import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { UserType } from '../schemas/auth';
import { getEvaluationFolders } from '../services/evaluation';

export const useEvaluationFolders = (type: UserType) => {
  return useQuery({
    queryKey: ['evaluation-folders', type],
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, type] = queryKey as ['evaluation-folders', UserType];
      return getEvaluationFolders(type);
    },
  });
};
