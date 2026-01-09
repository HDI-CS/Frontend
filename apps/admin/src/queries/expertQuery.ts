import { UserType } from '@/src/schemas/auth';

export const expertQueryKeys = {
  all: ['experts'] as const,

  lists: () => [...expertQueryKeys.all, 'list'] as const,
  listByType: (type?: UserType) => [...expertQueryKeys.lists(), type] as const,

  listByYear: (type?: UserType, year?: number) =>
    [...expertQueryKeys.lists(), type, year] as const,

  listByRound: (type?: UserType, round?: number) =>
    [...expertQueryKeys.lists(), 'round', type, round] as const,

  searchProfile: (type: UserType, keyword?: string) =>
    [...expertQueryKeys.lists(), 'profile', type, keyword] as const,

  search: (type: UserType, assessmentRoundId?: number, keyword?: string) =>
    [
      ...expertQueryKeys.lists(),
      'search',
      type,
      assessmentRoundId,
      keyword,
    ] as const,

  datasetCandidates: (type?: UserType, year?: number) =>
    [...expertQueryKeys.lists(), 'dataset-candidates', type, year] as const,

  member: (type: UserType, memberId: number) =>
    [...expertQueryKeys.lists(), 'member', memberId] as const,
};
