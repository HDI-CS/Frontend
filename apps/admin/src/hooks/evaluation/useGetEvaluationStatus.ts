import { evaluationQueryKeys } from '@/src/queries/evaluationQuery';
import { UserType } from '@/src/schemas/auth';
import {
  EvaluationStatusResponse,
  GetMemberSurveyResponse,
} from '@/src/schemas/evaluation';
import {
  getEvaluationStatus,
  getEvaluationStatusByKeyword,
  getOneExpert,
} from '@/src/services/evaluation';
import { useQuery } from '@tanstack/react-query';

export const useGetEvaluationStatus = (type: UserType, roundId: number) => {
  return useQuery<EvaluationStatusResponse>({
    queryKey: evaluationQueryKeys.listByRound(type, roundId),
    queryFn: () => getEvaluationStatus(type!, roundId), // enabled가 true일 때만 실행됨
    enabled: !!type,
  });
};

export const useGetEvaluationStatusByKeyword = (
  type: UserType,
  roundId: number,
  keyword: string
) => {
  return useQuery<EvaluationStatusResponse>({
    queryKey: evaluationQueryKeys.search(type, roundId, keyword),
    queryFn: () => getEvaluationStatusByKeyword(type!, roundId, keyword), // enabled가 true일 때만 실행됨
    enabled: !!type,
  });
};

// 특정 전문가 응답 조회
export const useGetOneEvaluationStatus = (
  type: UserType,
  roundId: number,
  memberId: number
) => {
  return useQuery<GetMemberSurveyResponse>({
    queryKey: evaluationQueryKeys.member(type, roundId, memberId),
    queryFn: () => getOneExpert(type!, roundId, memberId), // enabled가 true일 때만 실행됨
    enabled: !!type,
  });
};
