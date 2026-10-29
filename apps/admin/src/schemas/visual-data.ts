import z from 'zod';
import {
  buildNullableShape,
  VISUAL_CATEGORY_CONFIG,
  VISUAL_CATEGORY_KEYS,
  VISUAL_ITEM_NULLABLE_KEYS,
} from '../config/adminCategoryConfig';
import { YearsSchema } from './survey';

type VisualCategoryKey = keyof typeof VISUAL_CATEGORY_CONFIG;

export const VisualCategorySchema = z.enum(
  VISUAL_CATEGORY_KEYS as [VisualCategoryKey, ...VisualCategoryKey[]]
);

// 카테고리별 "추가 스펙(attributes)" 필드 정의. IndustryCategoryFieldSpec과 동일한 패턴.
export const VisualCategoryFieldSpecSchema = z.object({
  id: z.number(),
  fieldKey: z.string(),
  fieldLabel: z.string(),
  displayOrder: z.number(),
});

export const VisualCategoryFieldSpecListSchema = z.array(
  VisualCategoryFieldSpecSchema
);

export type VisualCategoryFieldSpec = z.infer<
  typeof VisualCategoryFieldSpecSchema
>;

// 연도 스키마
export const YearFolderSchema = z.object({
  yearId: z.number(),
  folderName: z.string().nullable(),
  updatedAt: z.string(),
  createdAt: z.string(),
});
export const YearFolderArraySchema = z.array(YearFolderSchema);

// 시디 데이터 셋 기본 스키마
export const VisualDataItemSchema = z.object({
  id: z.number(),
  code: z.string(),
  logoImage: z.string().nullable(),
  attributes: z.record(z.string(), z.string()).nullable().optional(),
  ...buildNullableShape(VISUAL_ITEM_NULLABLE_KEYS),
});

export const VisualDatasItemSchema = z.array(VisualDataItemSchema);

// 데이터 카테고리 스키마
export const VisualDataCategoryGroupSchema = z.object({
  categoryName: z.string(),
  data: VisualDatasItemSchema,
});
export const VisualDataCategoryGroupsSchema = z.array(
  VisualDataCategoryGroupSchema
);

// 연도 목록 조회 응답 스키마
export const YearListResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: YearsSchema,
});

// 데이터셋 리스트 조회 응답 스키마
export const GetVisualDataByCategoryResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: VisualDataCategoryGroupsSchema,
});

// 데이터셋 카테고리별 검색 조회 응답 스키마
export const GetVisualDataByKeywordyResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: VisualDatasItemSchema,
});

// 데이터셋 상세 조회 응답 스키마
export const GetDetailVisualDataByCategoryResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: VisualDataItemSchema,
});

// 이미지 객체 스키마
export const UploadUrlSchema = z.object({
  uploadUrl: z.string(),
});

// 데이터셋 생성 요청 스키마
export const CreateVisualDatasetRequestSchema = z.object({
  code: z.string(),
  name: z.string().nullable(),
  sectorCategory: z.string().nullable(),
  referenceUrl: z.string().nullable(),
  originalLogoImage: z.string().nullable(),

  // 카테고리마다 다른 스펙 필드 (고정 컬럼이 아닌 key-value)
  attributes: z.record(z.string(), z.string()).nullable().optional(),

  visualDataCategory: VisualCategorySchema.nullable(),
});

// 데이터셋 생성 응답 스키마
export const CreateVisualDatasetResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: UploadUrlSchema,
});

// 데이터셋 복제 요청 스키마
export const DuplicateDatasetRequestSchema = z.object({
  ids: z.array(z.number()),
});

// 시각 디자인 데이터셋 수정 요청 스키마
export const UpdateVisualDatasetRequestSchema = z
  .object({
    code: z.string(),
    name: z.string().nullable(),
    sectorCategory: z.string().nullable(),
    referenceUrl: z.string().nullable(),

    attributes: z.record(z.string(), z.string()).nullable().optional(),

    originalLogoImage: z.string().nullable(), // 빈 값일 땐 널
    visualDataCategory: VisualCategorySchema.nullable(),
  })
  .partial();

// 데이터셋 삭제 응답 스키마
export const UpdateDatasetResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: UploadUrlSchema,
});

// 데이터셋 삭제 응답 스키마
export const DuplicateDatasetResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
});

// 데이터셋 삭제 요청 스키마
export const DeleteDatasetRequestSchema = z.object({
  ids: z.array(z.number()),
});

// 데이터셋 삭제 응답 스키마
export const DeleteDatasetResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: z.null(),
});

export const DatasetCandidateSchema = z.object({
  id: z.number(),
  code: z.string(),
});
export const DatasetCandidateArraySchema = z.array(DatasetCandidateSchema);

// 전문가에게 매칭할 데이터셋 후보 조회 응답 스키마

export const GetDatasetCandidatesResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  result: DatasetCandidateArraySchema,
});

export const DownloadImageRequestSchema = z.object({
  ids: z.array(z.number()),
});

// 타입 추출
export type YearFolder = z.infer<typeof YearFolderSchema>;
export type YearFolderArray = z.infer<typeof YearFolderArraySchema>;
export type VisualDataItem = z.infer<typeof VisualDataItemSchema>;
export type VisualDatasItem = z.infer<typeof VisualDatasItemSchema>;
export type VisualDataCategoryGroup = z.infer<
  typeof VisualDataCategoryGroupSchema
>;
export type VisualDataCategoryGroups = z.infer<
  typeof VisualDataCategoryGroupsSchema
>;
export type VisualCategory = z.infer<typeof VisualCategorySchema>;

export type GetVisualDataByKeywordyResponse = z.infer<
  typeof GetVisualDataByKeywordyResponseSchema
>;
export type GetVisualDataByCategoryResponse = z.infer<
  typeof GetVisualDataByCategoryResponseSchema
>;
export type GetDetailVisualDataByCategoryResponse = z.infer<
  typeof GetDetailVisualDataByCategoryResponseSchema
>;
export type CreateVisualDatasetRequest = z.infer<
  typeof CreateVisualDatasetRequestSchema
>;
export type CreateVisualDatasetResponse = z.infer<
  typeof CreateVisualDatasetResponseSchema
>;

export type DuplicateDatasetRequest = z.infer<
  typeof DuplicateDatasetRequestSchema
>;
export type DuplicateDatasetResponse = z.infer<
  typeof DuplicateDatasetResponseSchema
>;

export type UpdateVisualDatasetRequest = z.infer<
  typeof UpdateVisualDatasetRequestSchema
>;
export type UpdateDatasetResponse = z.infer<typeof UpdateDatasetResponseSchema>;

export type DeleteDatasetRequest = z.infer<typeof DeleteDatasetRequestSchema>;
export type DeleteDatasetResponse = z.infer<typeof DeleteDatasetResponseSchema>;
export type DatasetCandidateArray = z.infer<typeof DatasetCandidateArraySchema>;
export type GetDatasetCandidatesResponse = z.infer<
  typeof GetDatasetCandidatesResponseSchema
>;
export type DownloadImageRequest = z.infer<typeof DownloadImageRequestSchema>;
