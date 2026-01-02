import { apiClient } from '../lib/axios';
import { UserType } from '../schemas/auth';
import { EvaluationYearsResponseSchema } from '../schemas/survey';

// 전체 평가 조회
export const getEvaluationFolders = async (type: UserType) => {
  const res = await apiClient.get(`/api/v1/admin/${type}/survey/all`);
  console.log(type);
  return EvaluationYearsResponseSchema.parse(res.data);
};
