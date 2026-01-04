import { UserType } from '@/src/schemas/auth';

export const evaluationQueryKeys = {
  all: ['evaluation'] as const,

  lists: (type: UserType) =>
    [...evaluationQueryKeys.all, 'list', type] as const,

  round: (type: UserType, round: number) =>
    ['evaluation', 'round', type, round] as const,

  listByYear: (type?: UserType, year?: number) =>
    [...evaluationQueryKeys.lists(type!), type, year] as const,

  listByRound: (type?: UserType, round?: number) =>
    [...evaluationQueryKeys.lists(type!), type, round] as const,

  search: (type: UserType, round: number, keyword: string) =>
    [...evaluationQueryKeys.lists(type), type, round, keyword] as const,

  member: (type?: UserType, round?: number, memberId?: number) =>
    [...evaluationQueryKeys.lists(type!), type, round, memberId] as const,

  detail: (datasetId: number) =>
    [...evaluationQueryKeys.all, 'detail', datasetId] as const,
};
evaluationQueryKeys.round = (type: UserType, round: number) =>
  ['evaluation', 'round', type, round] as const;
