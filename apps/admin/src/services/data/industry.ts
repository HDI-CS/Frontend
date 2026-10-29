import { apiClient } from '@/src/lib/axios';
import {
  CreateIndustrialDatasetRequest,
  CreateIndustrialDatasetRequestSchema,
  CreateIndustrialDatasetResponseSchema,
  GetDetailIndustrialDataByCategoryResponseSchema,
  GetIndustrialDataByCategoryResponseSchema,
  GetIndustrialDataByKeywordyResponseSchema,
  IndustryCategoryFieldSpec,
  IndustryCategoryFieldSpecListSchema,
  IndustryCategoryFieldSpecSchema,
  UpdateIndustrialDatasetRequest,
  UpdateIndustrialDatasetRequestSchema,
} from '@/src/schemas/industry-data';
import { safeZodParse } from '@/src/utils/zod';

const INDUSTRY_API_BASE = '/api/v1/admin/industry';

export const getIndustrialDatasetsByYear = async (yearId: number) => {
  const res = await apiClient.get(
    `${INDUSTRY_API_BASE}/data/years/${yearId}/datasets`
  );
  console.log('✅ getIndustrialDatasetsByYear response:', res.data);

  const parsed = GetIndustrialDataByCategoryResponseSchema.safeParse(res.data);

  if (!parsed.success) {
    console.log('❌ Zod validation failed');
    console.log('issues:', parsed.error.issues);
    console.log('format:', parsed.error.format());
  }

  return res.data;
};

export const getIndustrialDatasetDetail = async (datasetId: number) => {
  const res = await apiClient.get(
    `${INDUSTRY_API_BASE}/data/datasets/${datasetId}`
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
    `${INDUSTRY_API_BASE}/data/years/${yearId}/datasets`,
    validated
  );

  return CreateIndustrialDatasetResponseSchema.parse(res.data);
};

export const updateIndustrialDataset = async ({
  id,
  requestData,
  detailFile,
  frontFile,
  sideFile,
  side2File,
  side3File,
}: {
  id: number;
  requestData: UpdateIndustrialDatasetRequest;
  detailFile?: File | null;
  frontFile?: File | null;
  sideFile?: File | null;
  side2File?: File | null;
  side3File?: File | null;
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
  if (side2File === null) imagesToDelete.push('SIDE2');
  if (side3File === null) imagesToDelete.push('SIDE3');

  const res = await apiClient.patch(
    `${INDUSTRY_API_BASE}/data/datasets/${id}`,
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

// 카테고리별 스펙 필드 정의 조회 (attributes의 "어떤 키가 있는지")
export const getIndustryCategoryFieldSpecs = async ({
  category,
  yearId,
}: {
  category: string;
  yearId?: number;
}) => {
  const res = await apiClient.get(`${INDUSTRY_API_BASE}/category-field-specs`, {
    params: { category, yearId },
  });
  return IndustryCategoryFieldSpecListSchema.parse(res.data);
};

// 카테고리에 스펙 필드 정의 추가 (yearId 생략 시 해당 카테고리 전체 연도 공통)
export const createIndustryCategoryFieldSpec = async ({
  category,
  yearId,
  fieldKey,
  fieldLabel,
}: {
  category: string;
  yearId?: number;
  fieldKey: string;
  fieldLabel: string;
}): Promise<IndustryCategoryFieldSpec> => {
  const res = await apiClient.post(
    `${INDUSTRY_API_BASE}/category-field-specs`,
    { fieldKey, fieldLabel },
    { params: { category, yearId } }
  );
  return IndustryCategoryFieldSpecSchema.parse(res.data);
};

export const searchIndustrialDataset = async ({
  keyword,
  category,
}: {
  keyword: string;
  category?: string;
}) => {
  const response = await apiClient.get(
    `${INDUSTRY_API_BASE}/data/datasets/search`,
    {
      params: {
        q: keyword,
        category,
      },
    }
  );
  return GetIndustrialDataByKeywordyResponseSchema.parse(response.data);
};
