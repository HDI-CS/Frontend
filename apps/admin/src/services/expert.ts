import { apiClient } from '../lib/axios';
import { UserType } from '../schemas/auth';
import { ExpertListResponseSchema } from '../schemas/expert';
import { GetIndustrialDataByKeywordyResponseSchema } from '../schemas/industry-data';

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
