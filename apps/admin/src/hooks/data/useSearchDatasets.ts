import { datasetQueryKeys } from '@/src/queries/dataQuery';
import { UserType } from '@/src/schemas/auth';
import { GetDataByKeywordyResponse } from '@/src/schemas/data';
import { searchDataset } from '@/src/services/data';
import { useQuery } from '@tanstack/react-query';

interface useSearchDatasetsParams {
  type: UserType;
  keyword: string;
  category: string;
}

export const useSearchDatasets = ({
  type,
  keyword,
  category,
}: useSearchDatasetsParams) => {
  return useQuery<GetDataByKeywordyResponse>({
    queryKey: datasetQueryKeys.search(type, keyword, category),
    queryFn: () => searchDataset({ type, keyword, category }),
    enabled: Boolean(type) && keyword.trim().length >= 2, // 검색은 최소 2글자
  });
};
