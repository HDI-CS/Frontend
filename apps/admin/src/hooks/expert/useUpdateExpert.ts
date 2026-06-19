import { expertQueryKeys } from '@/src/queries/expertQuery';
import { UserType } from '@/src/schemas/auth';
import { IdsRequest, UpdateExpertMember } from '@/src/schemas/expert';
import { UpdateExpertMapping } from '@/src/services/expert/mapping';
import { updateExpertProfile } from '@/src/services/expert/profile';

import { useMutation, useQueryClient } from '@tanstack/react-query';

// 전문가 인적사항 수정
export const useUpdateExpert = (type: UserType, memberId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateExpertMember) =>
      updateExpertProfile(type, memberId, body),

    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: expertQueryKeys.listByType(type),
      });
    },

    onError: (error) => {
      console.error('Update dataset failed', error);
    },
  });
};

// 전문가 매핑 수정
export const useUpdatMapping = (
  type: UserType,
  roundId: number,
  memberId: number
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: IdsRequest) =>
      UpdateExpertMapping(type, roundId, memberId, body),

    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: expertQueryKeys.lists(), //수정필요
      });
    },

    onError: (error) => {
      console.error('Update dataset failed', error);
    },
  });
};
