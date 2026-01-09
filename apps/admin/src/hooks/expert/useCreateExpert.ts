import { expertQueryKeys } from '@/src/queries/expertQuery';
import { UserType } from '@/src/schemas/auth';
import { CreateExpertMember } from '@/src/schemas/expert';
import { createExpertProfile } from '@/src/services/expert/profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateExpert = (type: UserType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateExpertMember) => createExpertProfile(type, body),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: expertQueryKeys.listByType(type!),
      });
    },
    onError: (error) => {
      console.error('Create dataset failed', error);
    },
  });
};
