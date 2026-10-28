import { PRODUCT_INFO_CONFIG } from '@/config/productInfoConfig';
import type {
  BrandDataSetResponse,
  ProductDataSetResponse,
} from '@/schemas/survey';
import { surveyService } from '@/services/survey';
import { formatValue } from '@/utils/formatValue';
import { useQuery } from '@tanstack/react-query';
import { clsx } from 'clsx';
import InfoItem from './InfoItem';

interface ProductInfoProps {
  type: 'visual' | 'industry';
  data: ProductDataSetResponse | BrandDataSetResponse;
  className?: string;
  dataCode: string;
}

export default function ProductInfo({
  type,
  data,
  className,
  dataCode,
}: ProductInfoProps) {
  // 타입별 필드 추출 (타입 가드 활용)
  const isProductData = (
    data: ProductDataSetResponse | BrandDataSetResponse
  ): data is ProductDataSetResponse => {
    return type === 'industry';
  };

  const isBrandData = (
    data: ProductDataSetResponse | BrandDataSetResponse
  ): data is BrandDataSetResponse => {
    return type === 'visual';
  };

  // 공통 필드
  // const id = data.id;
  const name = isProductData(data) ? data.productName : data.name;
  // const path = isProductData(data) ? data.productPath : data.sectorCategory;
  const category = isProductData(data)
    ? data.industryDataCategory
    : data.visualDataCategory;

  function getFields(type: 'visual' | 'industry', category: string | null) {
    if (!category) return [];

    if (type === 'visual') {
      return (
        PRODUCT_INFO_CONFIG.visual[
          category as keyof typeof PRODUCT_INFO_CONFIG.visual
        ] ?? []
      );
    }

    return (
      PRODUCT_INFO_CONFIG.industry[
        category as keyof typeof PRODUCT_INFO_CONFIG.industry
      ] ?? []
    );
  }
  const fields = getFields(type, category);

  // attributes(추가 스펙)의 key를 사람이 읽는 라벨로 바꿔 보여주기 위한 조회.
  // 정의 안 된 키는 label이 없으니 key 그대로 쓴다.
  const { data: fieldSpecs } = useQuery({
    queryKey: ['industryCategoryFieldSpecs', category],
    queryFn: () =>
      surveyService.getIndustryCategoryFieldSpecs({
        category: category as string,
      }),
    enabled: type === 'industry' && !!category,
  });
  const specLabelByKey = new Map(
    (fieldSpecs ?? []).map((spec) => [spec.fieldKey, spec.fieldLabel])
  );

  return (
    <div className={clsx('space-y-6', className)}>
      <h1 className="border-b border-blue-100 pb-6 text-2xl font-bold text-gray-900">
        {name}
      </h1>

      <div className="space-y-6 text-[15px]">
        {/* <InfoItem label="ID" value={id} />
        <InfoItem label="부문·카테고리" value={path || ''} /> */}

        {isBrandData(data) ? (
          // Brand specific information
          <>
            <div className="space-y-4">
              <InfoItem label="Code" value={dataCode} name={data.id} />

              {fields.map((field) => {
                const value = formatValue(
                  field.key,
                  data[field.key as keyof BrandDataSetResponse]
                );

                return (
                  <InfoItem
                    key={field.key}
                    name={field.key}
                    label={field.label}
                    value={value ?? ''}
                  />
                );
              })}
            </div>
          </>
        ) : (
          // Product specific information
          <>
            <div className="space-y-4">
              <InfoItem label="ID" value={dataCode} name={data.id} />

              {fields.map((field) => {
                const value = formatValue(
                  field.key,
                  data[
                    field.key as Exclude<
                      keyof ProductDataSetResponse,
                      'attributes'
                    >
                  ]
                );

                return (
                  <InfoItem
                    key={field.key}
                    name={field.key}
                    label={field.label}
                    value={value ?? ''}
                  />
                );
              })}

              {/* 고정 필드 레지스트리에 없는, 이 제품만의 추가 스펙.
                  카테고리에 정의된 스펙이면 라벨로, 아니면(레거시) key 그대로 보여준다. */}
              {isProductData(data) &&
                data.attributes &&
                Object.entries(data.attributes).map(([key, value]) => (
                  <InfoItem
                    key={key}
                    name={key}
                    label={specLabelByKey.get(key) ?? key}
                    value={value}
                  />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
