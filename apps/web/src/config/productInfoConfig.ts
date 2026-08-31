import {
  INDUSTRY_CATEGORY_CONFIG,
  INDUSTRY_CATEGORY_KEYS,
  VISUAL_CATEGORY_CONFIG,
  VISUAL_CATEGORY_KEYS,
} from './categoryConfig';

export type FieldConfig = {
  label: string;
  key: string;
  type?: 'link';
};

export const SURVEY_INFO_CONFIG = {
  visual: Object.fromEntries(
    Object.entries(VISUAL_CATEGORY_CONFIG).map(([key, v]) => [key, v.survey])
  ),
  industry: Object.fromEntries(
    Object.entries(INDUSTRY_CATEGORY_CONFIG).map(([key, v]) => [key, v.survey])
  ),
} as const;

export const PRODUCT_INFO_CONFIG = {
  visual: Object.fromEntries(
    Object.entries(VISUAL_CATEGORY_CONFIG).map(([key, v]) => [key, v.fields])
  ),
  industry: Object.fromEntries(
    Object.entries(INDUSTRY_CATEGORY_CONFIG).map(([key, v]) => [key, v.fields])
  ),
} as const;

export const weightEvaluationCategoriesByType = {
  VISUAL: VISUAL_CATEGORY_KEYS,
  INDUSTRY: INDUSTRY_CATEGORY_KEYS,
} as const;

// 이 객체의 키 타입 ('VISUAL' | 'INDUSTRY')을 다른 파일에서 재사용
export type EvaluationDomainType =
  keyof typeof weightEvaluationCategoriesByType;
