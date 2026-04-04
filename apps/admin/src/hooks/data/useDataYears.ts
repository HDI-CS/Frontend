import { datasetQueryKeys } from '@/src/queries/dataQuery';
import { UserType } from '@/src/schemas/auth';
import { getYearList } from '@/src/services/data/common';
import { useQuery } from '@tanstack/react-query';

export const useDataYears = (type?: UserType) => {
  return useQuery({
    queryKey: datasetQueryKeys.all,
    queryFn: () => getYearList(type!),
    enabled: !!type,
  });
};
