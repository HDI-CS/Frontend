'use client';
import empty from '@/public/data/EmptyIMg.svg';
import close from '@/public/data/close.svg';
import { CategoryByType } from '@/src/features/data/DataYearPage';
import {
  getImageSrcByType,
  INDUSTRY_FIELDS,
  updateRequestMapper,
  VISUAL_FIELDS,
} from '@/src/features/data/rowMeta';
import { useCreateDataset } from '@/src/hooks/data/useCreateVisualDataset';
import { useDataByDatasetId } from '@/src/hooks/data/useDatasetsByYear';
import { useUpdateDataset } from '@/src/hooks/data/useUpdateDataset';
import { UserType } from '@/src/schemas/auth';
import {
  CreateIndustrialDatasetRequest,
  IndustryCategory,
  UpdateIndustrialDatasetRequest,
} from '@/src/schemas/industry-data';
import {
  CreateVisualDatasetRequest,
  UpdateVisualDatasetRequest,
  VisualCategory,
} from '@/src/schemas/visual-data';
import {
  GetDetailResponseByType,
  UpdateForm,
  WithIndex,
} from '@/src/types/data/visual-data';
import clsx from 'clsx';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import ImageDropZone from '../ImageDropZone';
import ModalComponent from '../ModalComponent';
import LinedField from './LinedField';

interface DataDetailModalProps<TRow, TType extends UserType> {
  type: TType;
  row?: WithIndex<TRow>;
  activeCategory: CategoryByType[TType] | null;
  dataId?: number | null; //  id
  currentIndex?: number;
  totalLength: number;
  lastIndex?: number;
  isEdit?: boolean;
  isAdd?: boolean; // 데이터 생성일 경우만
  isFirst?: boolean;
  isLast?: boolean;

  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

const EMPTY_VISUAL_DATASET: UpdateVisualDatasetRequest = {
  code: '',
  name: '',
  sectorCategory: '',
  mainProductCategory: '',
  mainProduct: '',
  target: '',
  referenceUrl: '',
  originalLogoImage: null,
  visualDataCategory: 'COSMETIC',
};

const EMPTY_INDUSTRY_DATASET: UpdateIndustrialDatasetRequest = {
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
  industryDataCategory: 'AIR_PURIFIER',
};

/* =======================
   Component
======================= */

const DataDetailModal = <TRow, TType extends UserType>({
  type,
  row,
  dataId,
  activeCategory,
  isEdit,
  isAdd,
  isFirst,
  isLast,
  totalLength,

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
  const { year } = useParams<{ year: string }>();
  const yearId = Number(year);

  /* ---------- data ---------- */
  const { data, isError } = useDataByDatasetId({
    type,
    datasetId: Number(dataId),
  });

  /* ---------- file states ---------- */

  // VISUAL
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // INDUSTRY
  const [detailFile, setDetailFile] = useState<File | null | undefined>(
    undefined
  );
  const [frontFile, setFrontFile] = useState<File | null | undefined>(
    undefined
  );
  const [sideFile, setSideFile] = useState<File | null | undefined>(undefined);

  /* ---------- mutation ---------- */
  // 데이터 수정을 위한 훅
  const { mutate: createDataset } = useCreateDataset();
  const { mutate: updateDataset } = useUpdateDataset();

  const [activeField, setActvieField] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detailPreview, setDetailPreview] = useState<string | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [sidePreview, setSidePreview] = useState<string | null>(null);

  const INDUSTRY_IMAGE_FIELDS = [
    {
      label: '상세 이미지',
      field: 'originalDetailImagePath',
      setter: setDetailFile,
      file: detailFile,
      preview: detailPreview,
      setPreview: setDetailPreview,
    },
    {
      label: '정면 이미지',
      field: 'originalFrontImagePath',
      setter: setFrontFile,
      file: frontFile,
      preview: frontPreview,
      setPreview: setFrontPreview,
    },
    {
      label: '측면 이미지',
      field: 'originalSideImagePath',
      setter: setSideFile,
      file: sideFile,
      preview: sidePreview,
      setPreview: setSidePreview,
    },
  ] as const;

  const fields = type === 'VISUAL' ? VISUAL_FIELDS : INDUSTRY_FIELDS;

  /* ---------- image src ---------- */
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
      return updateRequestMapper.VISUAL(
        visualDetail,
        activeCategory as VisualCategory
      );
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
          className="mr-2 flex-1 rounded border border-[#E9E9E7] px-2 py-1.5 text-base font-normal outline-[#4676FB]"
        />
      ) : (
        <span className="mr-2 whitespace-pre-wrap break-all">
          {item[field] as string}
        </span>
      )}
    </LinedField>
  );

  {
    /* ---------- create 생성 ---------- */
  }
  const onCreateSubmit = (data: UpdateForm) => {
    if (!activeCategory) return;

    if (type === 'VISUAL') {
      const requestData: CreateVisualDatasetRequest = {
        code: '',
        name: '',
        sectorCategory: '',
        mainProductCategory: '',
        mainProduct: '',
        target: '',
        referenceUrl: '',
        originalLogoImage: null,
        visualDataCategory: activeCategory as VisualCategory,
      };

      (Object.keys(dirtyFields) as (keyof UpdateForm)[]).forEach((key) => {
        const value = data[key];
        requestData[key] = value ?? '';
      });
      // 수정 api
      createDataset(
        {
          type: type,
          yearId,
          requestData,
          logoFile,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }

    if (type === 'INDUSTRY') {
      const requestData: CreateIndustrialDatasetRequest = {
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
        industryDataCategory: activeCategory as IndustryCategory,
      };

      (Object.keys(dirtyFields) as (keyof CreateIndustrialDatasetRequest)[])
        .filter((key) => key !== 'industryDataCategory')
        .forEach((key) => {
          const value = data[key as keyof UpdateForm];
          if (value !== undefined) {
            requestData[key] = value ?? '';
          }
        });

      requestData.industryDataCategory = activeCategory as IndustryCategory;

      // 생성 api
      createDataset(
        {
          type,
          yearId,
          requestData,
          detailFile: detailFile === undefined ? undefined : detailFile,
          frontFile: frontFile === undefined ? undefined : frontFile,
          sideFile: sideFile === undefined ? undefined : sideFile,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  {
    /* ---------- update 수정 ---------- */
  }

  const onUpdateSubmit = (data: UpdateForm) => {
    if (!dataId) return;
    const requestData: Partial<UpdateForm> = {};

    (Object.keys(dirtyFields) as (keyof UpdateForm)[]).forEach((key) => {
      const value = data[key];
      if (value == null) return;
      requestData[key] = value;
    });

    if (type === 'VISUAL') {
      // 수정 api
      updateDataset(
        {
          type: type,
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
    }

    if (type === 'INDUSTRY') {
      // 수정 api
      updateDataset(
        {
          type,
          id: dataId,
          requestData,
          detailFile: detailFile === undefined ? undefined : detailFile,
          frontFile: frontFile === undefined ? undefined : frontFile,
          sideFile: sideFile === undefined ? undefined : sideFile,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  /* =======================
     Render
  ======================= */

  return (
    <ModalComponent
      title={String(row?._no ?? totalLength + 1)}
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
        className={clsx('min-w-150 bg-white')}
      >
        <div className="flex shrink-0 flex-col gap-4 space-y-4">
          {/* 내용이 많아지면 여기만 스크롤 */}
          {fields.map(({ label, field }) =>
            renderField(label, field as keyof UpdateForm)
          )}
        </div>

        <div
          className={clsx(
            'scrollbar-hidden relative mt-4 space-y-6 overflow-y-auto pr-2',
            type === 'INDUSTRY' ? 'h-200' : 'h-100'
          )}
        >
          {/* ---------- VISUAL image ---------- */}
          {type === 'VISUAL' && (
            <LinedField
              label="로고 이미지"
              activeField={activeField}
              isImg={true}
            >
              {isEdit && type === 'VISUAL' && (
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

                    setValue('originalLogoImage', file.name, {
                      shouldDirty: true,
                    });
                  }}
                />
              )}

              <div className="flex h-full w-full justify-center">
                <ImageDropZone
                  disabled={!isEdit}
                  onFileDrop={(file) => {
                    setLogoFile(file);
                    setPreviewUrl(URL.createObjectURL(file));

                    setValue('originalLogoImage', file.name, {
                      shouldDirty: true,
                    });
                  }}
                  className="flex w-40 items-center"
                >
                  <label
                    htmlFor={isEdit ? 'logo-upload' : undefined}
                    className={clsx(
                      'flex items-center justify-center',
                      isEdit && 'cursor-pointer'
                    )}
                  >
                    <div className="flex flex-col justify-center gap-10">
                      <Image
                        src={imageSrc}
                        alt="logo"
                        width={160}
                        height={160}
                        className={
                          isEdit
                            ? 'border-1 border-system-lineGray rounded transition hover:opacity-80'
                            : 'object-cover'
                        }
                      />
                    </div>
                  </label>
                </ImageDropZone>
              </div>

              {isEdit && (
                <Image
                  onClick={(e) => {
                    e.stopPropagation();
                    setLogoFile(null);

                    setPreviewUrl(null);

                    // 2. 파일 state 제거

                    console.log();
                  }}
                  src={close}
                  alt="close"
                  className="right-45 absolute top-0 cursor-pointer"
                />
              )}
            </LinedField>
          )}

          {/* ---------- INDUSTRY images (3 li, no nesting) ---------- */}
          {type === 'INDUSTRY' &&
            INDUSTRY_IMAGE_FIELDS.map(
              ({ label, field, file, setter, setPreview, preview }) => (
                <LinedField
                  key={field}
                  label={label}
                  activeField={activeField}
                  isImg
                >
                  {isEdit && (
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={field}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setter(file);
                        setPreview(URL.createObjectURL(file));

                        setValue(field, file.name, {
                          shouldDirty: true,
                        });
                      }}
                    />
                  )}
                  <ImageDropZone
                    disabled={!isEdit}
                    onFileDrop={(file) => {
                      setter(file);
                      setPreview(URL.createObjectURL(file));

                      setValue(field, file.name, {
                        shouldDirty: true,
                      });
                    }}
                  >
                    <label htmlFor={isEdit ? field : undefined}>
                      <div className="w-100 h-120 relative flex items-start">
                        <Image
                          src={
                            preview ??
                            (isEdit && file === null
                              ? empty
                              : (getImageSrcByType(type, data?.result, field) ??
                                empty))
                          }
                          fill
                          alt={label}
                          className="rounded border"
                          style={{
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    </label>
                  </ImageDropZone>
                  {isEdit && (
                    <Image
                      onClick={(e) => {
                        e.stopPropagation();

                        // 1. 프리뷰 제거
                        setPreview(null);

                        // 2. 파일 state 제거
                        setter(null);

                        // 3. form 값 null 처리 + dirty
                        setValue(field, null, {
                          shouldDirty: true,
                        });
                        console.log();
                      }}
                      src={close}
                      alt="close"
                      className="absolute left-60 top-0 cursor-pointer"
                    />
                  )}
                </LinedField>
              )
            )}
        </div>

        {/* ---------- save ---------- */}
        {isEdit && (
          <div className="flex w-full justify-center">
            <button
              onClick={handleSubmit(isAdd ? onCreateSubmit : onUpdateSubmit)}
              className="w-21 cursor-pointer rounded bg-[#4676FB] px-7 py-3 text-base font-normal text-[#ffffff] hover:opacity-90"
            >
              {isAdd ? '생성' : '저장'}
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
