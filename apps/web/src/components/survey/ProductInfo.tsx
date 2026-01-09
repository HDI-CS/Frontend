import type {
  BrandDataSetResponse,
  ProductDataSetResponse,
} from '@/schemas/survey';
import { clsx } from 'clsx';
import InfoItem from './InfoItem';

interface ProductInfoProps {
  type: 'visual' | 'industry';
  data: ProductDataSetResponse | BrandDataSetResponse;
  className?: string;
}

export default function ProductInfo({
  type,
  data,
  className,
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
  const id = data.id;
  const name = isProductData(data) ? data.productName : data.name;
  const category = isProductData(data) ? data.productPath : data.sectorCategory;

  return (
    <div className={clsx('space-y-6', className)}>
      <h1 className="border-b border-blue-100 pb-6 text-2xl font-bold text-gray-900">
        {name}
      </h1>

      <div className="space-y-6 text-[15px]">
        <InfoItem label="ID" value={id} />
        <InfoItem label="부문·카테고리" value={category || ''} />

        {isBrandData(data) ? (
          // Brand specific information
          <>
            <InfoItem
              label="대표 제품 카테고리"
              value={data.mainProductCategory || ''}
            />
            <InfoItem label="대표 제품" value={data.mainProduct || ''} />
            <InfoItem label="타겟(성별/연령)" value={data.target || ''} />
            <InfoItem
              label="홈페이지"
              value={
                data.referenceUrl ? (
                  <a
                    href={data.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(
                      'inline-block max-w-full truncate',
                      'text-blue-600 underline',
                      'hover:text-blue-800',
                      'transition-colors duration-200'
                    )}
                  >
                    {data.referenceUrl}
                  </a>
                ) : (
                  ''
                )
              }
            />
          </>
        ) : (
          // Product specific information
          <>
            <InfoItem label="출시/등록일" value={data.registeredAt || ''} />
            <InfoItem
              label="제품규격(사이즈/무게)"
              value={`${data.size || ''}${data.weight ? `/${data.weight}` : ''}`}
            />
            <InfoItem label="소재" value={data.material || ''} />
            <InfoItem
              label="참고사이트"
              value={
                data.referenceUrl ? (
                  <a
                    href={data.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(
                      'inline-block max-w-full truncate',
                      'text-blue-600 underline',
                      'hover:text-blue-800',
                      'transition-colors duration-200'
                    )}
                  >
                    {data.referenceUrl}
                  </a>
                ) : (
                  ''
                )
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
