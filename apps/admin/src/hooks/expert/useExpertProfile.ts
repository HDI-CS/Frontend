import { expertQueryKeys } from '@/src/queries/expertQuery';
import { UserType } from '@/src/schemas/auth';
import { ExpertListResponse } from '@/src/schemas/expert';
import { getExpertProfile, searchExpertProfile } from '@/src/services/expert';
import { useQuery } from '@tanstack/react-query';

export const useExpertProfile = (type: UserType) => {
  return useQuery<ExpertListResponse>({
    queryKey: expertQueryKeys.listByType(type),
    queryFn: () => getExpertProfile(type!), // enabled가 true일 때만 실행됨
    enabled: !!type,
  });
};

export const useExpertProfileByKeyword = (type: UserType, keyword: string) => {
  return useQuery<ExpertListResponse>({
    queryKey: expertQueryKeys.search(type, keyword),
    queryFn: () => searchExpertProfile(type!, keyword), // enabled가 true일 때만 실행됨
    enabled: keyword.trim().length >= 2 && !!type,
  });
};
