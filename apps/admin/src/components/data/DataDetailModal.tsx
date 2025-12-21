'use client';
import blueClose from '@/public/data/blueClose.svg';
import empty from '@/public/data/EmptyIMg.svg';
import { RequestEditDataDto } from '@/src/types/data';
import { VisualDataItem } from '@/src/types/data/visual-data';
import clsx from 'clsx';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import LinedField from './LinedField';

interface EditDataProps {
  dataId: number | null; //  id
  onClose: () => void;
  isEdit: boolean;
}

// 더미 데이터 (상세 조회 API로 대체 예정)
const item: VisualDataItem = {
  id: 1,
  code: '0101',
  name: '스타벅스',
  sectorCategory: 'cafe',
  mainProductCategory: '식품>음료>커피',
  mainProduct: '아메리카노',
  target: '전연령',
  referenceUrl: 'www.starbucks.co.kr',
  logoImage: empty,
};

const DataDetailModal = ({ onClose, isEdit }: EditDataProps) => {
  const [activeField, setActvieField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { dirtyFields },
  } = useForm<RequestEditDataDto>({
    defaultValues: {
      code: item.code,
      name: item.name,
      sectorCategory: item.sectorCategory,
      mainProductCategory: item.mainProductCategory,
      mainProduct: item.mainProduct,
      target: item.target,
      referenceUrl: item.referenceUrl,
      logoImage: null, // File | null
    },
  });

  const logoFile = watch('logoImage');

  const logoPreviewSrc = useMemo<string | StaticImageData>(() => {
    if (logoFile instanceof File) {
      return URL.createObjectURL(logoFile); // string
    }
    return item.logoImage; // StaticImageData
  }, [logoFile]);

  /*  텍스트 필드 렌더링 */
  const renderField = (label: string, field: keyof RequestEditDataDto) => (
    <LinedField label={label} activeField={activeField}>
      {isEdit ? (
        <input
          {...register(field)}
          onClick={(e) => {
            e.stopPropagation();
            setActvieField(label);
          }}
          className="w-full rounded border border-[#E9E9E7] px-2 py-1 text-base font-normal outline-[#4676FB]"
        />
      ) : (
        <span>{item[field] as string}</span>
      )}
    </LinedField>
  );

  const onSubmit = (data: RequestEditDataDto) => {
    const formData = new FormData();

    (Object.keys(dirtyFields) as (keyof RequestEditDataDto)[]).forEach(
      (key) => {
        const value = data[key];

        if (value === null || value === undefined) return;

        if (key === 'logoImage' && value instanceof File) {
          formData.append('logoImage', value);
        } else {
          formData.append(key, String(value));
        }
      }
    );

    // 수정 api

    console.log('FormData:', [...formData.entries()]);
  };

  useEffect(() => {
    // 스크롤 잠금
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // 언마운트 시 원복
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setActvieField(null);
        }}
        className={clsx('min-w-150 p-6.5 bg-white')}
      >
        {/* 내용이 많아지면 여기만 스크롤 */}

        <ul className="flex w-full flex-col gap-4 text-xl font-bold text-[#3A3A49]">
          <li className="border-b-1 mb-0 flex w-full justify-between border-[#E9E9E7] pb-2">
            <span className="">{item.id}</span>
            <Image
              onClick={onClose}
              src={blueClose}
              alt="close"
              className="cursor-pointer"
            />
          </li>

          {renderField('ID', 'code')}
          {renderField('브랜드명', 'name')}
          {renderField('부문·카테고리', 'sectorCategory')}
          {renderField('대표 제품 카테고리', 'mainProductCategory')}
          {renderField('대표 제품', 'mainProduct')}
          {renderField('타겟(성별/연령)', 'target')}
          {renderField('홈페이지', 'referenceUrl')}

          {/*이미지 업로드는 api 연결 구현 시*/}
          <LinedField
            label="로고 이미지"
            activeField={activeField}
            isImg={true}
          >
            {isEdit && (
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setValue('logoImage', file, { shouldDirty: true });
                }}
              />
            )}
            <label
              htmlFor={isEdit ? 'logo-upload' : undefined}
              className={clsx(
                'flex justify-center',
                isEdit && 'cursor-pointer'
              )}
            >
              <div className="flex justify-center">
                <Image
                  src={logoPreviewSrc}
                  alt="logo"
                  width={160}
                  height={160}
                  className={isEdit ? 'transition hover:opacity-80' : ''}
                />
              </div>
            </label>
          </LinedField>

          {isEdit && (
            <div className="flex w-full justify-center">
              <button
                onClick={handleSubmit(onSubmit)}
                className="w-21 cursor-pointer rounded bg-[#4676FB] px-7 py-3 text-base font-normal text-[#ffffff] hover:opacity-90"
              >
                저장
              </button>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};
export default DataDetailModal;
