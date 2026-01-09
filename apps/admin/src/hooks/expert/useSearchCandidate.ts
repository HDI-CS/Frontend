import { expertQueryKeys } from '@/src/queries/expertQuery';
import { UserType } from '@/src/schemas/auth';
import { searchExpertCandidate } from '@/src/services/expert/mapping';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useSearchCandidate = (type: UserType, search: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => searchExpertCandidate(type, search),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: expertQueryKeys.searchProfile(type, search),
      });
    },
    onError: (error) => {
      console.error('Create dataset failed', error);
    },
  });
};
