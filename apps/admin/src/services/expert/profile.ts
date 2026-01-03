import { apiClient } from '../../lib/axios';
import { UserType } from '../../schemas/auth';
import {
  CreateExpertMember,
  CreateExpertMemberResponseShcema,
  CreateExpertMemberSchema,
  ExpertListResponseSchema,
  UpdateExpertMember,
  UpdateExpertMemberResponseShcema,
  UpdateExpertMemberSchema,
} from '../../schemas/expert';
import { safeZodParse } from '../../utils/zod';

// 전문가 전체 리스트 조회
export const getExpertProfile = async (type: UserType) => {
  const res = await apiClient.get(`/api/v1/admin/${type}/members`);
  return ExpertListResponseSchema.parse(res.data);
};

// 전문가 리스트 검색 조회
export const searchExpertProfile = async (type: UserType, keyword: string) => {
  const response = await apiClient.get(`/api/v1/admin/${type}/members/search`, {
    params: {
      q: keyword,
    },
  });
  return ExpertListResponseSchema.parse(response.data);
};

export const updateExpertProfile = async (
  type: UserType,
  memberId: number,
  body: UpdateExpertMember
) => {
  const validated = safeZodParse(UpdateExpertMemberSchema, body, {
    operation: 'UpdateExpert request validation',
  });
  const response = await apiClient.put(
    `/api/v1/admin/${type}/members/${memberId}`,
    validated
  );
  return UpdateExpertMemberResponseShcema.parse(response.data);
};

export const createExpertProfile = async (
  type: UserType,
  body: CreateExpertMember
) => {
  const validated = safeZodParse(CreateExpertMemberSchema, body, {
    operation: 'UpdateExpert request validation',
  });
  const response = await apiClient.post(
    `/api/v1/admin/${type}/members`,
    validated
  );
  return CreateExpertMemberResponseShcema.parse(response.data);
};

export const downloadExpertProfile = async (
  type: UserType,
  body: CreateExpertMember
) => {
  const validated = safeZodParse(CreateExpertMemberSchema, body, {
    operation: 'UpdateExpert request validation',
  });
  const response = await apiClient.post(
    `/api/v1/admin/${type}/members`,
    validated
  );
  return CreateExpertMemberResponseShcema.parse(response.data);
};

// 엑셀 다운로드
export const downloadExpertExcel = async ({ type }: { type: UserType }) => {
  return apiClient.get(`/api/v1/admin/${type}/members/export`, {
    responseType: 'blob', // 이건 JSON이 아니라 binary라서 파싱 대상 아님
  });
};
