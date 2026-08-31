import { datasetQueryKeys } from '@/src/queries/dataQuery';
import { updateDataset } from '@/src/services/data/common';
import { useImageVersionStore } from '@/src/store/imageVersionStore';
import { UpdateMutationInput } from '@/src/types/data/visual-data';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateDataset = () => {
  const queryClient = useQueryClient();
  const bumpImageVersion = useImageVersionStore((s) => s.bump);

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
        requestData: input.requestData ?? '',
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
        const uploads = [
          { file: detailFile, url: data.result?.detailUploadUrl },
          { file: frontFile, url: data.result?.frontUploadUrl },
          { file: sideFile, url: data.result?.sideUploadUrl },
          { file: side2File, url: data.result?.side2UploadUrl },
          { file: side3File, url: data.result?.side3UploadUrl },
        ];

        uploads.forEach(({ file, url }) => {
          if (file && url) {
            uploadTasks.push(fetch(url, { method: 'PUT', body: file }));
          }
        });
      }

      try {
        if (uploadTasks.length > 0) {
          const results = await Promise.all(uploadTasks);

          results.forEach((res) => {
            if (!res.ok) {
              throw new Error(`S3 upload failed: ${res.status}`);
            }
          });
          bumpImageVersion(variables.id);
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
