import z from 'zod';

// 연도 스키마
export const YearSchema = z.object({
  id: z.number(),
  year: z.number(),
});
export const YearsSchema = z.array(YearSchema);

// 데이터 셋 기본 스키마
export const DataItemSchema = z.object({
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

export const DataItemsSchema = z.array(DataItemSchema);

// 데이터 카테고리 스키마
export const DataCategoryGroupSchema = z.object({
  categoryName: z.string(),
  data: DataItemsSchema,
});
export const DataCategoryGroupsSchema = z.array(DataCategoryGroupSchema);

// 연도 목록 조회 응답 스키마
export const YearListResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: YearsSchema,
});

// 데이터셋 리스트 조회 응답 스키마
export const GetDataByCategoryResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: DataCategoryGroupsSchema,
});

// 데이터셋 카테고리별 검색 조회 응답 스키마
export const GetDataByKeywordyResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: DataItemsSchema,
});

// 데이터셋 상세 조회 응답 스키마
export const GetDetailtDataByCategoryResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: DataItemSchema,
});

// 이미지 객체 스키마
export const UploadUrlSchema = z.object({
  uploadUrl: z.string(),
});

// 데이터셋 생성 요청 스키마
export const CreateDatasetRequestSchema = z.object({
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
export const UpdateDatasetRequestSchema = z
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
export type DataItem = z.infer<typeof DataItemSchema>;
export type DataItems = z.infer<typeof DataItemsSchema>;
export type DataCategoryGroup = z.infer<typeof DataCategoryGroupSchema>;
export type DataCategoryGroups = z.infer<typeof DataCategoryGroupsSchema>;

export type GetDataByKeywordyResponse = z.infer<
  typeof GetDataByKeywordyResponseSchema
>;
export type GetDataByCategoryResponse = z.infer<
  typeof GetDataByCategoryResponseSchema
>;
export type GetDetailtDataByCategoryResponse = z.infer<
  typeof GetDetailtDataByCategoryResponseSchema
>;
export type CreateDatasetRequest = z.infer<typeof CreateDatasetRequestSchema>;
export type CreateDatasetResponse = z.infer<typeof CreateDatasetResponseSchema>;

export type DuplicateDatasetRequest = z.infer<
  typeof DuplicateDatasetRequestSchema
>;
export type DuplicateDatasetResponse = z.infer<
  typeof DuplicateDatasetResponseSchema
>;

export type UpdateDatasetRequest = z.infer<typeof UpdateDatasetRequestSchema>;
export type UpdateDatasetResponse = z.infer<typeof UpdateDatasetResponseSchema>;

export type DeleteDatasetRequest = z.infer<typeof DeleteDatasetRequestSchema>;
export type DeleteDatasetResponse = z.infer<typeof DeleteDatasetResponseSchema>;
