import { expertQueryKeys } from '@/src/queries/expertQuery';
import { UserType } from '@/src/schemas/auth';
import { CreateExpertAssignmentRequest } from '@/src/schemas/expert';
import { createExpertAssignment } from '@/src/services/expert/mapping';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseCreateExpertAssignmentParams {
  type: UserType;
  assessmentRoundId: number;
}

export const useCreateExpertAssignment = ({
  type,
  assessmentRoundId,
}: UseCreateExpertAssignmentParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateExpertAssignmentRequest) =>
      createExpertAssignment(type, assessmentRoundId, request),

    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: expertQueryKeys.lists(),
      });
    },
  });
};
