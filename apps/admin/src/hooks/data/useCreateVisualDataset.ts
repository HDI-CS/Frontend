import { datasetQueryKeys } from '@/src/queries/dataQuery';
import { UserType } from '@/src/schemas/auth';
import {
  CreateDatasetRequest,
  DataItem,
  GetDataByCategoryResponse,
  UpdateDatasetRequest,
} from '@/src/schemas/data';
import { createDataset } from '@/src/services/data';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseCreateDatasetParams {
  type: UserType;
  yearId: number;
}

export const useCreateDataset = ({ type, yearId }: UseCreateDatasetParams) => {
  const queryClient = useQueryClient();
  const listQueryKey = datasetQueryKeys.listByYear(type, yearId);

  const toDatasetItem = (
    input: UpdateDatasetRequest & { id: number }
  ): DataItem => ({
    id: input.id,
    code: input.code ?? '',
    name: input.name ?? '',
    sectorCategory: input.sectorCategory ?? '',
    mainProductCategory: input.mainProductCategory ?? '',
    mainProduct: input.mainProduct ?? '',
    target: input.target ?? '',
    referenceUrl: input.referenceUrl ?? '',
    logoImage: input.originalLogoImage ?? null, // 쿼리 값 매핑을 위해
  });

  return useMutation({
    mutationFn: (requestData: CreateDatasetRequest) =>
      createDataset({ type, yearId, requestData }),

    // 1. Optimistic Update
    onMutate: async (newItem) => {
      //  진행 중인 쿼리 중단
      await queryClient.cancelQueries({ queryKey: listQueryKey });

      //  이전 데이터 백업 (rollback 용)
      const previousData =
        queryClient.getQueryData<GetDataByCategoryResponse>(listQueryKey);

      //  UI 즉시 반영
      queryClient.setQueryData<GetDataByCategoryResponse>(
        listQueryKey,
        (old) => {
          if (!old) return old;

          return {
            ...old,
            result: old.result.map((category) =>
              category.categoryName === newItem.visualDataCategory
                ? {
                    ...category,
                    data: [
                      //  임시 데이터 먼저 추가
                      toDatasetItem({
                        ...newItem,
                        id: Date.now(), // 임시 ID
                      }),

                      ...category.data,
                    ],
                  }
                : category
            ),
          };
        }
      );

      // rollback 대비용 반환
      return { previousData };
    },

    //  2. 실패 시 롤백
    onError: (_err, _newItem, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(listQueryKey, context.previousData);
      }
    },

    // 3. 성공/실패 상관없이 서버와 동기화
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: datasetQueryKeys.lists(),
      });
    },
  });
};
