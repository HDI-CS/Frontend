import excelIcon from '@/public/data/Excel.svg';
import { DUMMY_EXPERTS, ExpertProfile } from '@/src/constants/expert';
import useGridManager from '@/src/hooks/useGridManager';

import { useAuthStore } from '@/src/store/authStore';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Td from '../data/table/Td';
import Th from '../data/table/Th';
import BaseGridTable from '../evaluation/BaseGridTable';

const ProfileGridTable = () => {
  const { type } = useAuthStore();
  const { activeRowId } = useGridManager(type!);

  const [profileData, setProfileData] = useState<ExpertProfile[]>();

  /* 초기 데이터 세팅 */
  useEffect(() => {
    setProfileData(DUMMY_EXPERTS);
  }, []);

  const handleAddRow = () => {
    setProfileData((prev) => {
      if (!prev) return [createEmptyRow()];

      return [...prev, createEmptyRow()];
    });
  };

  // 새로운 행 추가 시 넣을 임시 데이터 값
  const createEmptyRow = (): ExpertProfile => ({
    id: Date.now(), // 임시 ID
    name: '',
    participation: '',
    email: '',
    phone: '',
    gender: '',
    ageGroup: '',
    experience: '',
    background: '',
    field: '',
    company: '',
  });

  return (
    <div className=" ">
      <div className="mb-1 flex w-full justify-end">
        <button className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#E5E5E5] bg-white hover:opacity-50">
          <Image src={excelIcon} alt="excel" width={16} height={16} />
        </button>{' '}
      </div>

      {/* 전문가 인적사항 테이블 */}
      <BaseGridTable>
        <thead className="text-neutral-gray bg-white">
          <tr className="hover:bg-system-blueBg cursor-pointer">
            <Th className="text-regular16 w-[51px] text-start">번호</Th>
            <Th className="text-regular16 w-[153px] text-start">성함</Th>
            <Th className="text-regular16 w-[151px] text-start">참여 차수</Th>
            <Th className="text-regular16 w-[240px] text-start">
              전문가 이메일
            </Th>
            <Th className="text-regular16 w-[151px] text-start">연락처</Th>
            <Th className="text-regular16 w-[151px] text-start">성별</Th>
            <Th className="text-regular16 w-[151px] text-start">나이</Th>
            <Th className="text-regular16 w-[151px] text-start">경력</Th>
            <Th className="text-regular16 w-[151px] text-start">학계/실무계</Th>
            <Th className="text-regular16 w-[151px] text-start">전문분야</Th>
            <Th className="text-regular16 w-[151px] text-start">회사</Th>
          </tr>
        </thead>

        <tbody>
          {profileData?.map((row, index) => {
            // const qualitativeCount = getQualitativeCount(
            //   row.qualitativeEvaluation
            // );

            return (
              <tr
                key={row.id}
                className={clsx(
                  'h-21 text-neutral-regularBlack hover:bg-[#F4F7FF]',
                  activeRowId === row.id ? 'bg-[#F4F7FF]' : 'bg-neutral-white'
                )}
              >
                <Td className="text-regular16 text-neutral-regularBlack px-4 py-1 text-center">
                  {index + 1}
                </Td>

                <Td className="text-regular16 text-neutral-regularBlack px-4 py-1">
                  {row.name}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {row.participation}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {row.email}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {row.phone}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {row.gender}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {row.ageGroup}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {row.experience}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {row.background}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {row.field}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {row.company}
                </Td>
              </tr>
            );
          })}
          <tr>
            <Td className="h-21 flex w-[64px] items-center justify-center hover:bg-[#F4F7FF]">
              <button
                onClick={handleAddRow}
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
    </div>
  );
};
export default ProfileGridTable;
