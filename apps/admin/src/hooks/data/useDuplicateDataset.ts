import { datasetQueryKeys } from '@/src/queries/dataQuery';
import { UserType } from '@/src/schemas/auth';
import { duplicateDataset } from '@/src/services/data/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseDuplicateDatasetParams {
  type: UserType;
}

export const useDuplicateDataset = ({ type }: UseDuplicateDatasetParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => duplicateDataset({ ids, type }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: datasetQueryKeys.lists(),
      });
    },

    onError: (error) => {
      console.error('Duplicate dataset failed', error);
    },
  });
};
