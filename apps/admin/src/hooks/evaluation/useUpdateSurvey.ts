import { datasetQueryKeys } from '@/src/queries/dataQuery';
import { evaluationQueryKeys } from '@/src/queries/evaluationQuery';
import { UserType } from '@/src/schemas/auth';
import { UpdateOriginalSurvey } from '@/src/schemas/evaluation';
import { DurationRequest } from '@/src/schemas/survey';
import {
  createAndUpdateRoundRange,
  updateFolderName,
  updateOriginalSurvey,
  updateRoundFolderName,
} from '@/src/services/evaluation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
type UpdateSurveyVariables = {
  yearId: number;
  folderName: string;
};

export const useUpdateSurvey = (type: UserType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ yearId, folderName }: UpdateSurveyVariables) =>
      updateFolderName(type, yearId, { folderName }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: evaluationQueryKeys.lists(type),
      });

      //  데이터 연도 목록도 같이
      queryClient.invalidateQueries({
        queryKey: datasetQueryKeys.lists(type),
      });
    },
  });
};

interface updateNameProps {
  folderName: string;
  assessmentRoundId: number;
}
export const useUpdatePhaseSurvey = (type: UserType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ folderName, assessmentRoundId }: updateNameProps) =>
      updateRoundFolderName(type, assessmentRoundId, { folderName }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: evaluationQueryKeys.lists(type),
      });
      //  데이터 연도 목록도 같이
      queryClient.invalidateQueries({
        queryKey: datasetQueryKeys.lists(type),
      });
    },
  });
};

// 차수 평가 기간 생성 및 수정
export const useUpdateRoundRange = (
  type: UserType,
  assessmentRoundId: number
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: DurationRequest) =>
      createAndUpdateRoundRange(type, assessmentRoundId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: evaluationQueryKeys.lists(type),
      });
    },
  });
};

// 년도 평가 설문 문항 수정
export const useUpdateOirignalSurvey = (type: UserType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateOriginalSurvey) =>
      updateOriginalSurvey(type, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: evaluationQueryKeys.lists(type),
      });
    },
  });
};
