import z from 'zod';
import {
  buildNullableShape,
  INDUSTRY_CATEGORY_CONFIG,
  INDUSTRY_CATEGORY_KEYS,
  INDUSTRY_ITEM_NULLABLE_KEYS,
} from '../config/adminCategoryConfig';

type IndustryCategoryKey = keyof typeof INDUSTRY_CATEGORY_CONFIG;

export const IndustryCategorySchema = z.enum(
  INDUSTRY_CATEGORY_KEYS as [IndustryCategoryKey, ...IndustryCategoryKey[]]
);

export const IndustryImageTypeSchema = z.enum([
  'originalDetailImagePath',
  'originalFrontImagePath',
  'originalSideImagePath',
  'originalSide2ImagePath',
  'originalSide3ImagePath',
]);

export type IndustryCategory = z.infer<typeof IndustryCategorySchema>;

// 산디 데이터 셋 기본 스키마
export const IndustrialDataItemSchema = z.object({
  id: z.number(),
  code: z.string(),
  ...buildNullableShape(INDUSTRY_ITEM_NULLABLE_KEYS),
  productName: z.string(),
  detailImagePath: z.string().nullable(),
  frontImagePath: z.string().nullable(),
  sideImagePath: z.string().nullable(),
  side2ImagePath: z.string().nullable(),
  side3ImagePath: z.string().nullable(),
});

export const IndustrialDatasItemSchema = z.array(IndustrialDataItemSchema);

// 데이터 카테고리 스키마
export const IndustrialDataCategoryGroupSchema = z.object({
  categoryName: z.string(),
  data: IndustrialDatasItemSchema,
});
export const IndustrialDataCategoryGroupsSchema = z.array(
  IndustrialDataCategoryGroupSchema
);

// 데이터셋 리스트 조회 응답 스키마
export const GetIndustrialDataByCategoryResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: IndustrialDataCategoryGroupsSchema,
});

// 데이터셋 카테고리별 검색 조회 응답 스키마
export const GetIndustrialDataByKeywordyResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: IndustrialDatasItemSchema,
});

// 데이터셋 상세 조회 응답 스키마
export const GetDetailIndustrialDataByCategoryResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: IndustrialDataItemSchema,
});

// 이미지 객체 스키마
export const UploadUrlSchema = z.object({
  uploadUrl: z.string(),
});

// 데이터셋 생성 요청 스키마
export const CreateIndustrialDatasetRequestSchema = z.object({
  code: z.string(),
  ...buildNullableShape(INDUSTRY_ITEM_NULLABLE_KEYS),
  productName: z.string(),

  originalDetailImagePath: z.string().nullable(),
  originalFrontImagePath: z.string().nullable(),
  originalSideImagePath: z.string().nullable(),
  originalSide2ImagePath: z.string().nullable(),
  originalSide3ImagePath: z.string().nullable(),

  industryDataCategory: IndustryCategorySchema,
});

// 이미지 객체 스키마

export const IndustrialUploadUrlSchema = z.object({
  detailUploadUrl: z.string(),
  frontUploadUrl: z.string(),
  sideUploadUrl: z.string(),

  side2UploadUrl: z.string(),
  side3UploadUrl: z.string(),
});

export const CreateIndustrialDatasetResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: IndustrialUploadUrlSchema,
});

// 시각 디자인 데이터셋 수정 요청 스키마
export const UpdateIndustrialDatasetRequestSchema = z
  .object({
    code: z.string(),
    ...buildNullableShape(INDUSTRY_ITEM_NULLABLE_KEYS),

    originalDetailImagePath: z.string().nullable(),
    originalFrontImagePath: z.string().nullable(),
    originalSideImagePath: z.string().nullable(),
    originalSide2ImagePath: z.string().nullable(),
    originalSide3ImagePath: z.string().nullable(),

    industryDataCategory: IndustryCategorySchema,
  })
  .partial();

// 타입 추출
export type IndustryImageType = z.infer<typeof IndustryImageTypeSchema>;
export type IndustrialDataItem = z.infer<typeof IndustrialDataItemSchema>;
export type IndustrialDataItems = z.infer<typeof IndustrialDatasItemSchema>;
export type IndustrialDataCategoryGroup = z.infer<
  typeof IndustrialDataCategoryGroupSchema
>;
export type IndustrialDataCategoryGroups = z.infer<
  typeof IndustrialDataCategoryGroupsSchema
>;

export type GetIndustrialDataByKeywordyResponse = z.infer<
  typeof GetIndustrialDataByKeywordyResponseSchema
>;
export type GetIndustrialDataByCategoryResponse = z.infer<
  typeof GetIndustrialDataByCategoryResponseSchema
>;
export type GetDetailIndustrialDataByCategoryResponse = z.infer<
  typeof GetDetailIndustrialDataByCategoryResponseSchema
>;
export type CreateIndustrialDatasetRequest = z.infer<
  typeof CreateIndustrialDatasetRequestSchema
>;
export type CreateIndustrialDatasetResponse = z.infer<
  typeof CreateIndustrialDatasetResponseSchema
>;
export type UpdateIndustrialDatasetRequest = z.infer<
  typeof UpdateIndustrialDatasetRequestSchema
>;
