import { apiClient } from '../lib/axios';
import { UserType } from '../schemas/auth';
import {
  CreateDatasetRequest,
  CreateDatasetRequestSchema,
  CreateDatasetResponseSchema,
  DeleteDatasetRequestSchema,
  DeleteDatasetResponseSchema,
  DuplicateDatasetRequestSchema,
  DuplicateDatasetResponseSchema,
  GetDataByCategoryResponseSchema,
  GetDataByKeywordyResponseSchema,
  GetDetailtDataByCategoryResponseSchema,
  UpdateDatasetRequest,
  UpdateDatasetRequestSchema,
  UpdateDatasetResponseSchema,
  YearListResponseSchema,
} from '../schemas/data';
import { safeZodParse } from '../utils/zod';

// 연도 목록 조회
export const getYearList = async (type: UserType) => {
  const response = await apiClient.get(
    `/api/v1/admin/${type.toLowerCase()}/data/years`
  );
  console.log('raw data', response.data);

  // 응답 데이터 검증
  return YearListResponseSchema.parse(response.data);
};

// 데이터셋 조회
export const getDatasetsByYear = async ({
  type,
  year,
}: {
  type: UserType;
  year: number;
}) => {
  const response = await apiClient.get(
    `/api/v1/admin/${type.toLowerCase()}/data/years/${year}/datasets`
  );
  console.log('raw data', response.data);

  // 응답 데이터 검증
  return GetDataByCategoryResponseSchema.parse(response.data);
};

// 데이터셋  상세 조회
export const getDetailDatasetsById = async ({
  type,
  datasetId,
}: {
  type: UserType;
  datasetId: number;
}) => {
  const response = await apiClient.get(
    `/api/v1/admin/${type.toLowerCase()}/data/datasets/${datasetId}`
  );
  console.log('raw data', response.data);

  // 응답 데이터 검증
  return GetDetailtDataByCategoryResponseSchema.parse(response.data);
};

// 데이터 셋 생성
export const createDataset = async ({
  type,
  yearId,
  requestData,
}: {
  type: UserType;
  yearId: number;
  requestData: CreateDatasetRequest;
}) => {
  // Zod 검증
  const validatedData = safeZodParse(CreateDatasetRequestSchema, requestData, {
    operation: 'CreateDatasetRequest validation',
    additionalInfo: {
      yearId,
      domain: type,
    },
  });

  //  API 호출
  const response = await apiClient.post(
    `/api/v1/admin/${type.toLowerCase()}/data/years/${yearId}/datasets`,
    validatedData
  );

  console.log('Create Visual Dataset:', {
    yearId,
    requestData: validatedData,
    response: response.data,
  });

  return CreateDatasetResponseSchema.parse(response.data);
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

  console.log('duplicate Visual Dataset:', {
    requestData: validatedData,
    response: response.data,
  });

  return DuplicateDatasetResponseSchema.parse(response.data);
};

// 데이터셋 수정
export const updateDataset = async ({
  id,
  requestData,
  type,
  logoFile,
}: {
  id: number;
  requestData: UpdateDatasetRequest;
  type: UserType;
  logoFile?: File | null;
}) => {
  // Zod 검증
  const validatedData = safeZodParse(UpdateDatasetRequestSchema, requestData, {
    operation: 'UpdateData request validation',
  });

  console.log(logoFile);
  //  API 호출
  const response = await apiClient.patch(
    `/api/v1/admin/${type.toLowerCase()}/data/datasets/${id}`,
    validatedData,
    {
      params: logoFile === null ? { image: 'DELETE' } : {},
    }
  );

  console.log('Update Visual Dataset:', {
    requestData: validatedData,
    response: response.data,
  });

  return UpdateDatasetResponseSchema.parse(response.data);
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

  console.log('Delete Visual Dataset:', {
    requestData: validatedData,
    response: response.data,
  });

  return DeleteDatasetResponseSchema.parse(response.data);
};

export const searchDataset = async ({
  type,
  keyword,
  category,
}: {
  type: UserType;
  keyword: string;
  category: string;
}) => {
  const response = await apiClient.get(
    `/api/v1/admin/${type.toLowerCase()}/data/datasets/search`,
    {
      params: {
        q: keyword,
        category,
      },
    }
  );

  console.log('raw data', response.data);

  // 응답 데이터 검증
  return GetDataByKeywordyResponseSchema.parse(response.data);
};
