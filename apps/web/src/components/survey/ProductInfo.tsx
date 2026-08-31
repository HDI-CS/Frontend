import { PRODUCT_INFO_CONFIG } from '@/config/productInfoConfig';
import type {
  BrandDataSetResponse,
  ProductDataSetResponse,
} from '@/schemas/survey';
import { formatValue } from '@/utils/formatValue';
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
                  data[field.key as keyof ProductDataSetResponse]
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
        )}
      </div>
    </div>
  );
}
