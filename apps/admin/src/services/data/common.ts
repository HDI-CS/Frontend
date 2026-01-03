import { apiClient } from '@/src/lib/axios';
import { UserType } from '@/src/schemas/auth';
import {
  DeleteDatasetRequestSchema,
  DeleteDatasetResponseSchema,
  DuplicateDatasetRequestSchema,
  DuplicateDatasetResponseSchema,
  GetDatasetCandidatesResponse,
  GetDatasetCandidatesResponseSchema,
  YearListResponseSchema,
} from '@/src/schemas/visual-data';
import { CreateDatasetParams } from '@/src/types/data/visual-data';
import { safeZodParse } from '@/src/utils/zod';
import { createIndustrialDataset, searchIndustrialDataset } from './industry';
import { createVisualDataset, searchVisualDataset } from './visual';

// 연도 목록
export const getYearList = async (type: UserType) => {
  const res = await apiClient.get(
    `/api/v1/admin/${type.toLowerCase()}/data/years`
  );
  return YearListResponseSchema.parse(res.data);
};

// 데이터셋 복제
export const duplicateDataset = async ({
  ids,
  type,
}: {
  ids: number[];
  type: UserType;
}) => {
  // Zod 검증
  const validatedData = safeZodParse(
    DuplicateDatasetRequestSchema,
    { ids },
    { operation: 'DuplicateDataset request validation' }
  );

  //  API 호출
  const response = await apiClient.post(
    `/api/v1/admin/${type.toLowerCase()}/data/datasets/duplicate`,
    validatedData
  );

  return DuplicateDatasetResponseSchema.parse(response.data);
};

// 데이터셋 삭제
export const deleteDataset = async ({
  ids,
  type,
}: {
  ids: number[];
  type: UserType;
}) => {
  // Zod 검증
  const validatedData = safeZodParse(
    DeleteDatasetRequestSchema,
    { ids },
    { operation: 'DeleteDataset request validation' }
  );

  //  API 호출
  const response = await apiClient.delete(
    `/api/v1/admin/${type.toLowerCase()}/data/datasets`,
    {
      data: validatedData,
    }
  );
  return DeleteDatasetResponseSchema.parse(response.data);
};

// 엑셀 다운로드
export const downloadExcel = async ({
  type,
  yearId,
}: {
  type: UserType;
  yearId: number;
}) => {
  return apiClient.get(
    `/api/v1/admin/${type.toLowerCase()}/data/years/${yearId}/datasets/export`,
    {
      responseType: 'blob', // 이건 JSON이 아니라 binary라서 파싱 대상 아님
    }
  );
};

// 검색
export const dispatchSearchDataset = ({
  type,
  keyword,
  category,
}: {
  type: UserType;
  keyword: string;
  category: string;
}) => {
  switch (type) {
    case 'VISUAL':
      return searchVisualDataset({ keyword, category });

    case 'INDUSTRY':
      return searchIndustrialDataset({ keyword, category });

    default:
      throw new Error(`Unsupported dataset type: ${type}`);
  }
};

// 생성 공통 함수
export const createDataset = async (params: CreateDatasetParams) => {
  const { type, yearId } = params;
  switch (type) {
    case 'VISUAL':
      return createVisualDataset({
        yearId,
        requestData: params.requestData,
      });

    case 'INDUSTRY':
      return createIndustrialDataset({
        yearId,
        requestData: params.requestData,
      });

    default:
      throw new Error(`Unsupported dataset type: ${type}`);
  }
};

// 전문가 매칭할 데이터셋 후보 조회
export const getCandidate = async (type: UserType, yearId: number) => {
  const response = await apiClient.get(
    `/api/v1/admin/${type.toLowerCase()}/data/years/${yearId}/datasets/id`
  );
  return response.data;
};
