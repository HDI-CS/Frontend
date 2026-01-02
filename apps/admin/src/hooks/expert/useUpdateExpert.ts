import { expertQueryKeys } from '@/src/queries/expertQuery';
import { UserType } from '@/src/schemas/auth';
import { UpdateExpertMember } from '@/src/schemas/expert';
import { updateExpertProfile } from '@/src/services/expert';

import { useMutation, useQueryClient } from '@tanstack/react-query';

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
