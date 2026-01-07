import { UserType } from '@/src/schemas/auth';
import { searchIndustrialDataset } from '@/src/services/data/industry';
import { searchVisualDataset } from '@/src/services/data/visual';
import { SearchDataResponse } from '@/src/types/data/visual-data';

import { useQuery } from '@tanstack/react-query';

interface useSearchDatasetsParams {
  type: UserType;
  keyword: string;
  category?: string;
}

export const useSearchDatasets = ({
  type,
  keyword,
  category,
}: useSearchDatasetsParams) => {
  return useQuery<SearchDataResponse>({
    queryKey: ['search', 'visual', keyword, category],
    queryFn: () => {
      if (type === 'VISUAL') {
        return searchVisualDataset({ keyword, category });
      }

      return searchIndustrialDataset({ keyword, category });
    },
    enabled: !!category && keyword.trim().length >= 2,
  });
};
