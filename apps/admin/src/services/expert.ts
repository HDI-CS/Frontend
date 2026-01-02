import { apiClient } from '../lib/axios';
import { UserType } from '../schemas/auth';
import { ExpertListResponseSchema } from '../schemas/expert';

export const getExpertProfile = async (type: UserType) => {
  const res = await apiClient.get(`/api/v1/admin/${type}/members`);
  return ExpertListResponseSchema.parse(res.data);
};
