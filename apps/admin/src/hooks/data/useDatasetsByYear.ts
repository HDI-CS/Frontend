import { datasetQueryKeys } from '@/src/queries/dataQuery';
import { UserType } from '@/src/schemas/auth';
import {
  getIndustrialDatasetDetail,
  getIndustrialDatasetsByYear,
} from '@/src/services/data/industry';
import {
  getVisualDatasetDetail,
  getVisualDatasetsByYear,
} from '@/src/services/data/visual';
import {
  DatasetByIdResponse,
  DatasetByYearResponse,
} from '@/src/types/data/visual-data';

import { useQuery } from '@tanstack/react-query';

interface UserDataByDatasetIdParams {
  type?: UserType;
  datasetId: number;
}

// 년도별 조회

export const useDatasetsByYear = ({
  type,
  yearId,
}: {
  type: UserType;
  yearId: number;
}) => {
  return useQuery<DatasetByYearResponse>({
    queryKey: datasetQueryKeys.listByYear(type, yearId),
    queryFn: () => {
      if (type === 'VISUAL') {
        return getVisualDatasetsByYear(yearId);
      }
      return getIndustrialDatasetsByYear(yearId);
    },
    enabled: !!type && !!yearId,
  });
};

// 상세 조회
export const useDataByDatasetId = ({
  type,
  datasetId,
}: UserDataByDatasetIdParams) => {
  return useQuery<DatasetByIdResponse>({
    queryKey: datasetQueryKeys.detail(datasetId),
    queryFn: () => {
      if (type === 'VISUAL') {
        return getVisualDatasetDetail(datasetId!);
      }
      return getIndustrialDatasetDetail(datasetId!);
    },

    enabled: !!type && !!datasetId,
  });
};
