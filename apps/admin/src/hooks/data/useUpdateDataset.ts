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
        side2File: input.side2File,
        side3File: input.side3File,
      });
    },

    onSuccess: async (data, variables) => {
      const {
        type,
        logoFile,
        detailFile,
        frontFile,
        sideFile,
        side2File,
        side3File,
      } = variables;
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
        const {
          detailUploadUrl,
          frontUploadUrl,
          sideUploadUrl,
          side2UploadUrl,
          side3UploadUrl,
        } = data.result ?? {};

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

        if (side2File && side2UploadUrl) {
          uploadTasks.push(
            fetch(side2UploadUrl, { method: 'PUT', body: side2File })
          );
        }

        if (side3File && side3UploadUrl) {
          uploadTasks.push(
            fetch(side3UploadUrl, { method: 'PUT', body: side3File })
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
