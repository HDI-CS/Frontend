import {
  createVisualCategoryFieldSpec,
  getVisualCategoryFieldSpecs,
} from '@/src/services/data/visual';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const visualCategoryFieldSpecQueryKeys = {
  all: ['visualCategoryFieldSpecs'] as const,
  byCategory: (category?: string, yearId?: number) =>
    [...visualCategoryFieldSpecQueryKeys.all, category, yearId] as const,
};

// 카테고리의 "추가 스펙" 필드 정의 목록. useIndustryCategoryFieldSpecs와 동일한 패턴.
export const useVisualCategoryFieldSpecs = ({
  category,
  yearId,
}: {
  category?: string | null;
  yearId?: number;
}) => {
  return useQuery({
    queryKey: visualCategoryFieldSpecQueryKeys.byCategory(
      category ?? undefined,
      yearId
    ),
    queryFn: () =>
      getVisualCategoryFieldSpecs({ category: category as string, yearId }),
    enabled: !!category,
  });
};

// 카테고리에 새 스펙 필드 정의 추가
export const useCreateVisualCategoryFieldSpec = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVisualCategoryFieldSpec,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: visualCategoryFieldSpecQueryKeys.byCategory(
          variables.category,
          variables.yearId
        ),
      });
    },
  });
};
