import excelIcon from '@/public/data/Excel.svg';
import { ExpertProfile } from '@/src/constants/expert';
import useGridManager from '@/src/hooks/useGridManager';

import {
  CreateFieldMeta,
  EXPERT_CREATE_FIELDS,
  EXPERT_EDIT_FIELDS,
  ExpertlFieldMeta,
  getReadonlyValue,
} from '@/src/features/data/expertRowMeta';
import { useCreateExpert } from '@/src/hooks/expert/useCreateExpert';
import {
  useExpertProfile,
  useExpertProfileByKeyword,
} from '@/src/hooks/expert/useExpertProfile';
import { useUpdateExpert } from '@/src/hooks/expert/useUpdateExpert';
import {
  CreateExpertMember,
  ExpertMember,
  UpdateExpertMember,
} from '@/src/schemas/expert';
import { downloadExpertExcel } from '@/src/services/expert/profile';
import { useSearchStore } from '@/src/store/searchStore';
import { highlightText } from '@/src/utils/highlightText';
import { truncateText } from '@/src/utils/truncateText';
import clsx from 'clsx';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import LinedField from '../data/LinedField';
import Td from '../data/table/Td';
import Th from '../data/table/Th';
import BaseGridTable from '../evaluation/BaseGridTable';
import ModalComponent from '../ModalComponent';

const ProfileGridTable = () => {
  const pathname = usePathname();

  const type = pathname.startsWith('/industry') ? 'INDUSTRY' : 'VISUAL';
  const { activeRowId } = useGridManager(type!);
  const {
    dataId,
    isEdit,
    isAdd,
    selectedIndex,
    selectedExpertData,
    setSelectedIndex,
    setDataId,
    setIsEdit,
    setIsAdd,
    setSelectedExpertData,
  } = useGridManager(type);
  const [activeField, setActiveField] = useState<string | null>();

  const { data } = useExpertProfile(type!);
  const mapExpertToProfile = (expert: ExpertMember): ExpertProfile => ({
    id: expert.memberId ?? '',
    name: expert.name ?? '',
    participation: expert.rounds.join(', '),
    email: expert.email ?? '',
    password: expert.password ?? '',
    phone: expert.phoneNumber ?? '',
    gender: expert.gender ?? '',
    ageGroup: expert.age ?? '',
    experience: expert.career ?? '',
    background: expert.academic ?? '',
    field: expert.expertise ?? '',
    company: expert.company ?? '',
  });

  const keyword = useSearchStore((s) => s.keyword);
  const { activeIndex, setResultFromData } = useSearchStore();

  const { data: searchData } = useExpertProfileByKeyword(type, keyword);
  useEffect(() => {
    if (!keyword) {
      setResultFromData(null);
    } else {
      setResultFromData(searchData?.result);
    }
  }, [keyword, searchData, setResultFromData]);

  const activeRowIdFromSearch =
    keyword && activeIndex > 0
      ? searchData?.result[activeIndex - 1]?.memberId
      : null;

  {
    /* 초기 데이터 세팅 */
  } // 카테고리 단위 데이터는 “무조건 배열”로 고정

  const localData = useMemo<ExpertProfile[]>(() => {
    // 검색어 있을 때
    if (keyword.length && searchData?.result) {
      return searchData.result.map(mapExpertToProfile);
    }
    // 기본 데이터
    if (data?.result) {
      return data.result.map(mapExpertToProfile);
    }

    //  항상 배열 반환
    return [];
  }, [keyword, searchData, data]);
  const lastIndex = localData.length + 1;

  // 수정을 위한 필드
  /*  텍스트 필드 렌더링 */
  const fields = EXPERT_EDIT_FIELDS;
  const { mutate: updateExpert } = useUpdateExpert(type, dataId!);
  const editForm = useForm<UpdateExpertMember>();

  useEffect(() => {
    if (!selectedExpertData) return;

    editForm.reset({
      name: selectedExpertData.name ?? '',
      phoneNumber: selectedExpertData.phone ?? '',
      gender: selectedExpertData.gender ?? '',
      age: selectedExpertData.ageGroup ?? '',
      career: selectedExpertData.experience ?? '',
      academic: selectedExpertData.background ?? '',
      expertise: selectedExpertData.field ?? '',
      company: selectedExpertData.company ?? '',
    });
  }, [selectedExpertData, editForm.reset, editForm]);
  const renderField = (meta: ExpertlFieldMeta) => {
    if (!selectedExpertData) return null;

    const { label, field, editable } = meta;

    return (
      <LinedField key={label} label={label} activeField={activeField ?? ''}>
        {editable && isEdit ? (
          <input
            placeholder="입력해 주세요"
            {...editForm.register(field)} // field는 여기서 자동으로 UpdateExpertMember
            onClick={(e) => {
              e.stopPropagation();
              setActiveField(label);
            }}
            className={clsx(
              'placeholder:text-regular16 h-11 w-full rounded border border-[#E9E9E7] px-3 py-3 text-[#2D2E2E] focus:outline-none',
              activeField === label ? 'border-1 border-primary-blue' : ''
            )}
          />
        ) : (
          <span
            className={clsx(
              'h-11 w-full rounded border border-[#E9E9E7] px-3 py-3',
              editable ? '' : 'text-neutral-gray'
            )}
          >
            {getReadonlyValue(field, selectedExpertData) ?? ''}
          </span>
        )}
      </LinedField>
    );
  };

  // 수정을 위한 저장 폼 제출 구현
  const onSubmit = (data: UpdateExpertMember) => {
    if (!data) return;

    const requestData: UpdateExpertMember = {
      name: data.name ?? selectedExpertData?.name,
      phoneNumber: data.phoneNumber ?? selectedExpertData?.phone,
      gender: data.gender ?? selectedExpertData?.gender,
      age: data.age ?? selectedExpertData?.ageGroup,
      career: data.career ?? selectedExpertData?.experience,
      academic: data.academic ?? selectedExpertData?.background,
      expertise: data.expertise ?? selectedExpertData?.field,
      company: data.company ?? selectedExpertData?.company,
    };

    //수정 요청 api
    updateExpert(requestData);
  };

  // 신규 전문가 등록을 위한 폼
  const createForm = useForm<CreateExpertMember>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      gender: '',
      age: '',
      career: '',
      academic: '',
      expertise: '',
      company: '',
    },
  });
  const renderCreateField = (meta: CreateFieldMeta) => {
    const { label, field } = meta;

    return (
      <LinedField key={label} label={label} activeField={activeField!}>
        <input
          {...createForm.register(field)}
          placeholder="입력해 주세요"
          type={field === 'password' ? 'password' : 'text'}
          className="h-11 w-full rounded border border-[#E9E9E7] px-3 py-3"
        />
      </LinedField>
    );
  };

  //
  const handleDownload = async () => {
    const res = await downloadExpertExcel({ type: type ?? 'VISUAL' });

    const blob = new Blob([res.data], {
      type: res.headers['content-type'],
    });

    // 파일명 추출 (서버가 내려준 filename 사용)
    const disposition = res.headers['content-disposition'];
    const filenameMatch = disposition?.match(/filename\*=UTF-8''(.+)/);
    const filename = filenameMatch
      ? decodeURIComponent(filenameMatch[1])
      : 'visual_data.xlsx';

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const createFields = EXPERT_CREATE_FIELDS;
  const { mutate: createExpert } = useCreateExpert(type);

  const onCreateSubmit = (data: CreateExpertMember) => {
    // undefined 방어 (절대 undefined 안 보내기)
    const payload: CreateExpertMember = {
      ...data,
      phoneNumber: data.phoneNumber ?? null,
      gender: data.gender ?? null,
      age: data.age ?? null,
      career: data.career ?? null,
      academic: data.academic ?? null,
      expertise: data.expertise ?? null,
      company: data.company ?? null,
    };

    createExpert(payload, {
      onError: () => {
        // 400 에러로 모달이 닫힐 시에도 폼 리셋
        createForm.reset();
      },
    });
    setIsAdd(false);
  };

  return (
    <div className="">
      <div className="flex w-full justify-end">
        <button className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#E5E5E5] bg-white hover:opacity-50">
          <Image
            onClick={handleDownload}
            src={excelIcon}
            alt="excel"
            width={16}
            height={16}
          />
        </button>{' '}
      </div>

      {/* 전문가 인적사항 테이블 */}
      <BaseGridTable>
        <thead className="text-neutral-gray sticky top-0 z-10 bg-white">
          <tr className="hover:bg-system-blueBg cursor-pointer">
            <Th className="text-regular16 w-[51px] text-start">번호</Th>
            <Th className="text-regular16 w-[153px] text-start">평가자명</Th>
            <Th className="text-regular16 w-[151px] text-start">참여 차수</Th>
            <Th className="text-regular16 w-[240px] text-start">
              전문가 이메일
            </Th>
            <Th className="text-regular16 w-[151px] text-start">연락처</Th>
            <Th className="text-regular16 w-[151px] text-start">비밀번호</Th>
            <Th className="text-regular16 w-[151px] text-start">성별</Th>
            <Th className="text-regular16 w-[151px] text-start">나이</Th>
            <Th className="text-regular16 w-[151px] text-start">경력</Th>
            <Th className="text-regular16 w-[151px] text-start">학계/실무계</Th>
            <Th className="text-regular16 w-[151px] text-start">전문분야</Th>
            <Th className="text-regular16 w-[151px] text-start">회사</Th>
          </tr>
        </thead>

        <tbody>
          {localData?.map((row, index) => {
            return (
              <tr
                onDoubleClick={() => {
                  setIsEdit(true);
                  setDataId(row.id!);
                  setSelectedIndex(String(index + 1));
                  setSelectedExpertData(row);
                }}
                key={row.id}
                className={clsx(
                  'h-21 text-neutral-regularBlack hover:bg-[#F4F7FF]',
                  activeRowId === row.id ? 'bg-[#F4F7FF]' : 'bg-neutral-white'
                )}
              >
                <Td className="text-regular16 text-neutral-regularBlack px-4 py-1 text-center">
                  {index + 1}
                </Td>
                {/* 이메일 -> 21자 제한 , 나머지 -> 11자 제한 */}
                <Td className="text-regular16 text-neutral-regularBlack px-4 py-1">
                  {highlightText(truncateText(row.name, 11), keyword, {
                    active: row.id === activeRowIdFromSearch,
                  })}{' '}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {highlightText(truncateText(row.participation, 11), keyword, {
                    active: row.id === activeRowIdFromSearch,
                  })}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {highlightText(truncateText(row.email, 21), keyword, {
                    active: row.id === activeRowIdFromSearch,
                  })}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {highlightText(truncateText(row.phone, 11), keyword, {
                    active: row.id === activeRowIdFromSearch,
                  })}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {highlightText(truncateText(row.password, 11), keyword, {
                    active: row.id === activeRowIdFromSearch,
                  })}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {highlightText(truncateText(row.gender, 11), keyword, {
                    active: row.id === activeRowIdFromSearch,
                  })}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {highlightText(truncateText(row.ageGroup, 11), keyword, {
                    active: row.id === activeRowIdFromSearch,
                  })}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {highlightText(truncateText(row.experience, 11), keyword, {
                    active: row.id === activeRowIdFromSearch,
                  })}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {highlightText(truncateText(row.background, 11), keyword, {
                    active: row.id === activeRowIdFromSearch,
                  })}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {highlightText(truncateText(row.field, 11), keyword, {
                    active: row.id === activeRowIdFromSearch,
                  })}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {highlightText(truncateText(row.company, 11), keyword, {
                    active: row.id === activeRowIdFromSearch,
                  })}
                </Td>
              </tr>
            );
          })}
          <tr>
            <Td className="h-21 flex w-[64px] items-center justify-center hover:bg-[#F4F7FF]">
              <button
                onClick={() => setIsAdd(true)}
                className="flex h-[28px] w-[28px] items-center justify-center rounded text-center text-3xl text-[#4676FB]"
                aria-label="add row"
              >
                +
              </button>
            </Td>
            <Td colSpan={8} />
          </tr>
        </tbody>
      </BaseGridTable>
      {isEdit && (
        <ModalComponent
          title={selectedIndex ?? ''}
          subtitle={'전문가 인적사항'}
          onClose={() => {
            setIsEdit(false);
            editForm.reset();
            setActiveField(null);
          }}
          onSubmit={editForm.handleSubmit((data) => {
            onSubmit(data);
            setIsEdit(false);
          })}
          button="저장"
        >
          <div className="mt-1 flex flex-col gap-5">
            {fields.map(renderField)}
          </div>
        </ModalComponent>
      )}
      {isAdd && (
        <ModalComponent
          title={selectedIndex ?? String(lastIndex)}
          subtitle={'전문가 인적사항'}
          onClose={() => {
            setIsAdd(false);
            createForm.reset();
          }}
          onSubmit={createForm.handleSubmit(onCreateSubmit)}
          button="저장"
        >
          <div className="mt-1 flex flex-col gap-5">
            {createFields.map(renderCreateField)}
          </div>{' '}
        </ModalComponent>
      )}
    </div>
  );
};
export default ProfileGridTable;
