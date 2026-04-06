import z from 'zod';

export const IndustryCategorySchema = z.enum([
  'VACUUM_CLEANER',
  'AIR_PURIFIER',
  'HAIR_DRYER',
  'HEADPHONE',
  'EARPHONE',
  'BLUETOOTH_SPEAKER',
]);

export type IndustryCategory = z.infer<typeof IndustryCategorySchema>;

// 산디 데이터 셋 기본 스키마
export const IndustrialDataItemSchema = z.object({
  id: z.number(),
  code: z.string(),
  productName: z.string(),
  companyName: z.string().nullable(),
  modelName: z.string().nullable(),
  price: z.string().nullable(),
  material: z.string().nullable(),
  size: z.string().nullable(),
  weight: z.string().nullable(),
  referenceUrl: z.string().nullable(),
  registeredAt: z.string().nullable(),
  productPath: z.string().nullable(),
  productTypeName: z.string().nullable(),

  // 2026
  noiseCancelling: z.string().nullable(),
  codec: z.string().nullable(),
  extraFeatures: z.string().nullable(),
  controlType: z.string().nullable(),
  waterproof: z.string().nullable(),
  maxPlayTime: z.string().nullable(),
  chargeTime: z.string().nullable(),
  usage: z.string().nullable(),
  shoppingUrl: z.string().nullable(),
  connectivity: z.string().nullable(),
  soundOutput: z.string().nullable(),

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
  productName: z.string(),
  companyName: z.string().nullable(),
  modelName: z.string().nullable(),
  price: z.string().nullable(),
  material: z.string().nullable(),
  size: z.string().nullable(),
  weight: z.string().nullable(),
  referenceUrl: z.string().nullable,
  registeredAt: z.string().nullable(),
  productPath: z.string().nullable(),
  productTypeName: z.string().nullable(),

  // 2026
  noiseCancelling: z.string().nullable(),
  codec: z.string().nullable(),
  extraFeatures: z.string().nullable(),
  controlType: z.string().nullable(),
  waterproof: z.string().nullable(),
  maxPlayTime: z.string().nullable(),
  chargeTime: z.string().nullable(),
  usage: z.string().nullable(),
  shoppingUrl: z.string().nullable(),
  connectivity: z.string().nullable(),
  soundOutput: z.string().nullable(),

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
    productName: z.string().nullable(),
    companyName: z.string().nullable(),
    modelName: z.string().nullable(),
    price: z.string().nullable(),
    material: z.string().nullable(),
    size: z.string().nullable(),
    weight: z.string().nullable(),
    referenceUrl: z.string().nullable(),
    registeredAt: z.string().nullable(),
    productPath: z.string().nullable(),
    productTypeName: z.string().nullable(),

    // 2026
    noiseCancelling: z.string().nullable(),
    codec: z.string().nullable(),
    extraFeatures: z.string().nullable(),
    controlType: z.string().nullable(),
    waterproof: z.string().nullable(),
    maxPlayTime: z.string().nullable(),
    chargeTime: z.string().nullable(),
    usage: z.string().nullable(),
    shoppingUrl: z.string().nullable(),
    connectivity: z.string().nullable(),
    soundOutput: z.string().nullable(),

    originalDetailImagePath: z.string().nullable(), // 빈 값일 땐 널
    originalFrontImagePath: z.string().nullable(), // 빈 값일 땐 널
    originalSideImagePath: z.string().nullable(), // 빈 값일 땐 널 여러개 삭제되면 리스트로…!! (image=DETAIL & image=FRONT)
    originalSide2ImagePath: z.string().nullable(), // 빈 값일 땐 널
    originalSide3ImagePath: z.string().nullable(), // 빈 값일 땐 널

    industryDataCategory: IndustryCategorySchema,
  })
  .partial();

// 타입 추출

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
