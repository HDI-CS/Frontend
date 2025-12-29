import { datasetQueryKeys } from '@/src/queries/dataQuery';
import { UserType } from '@/src/schemas/auth';
import {
  GetDataByCategoryResponse,
  GetDetailtDataByCategoryResponse,
} from '@/src/schemas/data';
import { getDatasetsByYear, getDetailDatasetsById } from '@/src/services/data';
import { useQuery } from '@tanstack/react-query';

interface UseDatasetsByYearParams {
  type?: UserType;
  year?: number;
}

interface UserDataByDatasetIdParams {
  type?: UserType;
  datasetId: number;
}

export const useDatasetsByYear = ({ type, year }: UseDatasetsByYearParams) => {
  return useQuery<GetDataByCategoryResponse>({
    queryKey: datasetQueryKeys.listByYear(type, year),
    queryFn: () => getDatasetsByYear({ type: type!, year: year! }), // enabled가 true일 때만 실행됨
    enabled: !!type && !!year,
  });
};

export const useDataByDatasetId = ({
  type,
  datasetId,
}: UserDataByDatasetIdParams) => {
  return useQuery<GetDetailtDataByCategoryResponse>({
    queryKey: datasetQueryKeys.detail(datasetId),
    queryFn: () => getDetailDatasetsById({ type: type!, datasetId }),
    enabled: !!type && !!datasetId,
  });
};
