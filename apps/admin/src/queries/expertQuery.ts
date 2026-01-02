import { UserType } from '@/src/schemas/auth';

export const expertQueryKeys = {
  all: ['datasets'] as const,

  lists: () => [...expertQueryKeys.all, 'list'] as const,
  listByType: (type?: UserType) => [...expertQueryKeys.lists(), type] as const,

  listByYear: (type?: UserType, year?: number) =>
    [...expertQueryKeys.lists(), type, year] as const,

  search: (type: UserType, keyword: string, category?: string) =>
    [...expertQueryKeys.lists(), 'search', type, keyword, category] as const,

  detail: (datasetId: number) =>
    [...expertQueryKeys.all, 'detail', datasetId] as const,
};
