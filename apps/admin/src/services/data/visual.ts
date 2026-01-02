import { apiClient } from '@/src/lib/axios';
import {
  CreateDatasetResponseSchema,
  CreateVisualDatasetRequest,
  CreateVisualDatasetRequestSchema,
  GetDetailVisualDataByCategoryResponseSchema,
  GetVisualDataByCategoryResponseSchema,
  GetVisualDataByKeywordyResponseSchema,
  UpdateDatasetResponseSchema,
  UpdateVisualDatasetRequest,
  UpdateVisualDatasetRequestSchema,
} from '@/src/schemas/visual-data';
import { safeZodParse } from '@/src/utils/zod';

export const getVisualDatasetsByYear = async (yearId: number) => {
  const res = await apiClient.get(
    `/api/v1/admin/visual/data/years/${yearId}/datasets`
  );
  return GetVisualDataByCategoryResponseSchema.parse(res.data);
};

export const getVisualDatasetDetail = async (datasetId: number) => {
  const res = await apiClient.get(
    `/api/v1/admin/visual/data/datasets/${datasetId}`
  );
  return GetDetailVisualDataByCategoryResponseSchema.parse(res.data);
};

// 생성
export const createVisualDataset = async ({
  yearId,
  requestData,
}: {
  yearId: number;
  requestData: CreateVisualDatasetRequest;
}) => {
  const validated = safeZodParse(
    CreateVisualDatasetRequestSchema,
    requestData,
    { operation: 'CreateDataset request validation' }
  );
  const res = await apiClient.post(
    `/api/v1/admin/visual/data/years/${yearId}/datasets`,
    validated
  );
  return CreateDatasetResponseSchema.parse(res.data);
};

// 검색 
export const searchVisualDataset = async ({
  keyword,
  category,
}: {
  keyword: string;
  category: string;
}) => {
  const response = await apiClient.get(
    `/api/v1/admin/visual/data/datasets/search`,
    {
      params: {
        q: keyword,
        category,
      },
    }
  );
  return GetVisualDataByKeywordyResponseSchema.parse(response.data);
};

// 수정
export const updateVisualDataset = async ({
  id,
  requestData,
  logoFile,
}: {
  id: number;
  requestData: UpdateVisualDatasetRequest;
  logoFile?: File | null;
}) => {
  const validated = safeZodParse(
    UpdateVisualDatasetRequestSchema,
    requestData,
    { operation: 'UpdateDataset request validation' }
  );

  const res = await apiClient.patch(
    `/api/v1/admin/visual/data/datasets/${id}`,
    validated,
    {
      params: logoFile === null ? { image: 'DELETE' } : {},
    }
  );

  return UpdateDatasetResponseSchema.parse(res.data);
};
