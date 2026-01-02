import { datasetQueryKeys } from '@/src/queries/dataQuery';
import { UpdateVisualDatasetRequest } from '@/src/schemas/visual-data';
import { updateVisualDataset } from '@/src/services/data/visual';

import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateDatasetVariables {
  id: number;
  requestData: UpdateVisualDatasetRequest;
  logoFile?: File | null;
}

export const useUpdateDataset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, requestData, logoFile }: UpdateDatasetVariables) =>
      updateVisualDataset({
        id,

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
