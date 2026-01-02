import { UserType } from '@/src/schemas/auth';

export const evaluationQueryKeys = {
  all: ['evaluation'] as const,

  lists: (type: UserType) =>
    [...evaluationQueryKeys.all, 'list', type] as const,

  listByYear: (type?: UserType, year?: number) =>
    [...evaluationQueryKeys.lists(type!), type, year] as const,

  search: (type: UserType, keyword: string, category?: string) =>
    [
      ...evaluationQueryKeys.lists(type),
      'search',
      type,
      keyword,
      category,
    ] as const,

  detail: (datasetId: number) =>
    [...evaluationQueryKeys.all, 'detail', datasetId] as const,
};
