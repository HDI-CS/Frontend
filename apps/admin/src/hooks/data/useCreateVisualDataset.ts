import { datasetQueryKeys } from '@/src/queries/dataQuery';
import { UserType } from '@/src/schemas/auth';
import {
  CreateIndustrialDatasetRequest,
  UpdateIndustrialDatasetRequest,
} from '@/src/schemas/industry-data';
import {
  CreateVisualDatasetRequest,
  UpdateVisualDatasetRequest,
} from '@/src/schemas/visual-data';
import { createDataset } from '@/src/services/data/common';
import {
  CreateMutationInput,
  DatasetCacheItemByType,
  DatasetListCache,
  mapIndustrialDatasetItem,
  mapVisualDatasetItem,
} from '@/src/types/data/visual-data';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// 타입 매핑 테이블
export type DatasetInputByType = {
  VISUAL: UpdateVisualDatasetRequest & { id: number };
  INDUSTRY: UpdateIndustrialDatasetRequest & { id: number };
};

export type CreateRequestByType = {
  VISUAL: CreateVisualDatasetRequest;
  INDUSTRY: CreateIndustrialDatasetRequest;
};

export interface UseCreateDatasetParams {
  type: UserType;
  yearId: number;
}

export interface BaseDatasetItem {
  id: number;
  code: string;
  referenceUrl?: string;
}

// function toDatasetItem(
//   type: 'VISUAL',
//   input: DatasetInputByType['VISUAL']
// ): ReturnType<typeof mapVisualDatasetItem>;

// function toDatasetItem(
//   type: 'INDUSTRY',
//   input: DatasetInputByType['INDUSTRY']
// ): ReturnType<typeof mapIndustrialDatasetItem>;

function toDatasetItem(
  type: UserType,
  input: DatasetInputByType[keyof DatasetInputByType]
) {
  if (type === 'VISUAL') {
    return mapVisualDatasetItem(input as DatasetInputByType['VISUAL']);
  }

  if (type === 'INDUSTRY') {
    return mapIndustrialDatasetItem(input as DatasetInputByType['INDUSTRY']);
  }

  throw new Error('Unsupported dataset type');
}

export const useCreateDataset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMutationInput) => {
      if (input.type === 'VISUAL') {
        return createDataset({
          type: 'VISUAL',
          yearId: input.yearId,
          requestData: input.requestData,
        });
      }
      console.log('');
      return createDataset({
        type: 'INDUSTRY',
        yearId: input.yearId,
        requestData: input.requestData,
      });
    },

    // 1. Optimistic Update
    onMutate: async (input) => {
      const { type, yearId, categoryName, requestData } = input;

      const listQueryKey = datasetQueryKeys.listByYear(type, yearId);

      //  이전 데이터 백업 (rollback 용)
      const previousData =
        queryClient.getQueryData<
          DatasetListCache<DatasetCacheItemByType[typeof type]>
        >(listQueryKey);

      //  UI 즉시 반영
      queryClient.setQueryData<
        DatasetListCache<DatasetCacheItemByType[typeof type]>
      >(listQueryKey, (old) => {
        if (!old) return old;
        if (type === 'VISUAL') {
          return {
            ...old,
            result: old.result.map((category) =>
              category.categoryName === categoryName
                ? {
                    ...category,
                    data: [
                      toDatasetItem('VISUAL', {
                        ...(requestData as DatasetInputByType['VISUAL']),
                        id: Date.now(),
                      }),
                      ...category.data,
                    ],
                  }
                : category
            ),
          };
        }

        if (type === 'INDUSTRY') {
          return {
            ...old,
            result: old.result.map((category) =>
              category.categoryName === categoryName
                ? {
                    ...category,
                    data: [
                      toDatasetItem('INDUSTRY', {
                        ...(requestData as DatasetInputByType['INDUSTRY']),
                        id: Date.now(),
                      }),
                      ...category.data,
                    ],
                  }
                : category
            ),
          };
        }
      });

      // rollback 대비용 반환
      return { previousData };
    },

    // 3. 성공 시 이미지 s에 put
    onSuccess: async (data, variables) => {
      const { type, logoFile, detailFile, frontFile, sideFile } = variables;
      const uploadTasks: Promise<Response>[] = [];
      /** VISUAL */
      if (type === 'VISUAL' && 'uploadUrl' in data.result) {
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
      if (type === 'INDUSTRY' && 'detailUploadUrl' in data.result) {
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

    // 4. 성공/실패 상관없이 서버와 동기화
    onSettled: (_data, _error, input) => {
      queryClient.invalidateQueries({
        queryKey: datasetQueryKeys.listByYear(input.type, input.yearId),
      });
    },
  });
};
