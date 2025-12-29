import { datasetQueryKeys } from '@/src/queries/dataQuery';
import { UserType } from '@/src/schemas/auth';
import { UpdateDatasetRequest } from '@/src/schemas/data';
import { updateDataset } from '@/src/services/data';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseUpdateDatasetParams {
  type: UserType;
}

interface UpdateDatasetVariables {
  id: number;
  requestData: UpdateDatasetRequest;
  logoFile?: File | null;
}

export const useUpdateDataset = ({ type }: UseUpdateDatasetParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, requestData, logoFile }: UpdateDatasetVariables) =>
      updateDataset({
        id,
        type,
        requestData,
        logoFile: logoFile ? logoFile : null,
      }),

    onSuccess: async (data, variables) => {
      const { logoFile } = variables;

      // 새 이미지 없는 경우 → 종료
      if (!logoFile || !data.result.uploadUrl) {
        queryClient.invalidateQueries({
          queryKey: datasetQueryKeys.lists(),
        });
        return;
      }

      try {
        const uploadRes = await fetch(data.result.uploadUrl, {
          method: 'PUT',
          body: logoFile,
        });

        if (!uploadRes.ok) {
          throw new Error(`S3 upload failed: ${uploadRes.status}`);
        }

        queryClient.invalidateQueries({
          queryKey: datasetQueryKeys.lists(),
        });
      } catch (e) {
        console.error('S3 upload failed after update', e);
      }
    },

    onError: (error) => {
      console.error('Update dataset failed', error);
    },
  });
};
