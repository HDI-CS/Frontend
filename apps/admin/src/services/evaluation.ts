import { apiClient } from '../lib/axios';
import { UserType } from '../schemas/auth';
import { EvaluationYear } from '../schemas/survey';

// 전체 평가 조회
export const getEvaluationFolders = async (type: UserType) => {
  const res = await apiClient.get(
    `/api/v1/admin/${type.toLowerCase()}/survey/all`
  );
  return res.data.result as EvaluationYear[];
};
