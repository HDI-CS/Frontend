import z from 'zod';

export type VisualCategory = 'COSMETIC' | 'FB';

// 연도 스키마
export const YearSchema = z.object({
  id: z.number(),
  year: z.number(),
});
export const YearsSchema = z.array(YearSchema);

// 시디 데이터 셋 기본 스키마
export const VisualDataItemSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  sectorCategory: z.string(),
  mainProductCategory: z.string(),
  mainProduct: z.string(),
  target: z.string(),
  referenceUrl: z.string(),
  logoImage: z.string().nullable(),
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
  name: z.string(),
  sectorCategory: z.string(),
  mainProductCategory: z.string(),
  mainProduct: z.string(),
  target: z.string(),
  referenceUrl: z.string(),
  originalLogoImage: z.string().nullable(),
  visualDataCategory: z.string(),
});

// 데이터셋 생성 응답 스키마
export const CreateDatasetResponseSchema = z.object({
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
    name: z.string(),
    sectorCategory: z.string(),
    mainProductCategory: z.string(),
    mainProduct: z.string(),
    target: z.string(),
    referenceUrl: z.string(),
    originalLogoImage: z.string().nullable(), // 빈 값일 땐 널
    visualDataCategory: z.string(),
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

// export const DownloadExcelResponseSchema = z.object({
//   code: z.number(),
//   message: z.string(),

// });

// 타입 추출
export type Year = z.infer<typeof YearSchema>;
export type Years = z.infer<typeof YearsSchema>;
export type VisualDataItem = z.infer<typeof VisualDataItemSchema>;
export type VisualDatasItem = z.infer<typeof VisualDatasItemSchema>;
export type VisualDataCategoryGroup = z.infer<
  typeof VisualDataCategoryGroupSchema
>;
export type VisualDataCategoryGroups = z.infer<
  typeof VisualDataCategoryGroupsSchema
>;

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
export type CreateDatasetResponse = z.infer<typeof CreateDatasetResponseSchema>;

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
