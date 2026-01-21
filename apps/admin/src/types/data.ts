import { VisualDataItem } from '../schemas/visual-data';
import { ApiResponse, BaseResponse } from './common';

// 시각 디자인 데이터셋 리스트 조회
export type RequestGetDataDto = ApiResponse<VisualDataItem>;

export type RequestEditDataDto = {
  code: string;
  name: string;
  sectorCategory: string;
  mainProductCategory: string;
  mainProduct: string;
  target: string;
  referenceUrl: string;
  logoImage: File | null;
};

export type ResponseEditDataDto = BaseResponse;
