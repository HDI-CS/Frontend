import { apiClient } from '@/src/lib/axios';
import {
  CreateIndustrialDatasetRequest,
  CreateIndustrialDatasetRequestSchema,
  GetDetailIndustrialDataByCategoryResponseSchema,
  GetIndustrialDataByCategoryResponseSchema,
  GetIndustrialDataByKeywordyResponseSchema,
  UpdateIndustrialDatasetRequest,
  UpdateIndustrialDatasetRequestSchema,
} from '@/src/schemas/industry-data';
import { CreateDatasetResponseSchema } from '@/src/schemas/visual-data';
import { safeZodParse } from '@/src/utils/zod';

export const getIndustrialDatasetsByYear = async (yearId: number) => {
  const res = await apiClient.get(
    `/api/v1/admin/industry/data/years/${yearId}/datasets`
  );
  return GetIndustrialDataByCategoryResponseSchema.parse(res.data);
};

export const getIndustrialDatasetDetail = async (datasetId: number) => {
  const res = await apiClient.get(
    `/api/v1/admin/industry/data/datasets/${datasetId}`
  );
  return GetDetailIndustrialDataByCategoryResponseSchema.parse(res.data);
};

export const createIndustrialDataset = async ({
  yearId,
  requestData,
}: {
  yearId: number;
  requestData: CreateIndustrialDatasetRequest;
}) => {
  const validated = safeZodParse(
    CreateIndustrialDatasetRequestSchema,
    requestData,
    { operation: 'I CreateDataset request validation' }
  );

  const res = await apiClient.post(
    `/api/v1/admin/industry/data/years/${yearId}/datasets`,
    validated
  );

  return CreateDatasetResponseSchema.parse(res.data);
};

// export const updateIndustrialDataset = async ({
//   id,
//   requestData,
//   detailFile,
//   frontFile,
//   sideFile,
// }: {
//   id: number;
//   requestData: UpdateIndustrialDatasetRequest;
//   detailFile?: File | null;
//   frontFile?: File | null;
//   sideFile?: File | null;
// }) => {
//   const validated = safeZodParse(
//     UpdateIndustrialDatasetRequestSchema,
//     requestData,
//     { operation: 'I UpdateDataset request validation' }
//   );

//   const res = await apiClient.patch(
//     `/api/v1/admin/industry/data/datasets/${id}`,
//     validated,
//     {
//       params: logoFile === null ? { image: 'DELETE' } : {},
//     }
//   );

//   return res.data;
// };

export const updateIndustrialDataset = async ({
  id,
  requestData,
  detailFile,
  frontFile,
  sideFile,
}: {
  id: number;
  requestData: UpdateIndustrialDatasetRequest;
  detailFile?: File | null;
  frontFile?: File | null;
  sideFile?: File | null;
}) => {
  const validated = safeZodParse(
    UpdateIndustrialDatasetRequestSchema,
    requestData,
    { operation: 'I UpdateDataset request validation' }
  );

  /**
   * 삭제 플래그 구성
   * - null  → 삭제 요청
   * - undefined → 변경 없음
   */
  const imagesToDelete: string[] = [];

  if (detailFile === null) imagesToDelete.push('DETAIL');
  if (frontFile === null) imagesToDelete.push('FRONT');
  if (sideFile === null) imagesToDelete.push('SIDE');

  const res = await apiClient.patch(
    `/api/v1/admin/industry/data/datasets/${id}`,
    validated,
    {
      params: imagesToDelete.length ? { image: imagesToDelete } : undefined,

      // 배열 쿼리 직렬화
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();

        if (Array.isArray(params.image)) {
          params.image.forEach((v: string) => {
            searchParams.append('image', v);
          });
        }

        return searchParams.toString();
      },
    }
  );

  /**
   * 기대 응답 형태:
   * {
   *   code: 200,
   *   result: {
   *     detailUploadUrl?: string;
   *     frontUploadUrl?: string;
   *     sideUploadUrl?: string;
   *   }
   * }
   */

  return res.data;
};

export const searchIndustrialDataset = async ({
  keyword,
  category,
}: {
  keyword: string;
  category?: string;
}) => {
  const response = await apiClient.get(
    `/api/v1/admin/industry/data/datasets/search`,
    {
      params: {
        q: keyword,
        category,
      },
    }
  );
  return GetIndustrialDataByKeywordyResponseSchema.parse(response.data);
};
