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
import {
  CreateDatasetResponseSchema,
  UpdateDatasetResponseSchema,
} from '@/src/schemas/visual-data';
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

export const updateIndustrialDataset = async ({
  id,
  requestData,
}: {
  id: number;
  requestData: UpdateIndustrialDatasetRequest;
}) => {
  const validated = safeZodParse(
    UpdateIndustrialDatasetRequestSchema,
    requestData,
    { operation: 'I UpdateDataset request validation' }
  );

  const res = await apiClient.patch(
    `/api/v1/admin/industry/data/datasets/${id}`,
    validated
  );

  return UpdateDatasetResponseSchema.parse(res.data);
};

export const searchIndustrialDataset = async ({
  keyword,
  category,
}: {
  keyword: string;
  category: string;
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
