import { StaticImageData } from 'next/image';

export type VisualDataItem = {
  id: number;
  code: string;
  name: string;
  sectorCategory: string;
  mainProductCategory: string;
  mainProduct: string;
  target: string;
  referenceUrl: string;
  logoImage: string | StaticImageData;
};

export type VisualDataItemWithUI = VisualDataItem & {
  _no: number;
};

export type VisualDataCategory = {
  categoryName: string;
  data: VisualDataItem[];
};

export type CategoryKey = string;
