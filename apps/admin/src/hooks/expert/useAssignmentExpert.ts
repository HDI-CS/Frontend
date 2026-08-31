import { expertQueryKeys } from '@/src/queries/expertQuery';
import { UserType } from '@/src/schemas/auth';
import {
  ExpertAssignmentResponse,
  OneExpertAssignmentResponse,
} from '@/src/schemas/expert';
import {
  getExpertAssignment,
  getOneExpertAssignment,
} from '@/src/services/expert/mapping';
import { useQuery } from '@tanstack/react-query';

export const useExpertAssignment = (
  type: UserType,
  assessmentRoundId: number,
  keyword: string
) => {
  return useQuery<ExpertAssignmentResponse>({
    queryKey: expertQueryKeys.search(type, assessmentRoundId, keyword),
    queryFn: () => getExpertAssignment(type!, assessmentRoundId, keyword),
  });
};

export const useOneExpertAssignment = (
  type: UserType,
  assessmentRoundId: number,
  memberId: number
) => {
  return useQuery<OneExpertAssignmentResponse>({
    queryKey: expertQueryKeys.datasetCandidates(type, assessmentRoundId),
    queryFn: () => getOneExpertAssignment(type!, assessmentRoundId, memberId),
  });
};
