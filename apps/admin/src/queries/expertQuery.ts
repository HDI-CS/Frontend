import { UserType } from '@/src/schemas/auth';

export const expertQueryKeys = {
  all: ['experts'] as const,

  lists: () => [...expertQueryKeys.all, 'list'] as const,
  listByType: (type?: UserType) => [...expertQueryKeys.lists(), type] as const,

  listByYear: (type?: UserType, year?: number) =>
    [...expertQueryKeys.lists(), type, year] as const,

  search: (type: UserType, keyword: string) =>
    [...expertQueryKeys.lists(), 'search', type, keyword] as const,

  member: (type: UserType, memberId: number) =>
    [...expertQueryKeys.lists(), 'member', memberId] as const,
};
