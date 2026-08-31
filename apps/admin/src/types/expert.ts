export type dataIdsTempSet = {
  memberId: number;
  name: string;
  dataIds: { datasetId: number; dataCode: string }[];
  isTemp?: boolean; // 임시 행 여부
};

