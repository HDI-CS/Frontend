'use client';
import empty from '@/public/data/EmptyIMg.svg';
import {
  getImageSrcByType,
  INDUSTRY_FIELDS,
  updateRequestMapper,
  VISUAL_FIELDS,
} from '@/src/features/data/rowMeta';
import { useDataByDatasetId } from '@/src/hooks/data/useDatasetsByYear';
import { useUpdateDataset } from '@/src/hooks/data/useUpdateDataset';
import { UserType } from '@/src/schemas/auth';
import { UpdateIndustrialDatasetRequest } from '@/src/schemas/industry-data';
import { UpdateVisualDatasetRequest } from '@/src/schemas/visual-data';
import {
  GetDetailResponseByType,
  UpdateForm,
  WithIndex,
} from '@/src/types/data/visual-data';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import ModalComponent from '../ModalComponent';
import LinedField from './LinedField';

interface DataDetailModalProps<TRow, TType extends UserType> {
  row?: WithIndex<TRow>;
  activeCategory: string;
  dataId: number | null; //  id
  currentIndex: number;
  totalLength: number;
  lastIndex: number;
  isEdit: boolean;
  isFirst: boolean;
  isLast: boolean;

  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  type: TType;
}

export const EMPTY_VISUAL_DATASET: UpdateVisualDatasetRequest = {
  code: '',
  name: '',
  sectorCategory: '',
  mainProductCategory: '',
  mainProduct: '',
  target: '',
  referenceUrl: '',
  originalLogoImage: null,
  visualDataCategory: '',
};

export const EMPTY_INDUSTRY_DATASET: UpdateIndustrialDatasetRequest = {
  code: '',
  productName: '',
  companyName: '',
  modelName: '',
  price: '',
  material: '',
  size: '',
  weight: '',
  referenceUrl: '',
  registeredAt: '',
  productPath: '',
  productTypeName: '',
  originalDetailImagePath: null,
  originalFrontImagePath: null,
  originalSideImagePath: null,
};

const DataDetailModal = <TRow, TType extends UserType>({
  type,
  row,
  dataId,
  activeCategory,
  isEdit,
  isFirst,
  isLast,

  onClose,
  onPrev,
  onNext,
}: DataDetailModalProps<TRow, TType>) => {
  useEffect(() => {
    // 스크롤 잠금
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // 언마운트 시 원복
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // 데이터 상세 조회 훅
  const { data, isError } = useDataByDatasetId({
    type,
    datasetId: Number(dataId),
  });

  const [logoFile, setLogoFile] = useState<File | null>();

  // 데이터 수정을 위한 훅
  const { mutate: updateDataset } = useUpdateDataset();

  const [activeField, setActvieField] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fields = type === 'VISUAL' ? VISUAL_FIELDS : INDUSTRY_FIELDS;

  const imageSrc = useMemo(() => {
    if (previewUrl) return previewUrl;

    const src = getImageSrcByType(type, data?.result);
    return src ?? empty;
  }, [type, data, previewUrl]);

  const item = useMemo(() => {
    if (!data?.result) {
      return type === 'VISUAL' ? EMPTY_VISUAL_DATASET : EMPTY_INDUSTRY_DATASET;
    }

    if (type === 'VISUAL') {
      const visualDetail = data.result as GetDetailResponseByType['VISUAL'];
      return updateRequestMapper.VISUAL(visualDetail, activeCategory);
    }

    const industryDetail = data.result as GetDetailResponseByType['INDUSTRY'];
    return updateRequestMapper.INDUSTRY(industryDetail);
  }, [type, data, activeCategory]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { dirtyFields },
  } = useForm<UpdateForm>();

  useEffect(() => {
    if (type === 'VISUAL') {
      reset(item as UpdateVisualDatasetRequest);
    } else {
      reset(item as UpdateIndustrialDatasetRequest);
    }
  }, [item, type, reset]);

  if (isError) return;

  /*  텍스트 필드 렌더링 */
  const renderField = (label: string, field: keyof UpdateForm) => (
    <LinedField key={label} label={label} activeField={activeField}>
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

  const onSubmit = (data: UpdateForm) => {
    if (!dataId) return;
    const requestData: Partial<UpdateForm> = {};

    (Object.keys(dirtyFields) as (keyof UpdateForm)[]).forEach((key) => {
      const value = data[key];
      if (value == null) return;
      requestData[key] = value;
    });

    // 수정 api
    updateDataset(
      {
        id: dataId,
        requestData,
        logoFile: logoFile,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <ModalComponent
      title={String(row?._no)}
      onClose={onClose}
      onSubmit={onClose}
      allow={!isEdit}
      isPrevDisabled={isFirst}
      isNextDisabled={isLast}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setActvieField(null);
        }}
        className={clsx('min-w-150 flex flex-col gap-4 bg-white')}
      >
        {/* 내용이 많아지면 여기만 스크롤 */}
        {fields.map(({ label, field }) =>
          renderField(label, field as keyof UpdateForm)
        )}

        {/*이미지 업로드는 api 연결 구현 시*/}
        {/* {renderField('로고 이미지', 'logoImage')} */}
        <LinedField label="로고 이미지" activeField={activeField} isImg={true}>
          {isEdit && (
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                if (!file) return;

                setLogoFile(file);
                setPreviewUrl(URL.createObjectURL(file));
                setValue('originalLogoImage', file?.name, {
                  shouldDirty: true,
                });
              }}
            />
          )}
          <label
            htmlFor={isEdit ? 'logo-upload' : undefined}
            className={clsx('flex justify-center', isEdit && 'cursor-pointer')}
          >
            <div className="flex flex-col justify-center gap-10">
              <Image
                src={imageSrc}
                alt="logo"
                width={160}
                height={160}
                className={isEdit ? 'border transition hover:opacity-80' : ''}
              />
            </div>
          </label>
          <div
            className="cursor-pointer"
            onClick={() => {
              setLogoFile(null);
              console.log(logoFile);
            }}
          >
            {'이미지 삭제'}
          </div>
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
        {/* </ul>
        </div> */}
      </div>
    </ModalComponent>
  );
};
export default DataDetailModal;
