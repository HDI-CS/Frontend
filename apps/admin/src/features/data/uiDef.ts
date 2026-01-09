import {
  ColumnDef,
  IndustrialRow,
  VisualRow,
  WithIndex,
} from '@/src/types/data/visual-data';

export type DetailFieldDef<T> = {
  label: string;
  render: (row: T) => React.ReactNode;
};

export type GalleryFieldDef<T> = {
  label: string;
  value: (row: T) => string;
};

// 테이블/갤러리/모달에서 공통으로 쓰는 "row meta"
export type RowMeta<T> = {
  columns: ColumnDef<WithIndex<T>>[];
  galleryFields: GalleryFieldDef<WithIndex<T>>[];
  // 갤러리에서 이미지로 쓸 값
  getImageSrc: (row: T) => string | null;
  // 갤러리에서 이미지 alt
  getImageAlt: (row: T) => string;
  // 링크 필드 표시/생성
  getUrl?: (row: T) => string | undefined;
};

export type AnyRow = VisualRow | IndustrialRow;

export type MetaByType = {
  VISUAL: RowMeta<VisualRow>;
  INDUSTRY: RowMeta<IndustrialRow>;
};
