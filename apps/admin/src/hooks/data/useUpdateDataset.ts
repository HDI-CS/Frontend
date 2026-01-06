import { datasetQueryKeys } from '@/src/queries/dataQuery';
import { updateDataset } from '@/src/services/data/common';
import { UpdateMutationInput } from '@/src/types/data/visual-data';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateDataset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateMutationInput) => {
      if (input.type === 'VISUAL') {
        return updateDataset({
          type: 'VISUAL',
          id: input.id,
          requestData: input.requestData,
          logoFile: input.logoFile ? input.logoFile : null,
        });
      }

      return updateDataset({
        type: 'INDUSTRY',
        id: input.id,
        requestData: input.requestData,
        detailFile: input.detailFile,
        frontFile: input.frontFile,
        sideFile: input.sideFile,
      });
    },

    onSuccess: async (data, variables) => {
      const { type, logoFile, detailFile, frontFile, sideFile } = variables;
      const uploadTasks: Promise<Response>[] = [];
      /** VISUAL */
      if (type === 'VISUAL') {
        const uploadUrl = data.result?.uploadUrl;

        if (logoFile && uploadUrl) {
          uploadTasks.push(
            fetch(uploadUrl, {
              method: 'PUT',
              body: logoFile,
            })
          );
        }
      }

      /** INDUSTRY */
      if (type === 'INDUSTRY') {
        const { detailUploadUrl, frontUploadUrl, sideUploadUrl } =
          data.result ?? {};

        if (detailFile && detailUploadUrl) {
          uploadTasks.push(
            fetch(detailUploadUrl, { method: 'PUT', body: detailFile })
          );
        }

        if (frontFile && frontUploadUrl) {
          uploadTasks.push(
            fetch(frontUploadUrl, { method: 'PUT', body: frontFile })
          );
        }

        if (sideFile && sideUploadUrl) {
          uploadTasks.push(
            fetch(sideUploadUrl, { method: 'PUT', body: sideFile })
          );
        }
      }

      try {
        if (uploadTasks.length > 0) {
          const results = await Promise.all(uploadTasks);

          results.forEach((res) => {
            if (!res.ok) {
              throw new Error(`S3 upload failed: ${res.status}`);
            }
          });
        }
      } catch (e) {
        console.error('S3 upload failed after update', e);
      } finally {
        queryClient.invalidateQueries({
          queryKey: datasetQueryKeys.lists(),
        });
      }
    },

    onError: (error) => {
      console.error('Update dataset failed', error);
    },
  });
};
