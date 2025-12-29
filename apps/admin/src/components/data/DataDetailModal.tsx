'use client';
import empty from '@/public/data/EmptyIMg.svg';
import { DataItemWithIndex } from '@/src/features/data/DataYearPage';
import { useDataByDatasetId } from '@/src/hooks/data/useDatasetsByYear';
import { useUpdateDataset } from '@/src/hooks/data/useUpdateDataset';
import { UpdateDatasetRequest } from '@/src/schemas/data';
import { useAuthStore } from '@/src/store/authStore';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import ModalComponent from '../ModalComponent';
import LinedField from './LinedField';

interface DataDetailModalProps {
  row?: DataItemWithIndex;
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
}

const EMPTY_ITEM: UpdateDatasetRequest = {
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

const DataDetailModal = ({
  row,
  dataId,
  isEdit,
  isFirst,
  isLast,
  onClose,
  onPrev,
  onNext,
}: DataDetailModalProps) => {
  const { type } = useAuthStore();

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
  const { data, isLoading, isError } = useDataByDatasetId({
    type: type,
    datasetId: Number(dataId),
  });

  const [logoFile, setLogoFile] = useState<File | null>();

  // 데이터 수정을 위한 훅
  const { mutate: updateDataset } = useUpdateDataset({
    type: type ?? 'VISUAL',
  });

  const [activeField, setActvieField] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // const item = rows.find((row) => row.id === dataId) ?? dummyItem;

  // 로딩 전까지는 더미 아이템
  const item: UpdateDatasetRequest | null = useMemo(() => {
    if (isLoading || !data?.result) {
      return EMPTY_ITEM;
    }
    return data.result;
  }, [isLoading, data]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { dirtyFields },
  } = useForm<UpdateDatasetRequest>();

  useEffect(() => {
    reset({
      code: item.code,
      name: item.name,
      sectorCategory: item.sectorCategory,
      mainProductCategory: item.mainProductCategory,
      mainProduct: item.mainProduct,
      target: item.target,
      referenceUrl: item.referenceUrl,
      originalLogoImage: item.originalLogoImage,
      visualDataCategory: item.visualDataCategory,
    });
  }, [item, reset]);

  if (isError) return;

  /*  텍스트 필드 렌더링 */
  const renderField = (label: string, field: keyof UpdateDatasetRequest) => (
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

  const onSubmit = (data: UpdateDatasetRequest) => {
    if (!dataId) return;
    const requestData: Partial<UpdateDatasetRequest> = {};

    (Object.keys(dirtyFields) as (keyof UpdateDatasetRequest)[]).forEach(
      (key) => {
        const value = data[key];

        if (value === undefined || value === null) return;
        requestData[key] = value;
      }
    );

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
        {renderField('ID', 'code')}
        {renderField('브랜드명', 'name')}
        {renderField('부문·카테고리', 'sectorCategory')}
        {renderField('대표 제품 카테고리', 'mainProductCategory')}
        {renderField('대표 제품', 'mainProduct')}
        {renderField('타겟(성별/연령)', 'target')}
        {renderField('홈페이지', 'referenceUrl')}

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
                src={
                  previewUrl
                    ? previewUrl
                    : row?.logoImage
                      ? row.logoImage
                      : empty
                }
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
