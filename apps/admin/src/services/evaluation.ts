import { apiClient } from '../lib/axios';
import { UserType } from '../schemas/auth';
import {
  CreateEvaluationQuestionResponseSchema,
  CreateEvaluationYearResponseSchema,
  EvaluationSurveyResponseSchema,
  EvaluationYearsResponseSchema,
  SurveyQuestionByTypeList,
  SurveyQuestionByTypeListSchema,
} from '../schemas/survey';
import { safeZodParse } from '../utils/zod';

// 전체 평가 조회
export const getEvaluationFolders = async (type: UserType) => {
  const res = await apiClient.get(`/api/v1/admin/${type}/survey/all`);
  try {
    return EvaluationYearsResponseSchema.parse(res.data);
  } catch (e) {
    console.log(e);
  }

  return EvaluationYearsResponseSchema.parse(res.data);
};

// 년도 평가 생성
export const createEvaluation = async (type: UserType) => {
  const res = await apiClient.post(`/api/v1/admin/${type}/survey`);
  return CreateEvaluationYearResponseSchema.parse(res.data);
};

// 년도별 평가 문항 조회
export const getEvaluationQuestion = async (type: UserType, yearId: number) => {
  const res = await apiClient.get(
    `/api/v1/admin/${type}/survey/years/${yearId}/questions`
  );
  return EvaluationSurveyResponseSchema.parse(res.data);
};

// 년도 평가 설문 문항 생성
export const createEvaluationQuestion = async (
  type: UserType,
  yearId: number,
  body: SurveyQuestionByTypeList
) => {
  const validated = safeZodParse(SurveyQuestionByTypeListSchema, body, {
    operation: 'I CreateDataset request validation',
  });

  const res = await apiClient.post(
    `/v1/admin/${type}/survey/years/${yearId}/questions`,
    validated
  );
  return CreateEvaluationQuestionResponseSchema.parse(res.data);
};
