import {
  createIndustryCategoryFieldSpec,
  getIndustryCategoryFieldSpecs,
} from '@/src/services/data/industry';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const industryCategoryFieldSpecQueryKeys = {
  all: ['industryCategoryFieldSpecs'] as const,
  byCategory: (category?: string, yearId?: number) =>
    [...industryCategoryFieldSpecQueryKeys.all, category, yearId] as const,
};

// 카테고리의 "추가 스펙" 필드 정의 목록 (한 번 정의해두면 그 카테고리의 모든 제품에 적용)
export const useIndustryCategoryFieldSpecs = ({
  category,
  yearId,
}: {
  category?: string | null;
  yearId?: number;
}) => {
  return useQuery({
    queryKey: industryCategoryFieldSpecQueryKeys.byCategory(
      category ?? undefined,
      yearId
    ),
    queryFn: () =>
      getIndustryCategoryFieldSpecs({ category: category as string, yearId }),
    enabled: !!category,
  });
};

// 카테고리에 새 스펙 필드 정의 추가
export const useCreateIndustryCategoryFieldSpec = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIndustryCategoryFieldSpec,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: industryCategoryFieldSpecQueryKeys.byCategory(
          variables.category,
          variables.yearId
        ),
      });
    },
  });
};
