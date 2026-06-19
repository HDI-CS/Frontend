import { datasetQueryKeys } from '@/src/queries/dataQuery';
import { UserType } from '@/src/schemas/auth';
import { GetDatasetCandidatesResponse } from '@/src/schemas/visual-data';
import { getCandidate } from '@/src/services/data/common';
import { useQuery } from '@tanstack/react-query';

// 전문가에게 매칭할 데이터셋 후보 조회
export const useDatasetCandidate = (type: UserType, yearId: number) => {
  return useQuery<GetDatasetCandidatesResponse>({
    queryKey: datasetQueryKeys.candidates(type, yearId),
    queryFn: () => getCandidate(type, yearId),

    enabled: !!type && yearId > 0,
  });
};
