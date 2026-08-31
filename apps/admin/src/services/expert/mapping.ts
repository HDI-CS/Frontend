import { apiClient } from '@/src/lib/axios';
import { UserType } from '@/src/schemas/auth';
import {
  CreateExpertAssignmentRequest,
  CreateExpertAssignmentResponse,
  CreateExpertAssignmentResponseSchema,
  ExpertAssignmentResponseShcema,
  IdsRequest,
  OneExpertAssignmentResponseShcema,
  SearchExpertCandidateResponseSchema,
  UpdateIdsResponseSchema,
} from '@/src/schemas/expert';

// 전문가 전체 리스트 조회
export const getExpertAssignment = async (
  type: UserType,
  assessmentRoundId: number,
  keyword: string
) => {
  const res = await apiClient.get(
    `/api/v1/admin/${type}/assignment/assessment/${assessmentRoundId}`,
    {
      params: {
        q: keyword,
      },
    }
  );
  return ExpertAssignmentResponseShcema.parse(res.data);
};

// 전문가별 데이터 매칭 조회
export const getOneExpertAssignment = async (
  type: UserType,
  assessmentRoundId: number,
  memberId: number
) => {
  const res = await apiClient.get(
    `/api/v1/admin/${type}/assignment/assessment/${assessmentRoundId}/members/${memberId}`
  );
  return OneExpertAssignmentResponseShcema.parse(res.data);
};

export const UpdateExpertMapping = async (
  type: UserType,
  assessmentRoundId: number,
  memberId: number,
  ids: IdsRequest
) => {
  const res = await apiClient.put(
    `/api/v1/admin/${type}/assignment/assessment/${assessmentRoundId}/members/${memberId}`,
    ids
  );
  return UpdateIdsResponseSchema.parse(res.data);
};

export const createExpertAssignment = async (
  type: UserType,
  assessmentRoundId: number,
  request: CreateExpertAssignmentRequest
) => {
  const res = await apiClient.post<CreateExpertAssignmentResponse>(
    `/api/v1/admin/${type}/assignment/assessment/${assessmentRoundId}`,
    {
      memberId: request.memberId,
      datasetsIds: request.datasetsIds,
    }
  );
  return CreateExpertAssignmentResponseSchema.parse(res.data);
};

export const searchExpertCandidate = async (type: UserType, search: string) => {
  const res = await apiClient.get(`/api/v1/admin/${type}/assignment/search`, {
    params: {
      q: search,
    },
  });
  return SearchExpertCandidateResponseSchema.parse(res.data);
};

// 엑셀 다운로드
export const downloadMappingExcel = async ({
  type,
  assessmentRoundId,
}: {
  type: UserType;
  assessmentRoundId: number;
}) => {
  return apiClient.get(
    `/api/v1/admin/${type}/assignment/assessment/${assessmentRoundId}/export`,
    {
      responseType: 'blob', // 이건 JSON이 아니라 binary라서 파싱 대상 아님
    }
  );
};
