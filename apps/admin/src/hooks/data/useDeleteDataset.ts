import { datasetQueryKeys } from '@/src/queries/dataQuery';
import { UserType } from '@/src/schemas/auth';
import { deleteDataset } from '@/src/services/data';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseDeleteDatasetParams {
  type: UserType;
}

export const useDeleteDataset = ({ type }: UseDeleteDatasetParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => deleteDataset({ ids, type }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: datasetQueryKeys.lists(),
      });
    },

    onError: (error) => {
      console.error('Delete dataset failed', error);
    },
  });
};
