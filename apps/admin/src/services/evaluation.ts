import axios from 'axios';
import { apiClient } from '../lib/axios';
import { UserType } from '../schemas/auth';
import { UpdateOriginalSurvey } from '../schemas/evaluation';
import {
  CreateEvaluationYearResponseSchema,
  DurationRequest,
  EvaluationYearsResponseSchema,
  FolderNameRequest,
  SurveyQuestionByTypeWithSampleTextArray,
  SurveyQuestionByTypeWithSampleTextArraySchema,
} from '../schemas/survey';
import { safeZodParse } from '../utils/zod';

// 전체 평가 조회
export const getEvaluationFolders = async (type: UserType) => {
  const res = await apiClient.get(`/api/v1/admin/${type}/survey/all`);
  try {
    return res.data;
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

// 년도 평가 이름 수정
export const updateFolderName = async (
  type: UserType,
  yearId: number,
  folderName: FolderNameRequest
) => {
  const res = await apiClient.put(
    `/api/v1/admin/${type}/survey/years/${yearId}`,
    folderName
  );
  return res.data; // 명세서랑 다른 응답 보냄
};

// 년도별 평가 문항 조회
export const getEvaluationQuestion = async (type: UserType, yearId: number) => {
  const res = await apiClient.get(
    `/api/v1/admin/${type}/survey/years/${yearId}/questions`
  );
  return res.data; // 여기도 서버 응답 수정 필요 (아마 null떄문)
};

// 년도 평가 설문 문항 생성
export const createEvaluationQuestion = async (
  type: UserType,
  yearId: number,
  body: SurveyQuestionByTypeWithSampleTextArray
) => {
  const validated = safeZodParse(
    SurveyQuestionByTypeWithSampleTextArraySchema,
    body,
    {
      operation: ' CreateDataset request validation',
    }
  );

  const res = await apiClient.post(
    `/api/v1/admin/${type}/survey/years/${yearId}/questions`,
    validated
  );
  return res.data;
};

//////////////////////////////
// 차수 평가//
//////////////////////////////

// 차수 평가 이름 수정
export const updateRoundFolderName = async (
  type: UserType,
  assessmentRoundId: number,
  folderName: FolderNameRequest
) => {
  const res = await apiClient.put(
    `/api/v1/admin/${type}/survey/assessment/${assessmentRoundId}`,
    folderName
  );
  return res.data; // 명세서랑 다른 응답 보냄
};

// 차수 평가 생성
export const createRoundEvaluation = async (type: UserType, yearId: number) => {
  const res = await apiClient.post(
    `/api/v1/admin/${type}/survey/years/${yearId}/assessment`
  );
  return res.data; // 명세서랑 다른 응답 보냄
};

// 차수 평가 기간 생성 및 수정
export const createAndUpdateRoundRange = async (
  type: UserType,
  assessmentRoundId: number,
  body: DurationRequest
) => {
  const res = await apiClient.put(
    `/api/v1/admin/${type}/survey/assessment/${assessmentRoundId}/duration`,
    body
  );
  return res.data; // 명세서랑 다른 응답 보냄
};

// 평가 응답 전체 조회
export const getEvaluationStatus = async (
  type: UserType,
  assessmentRoundId: number
) => {
  const res = await apiClient.get(
    `/api/v1/admin/${type}/evaluations/assessment/${assessmentRoundId}/search`
  );
  return res.data; // 여기도 서버 응답 수정 필요 (아마 null떄문)
};

// 평가 응답 페이지 검색
export const getEvaluationStatusByKeyword = async (
  type: UserType,
  assessmentRoundId: number,
  keyword: string
) => {
  const res = await apiClient.get(
    `/api/v1/admin/${type}/evaluations/assessment/${assessmentRoundId}/search`,
    {
      params: {
        q: keyword,
      },
    }
  );
  return res.data; // 여기도 서버 응답 수정 필요 (아마 null떄문)
};

// 특정 전문가 응답 전체 조회

export const getOneExpert = async (
  type: UserType,
  assessmentRoundId: number,
  memberId: number
) => {
  const res = await apiClient.get(
    `/api/v1/admin/${type}/evaluations/assessment/${assessmentRoundId}/members/${memberId}`
  );
  return res.data;
};

// 평가 응답 데이터셋 엑셀 다운로드
export const downloadEvaluationExcel = async ({
  type,
  assessmentRoundId,
}: {
  type: UserType;
  assessmentRoundId: number;
}) => {
  try {
    const res = apiClient.get(
      `/api/v1/admin/${type.toLowerCase()}/evaluations/assessment/${assessmentRoundId}/datasets/export`,

      {
        responseType: 'blob', // 이건 JSON이 아니라 binary라서 파싱 대상 아님
      }
    );
    return res;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.log('download error', {
        status: err.response?.status,
        headers: err.response?.headers,
        data: err.response?.data,
      });
    } else {
      console.log('download unknown error', err);
    }
  }
};

// 년도 평가 설문 문항 수정 ( original )
export const updateOriginalSurvey = async (
  type: UserType,
  body: UpdateOriginalSurvey
) => {
  const res = await apiClient.put(
    `/api/v1/admin/${type}/survey/questions`,
    body
  );
  return res.data;
};
