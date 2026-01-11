import { UserType } from '@/src/schemas/auth';

export const datasetQueryKeys = {
  all: ['datasets'] as const,

  lists: (type?: UserType) => [...datasetQueryKeys.all, 'list', type] as const,

  listByYear: (type?: UserType, year?: number) =>
    [...datasetQueryKeys.lists(), type, year] as const,

  search: (type: UserType, keyword: string, category?: string) =>
    [...datasetQueryKeys.lists(), 'search', type, keyword, category] as const,

  candidates: (type: UserType, yearId: number) =>
    [...datasetQueryKeys.all, 'candidates', type, yearId] as const,

  detail: (datasetId: number) =>
    [...datasetQueryKeys.lists(), 'detail', datasetId] as const,
};
