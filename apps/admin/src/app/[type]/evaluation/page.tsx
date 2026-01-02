'use client';
import AddBtn from '@/src/components/common/AddBtn';
import AddEvaluation from '@/src/components/evaluation/AddEvaluation';
import FolderList from '@/src/components/FolderList';
import { mapEvaluationYearsToFolders } from '@/src/features/data/rowMeta';
import { useCreateEvaluationYear } from '@/src/hooks/evaluation/useCreateEvaluationYear';
import { useEvaluationYears } from '@/src/hooks/evaluation/useEvaluationYears';
import { useFolderManager } from '@/src/hooks/useFolderManager';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const IndexPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  // 평가 추가하기 -> 바로 해당 Id의 설문 문항 생성
  const [createdYearId, setCreatedYearId] = useState<number | null>(null);

  const type = pathname.startsWith('/industry') ? 'INDUSTRY' : 'VISUAL';
  const { mutate } = useCreateEvaluationYear(type, (yearId) => {
    setCreatedYearId(yearId);
    setAdd(true);
  });

  const {
    pressedKey,
    openMenuKey,
    add,
    editSurvey,
    // selectedName, 평가 문항 수정시 사용할 폴더 네임
    setPressedKey,
    setOpenMenuKey,
    setAdd,
    setEditSurvey,
    // setSelectedName,
    getFieldEvaluationMenuItems,
  } = useFolderManager();
  const { data } = useEvaluationYears(type);
  const yearFolders = data?.result
    ? mapEvaluationYearsToFolders(
        data.result,
        `/${type.toLowerCase()}/evaluation`
      )
    : [];

  return (
    <div className="font-pretendard text-blue text-blue pl-47 mt-14 grid min-h-screen pr-80">
      <div className="flex flex-col gap-5">
        <div className="flex text-[#4676FB]">
          <p className="ml-21 w-25">Folder</p>
          <span className="ml-25 w-25">Last Modified</span>
          <span className="ml-31 w-25">Created</span>
        </div>
        {/* Folder List */}
        <FolderList
          items={yearFolders}
          isPhase={false}
          pressedKey={pressedKey}
          openMenuKey={openMenuKey}
          onSelect={(item) => {
            setPressedKey(item.key);
            router.push(item.route);
          }}
          onToggleMenu={(key) =>
            setOpenMenuKey((prev) => (prev === key ? null : key))
          }
          onCloseMenu={() => setOpenMenuKey(null)}
          getFieldMenuItems={getFieldEvaluationMenuItems}
        />
        {/* ADD BTN */}
        <AddBtn isEvaluation={true} setAdd={setAdd} onClick={() => mutate()} />

        {/* Modals */}
        {add && createdYearId && (
          <AddEvaluation
            type={type}
            yearId={createdYearId!}
            onClose={() => {
              setAdd(false);
              setCreatedYearId(null);
            }}
          />
        )}

        {editSurvey && createdYearId && (
          <AddEvaluation
            type={type}
            yearId={createdYearId!} // 클릭한 년도 아이디로 변경
            onClose={() => setEditSurvey(false)}
            isEdit={true}
          />
        )}
      </div>
    </div>
  );
};
export default IndexPage;
