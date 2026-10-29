import { apiClient } from '@/src/lib/axios';
import {
  CreateVisualDatasetRequest,
  CreateVisualDatasetRequestSchema,
  CreateVisualDatasetResponseSchema,
  GetDetailVisualDataByCategoryResponseSchema,
  GetVisualDataByCategoryResponseSchema,
  GetVisualDataByKeywordyResponseSchema,
  UpdateDatasetResponseSchema,
  UpdateVisualDatasetRequest,
  UpdateVisualDatasetRequestSchema,
  VisualCategoryFieldSpec,
  VisualCategoryFieldSpecListSchema,
  VisualCategoryFieldSpecSchema,
} from '@/src/schemas/visual-data';
import { safeZodParse } from '@/src/utils/zod';

const VISUAL_API_BASE = '/api/v1/admin/visual';

// 카테고리별 스펙 필드 정의 조회 (attributes의 "어떤 키가 있는지")
export const getVisualCategoryFieldSpecs = async ({
  category,
  yearId,
}: {
  category: string;
  yearId?: number;
}) => {
  const res = await apiClient.get(`${VISUAL_API_BASE}/category-field-specs`, {
    params: { category, yearId },
  });
  return VisualCategoryFieldSpecListSchema.parse(res.data);
};

// 카테고리에 스펙 필드 정의 추가 (yearId 생략 시 해당 카테고리 전체 연도 공통)
export const createVisualCategoryFieldSpec = async ({
  category,
  yearId,
  fieldKey,
  fieldLabel,
}: {
  category: string;
  yearId?: number;
  fieldKey: string;
  fieldLabel: string;
}): Promise<VisualCategoryFieldSpec> => {
  const res = await apiClient.post(
    `${VISUAL_API_BASE}/category-field-specs`,
    { fieldKey, fieldLabel },
    { params: { category, yearId } }
  );
  return VisualCategoryFieldSpecSchema.parse(res.data);
};

export const getVisualDatasetsByYear = async (yearId: number) => {
  const res = await apiClient.get(
    `${VISUAL_API_BASE}/data/years/${yearId}/datasets`
  );
  const parsed = GetVisualDataByCategoryResponseSchema.safeParse(res.data);

  if (!parsed.success) {
    console.log('❌ Zod validation failed');
    console.log('issues:', parsed.error.issues);
    console.log('format:', parsed.error.format());
  }
  // console.log('✅ getVisualDatasetsByYear response:', res.data);
  return res.data;
};

export const getVisualDatasetDetail = async (datasetId: number) => {
  const res = await apiClient.get(
    `${VISUAL_API_BASE}/data/datasets/${datasetId}`
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
    `${VISUAL_API_BASE}/data/years/${yearId}/datasets`,
    validated
  );
  return CreateVisualDatasetResponseSchema.parse(res.data);
};

// 검색
export const searchVisualDataset = async ({
  keyword,
  category,
}: {
  keyword: string;
  category?: string;
}) => {
  const response = await apiClient.get(
    `${VISUAL_API_BASE}/data/datasets/search`,
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
    `${VISUAL_API_BASE}/data/datasets/${id}`,
    validated,
    {
      params: logoFile === null ? { image: 'DELETE' } : {},
    }
  );

  return UpdateDatasetResponseSchema.parse(res.data);
};
