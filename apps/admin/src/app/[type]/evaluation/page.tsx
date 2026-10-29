'use client';
import AddBtn from '@/src/components/common/AddBtn';
import AddEvaluation from '@/src/components/evaluation/AddEvaluation';
import Folder from '@/src/components/Folder';
import FolderList from '@/src/components/FolderList';
import FolderModals from '@/src/components/FolderModals';
import FolderWrapper from '@/src/components/layout/FolderWrapper';
import { mapEvaluationYearsToFolders } from '@/src/features/data/rowMeta';
import { useEvaluationYears } from '@/src/hooks/evaluation/useEvaluationYears';
import { useUpdateSurvey } from '@/src/hooks/evaluation/useUpdateSurvey';
import { useFolderManager } from '@/src/hooks/useFolderManager';
import { getUserTypeFromPathname } from '@/src/utils/getUserTypeFromPathname';
import { usePathname, useRouter } from 'next/navigation';

const IndexPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  // 평가 추가하기 -> 바로 해당 Id의 설문 문항 생성
  const {
    pressedKey,
    openMenuKey,
    addStep,
    editSurvey,
    editFolderName,
    editName,
    createdYearId,
    // selectedName, 평가 문항 수정시 사용할 폴더 네임
    setPressedKey,
    setOpenMenuKey,
    setAdd,
    setAddStep,
    setEditSurvey,
    setEditFolderName,
    setEditName,
    setCreatedYearId,
    // setSelectedName,
    getFieldEvaluationMenuItems,
  } = useFolderManager();

  const type = getUserTypeFromPathname(pathname);
  // 바꿀 로직
  // 폴더 이름 모달 -> 평가설문 모달 -> 폴더 생성 (+ 폴더 이름 수정 + 설문 문항 생성)
  // 년도 평가 등록

  const { data, isLoading: yearDataLoading } = useEvaluationYears(type);
  const yearFolders = data?.result
    ? mapEvaluationYearsToFolders(
        data.result,
        `/${type.toLowerCase()}/evaluation`
      )
    : [];

  // 년도 폴더 이름 수정
  const { mutateAsync: updateName } = useUpdateSurvey(type);

  const hanleEditName = () => {
    const body = {
      folderName: editFolderName,
      yearId: createdYearId ?? 0,
    };
    updateName(body, {
      onSuccess: () => {
        setEditName(false);
        setEditFolderName('');
        setCreatedYearId(null);
      },
    });
  };

  // 로딩 중 스켈레톤
  if (yearDataLoading) {
    const skeletonFactors = Array(7).fill(null);

    return (
      <FolderWrapper>
        <div className="flex flex-col gap-5">
          <div className="flex text-[#4676FB]">
            <p className="ml-21 w-70">Folder</p>
            <span className="ml-25 w-25">Last Modified</span>
            <span className="ml-21 w-25">Created</span>
          </div>
          {/* Folder List */}
          {skeletonFactors.map((_, index) => (
            <Folder key={index} name={''} isSkeleton isPhase={false} />
          ))}
          {/* ADD BTN */}
          <AddBtn isEvaluation={false} setAdd={setAdd} />
        </div>
      </FolderWrapper>
    );
  }

  return (
    <FolderWrapper>
      <div className="flex flex-col gap-5">
        <div className="flex text-[#4676FB]">
          <p className="ml-21 w-70 min-w-0">Folder</p>
          <span className="ml-25 w-25">Last Modified</span>
          <span className="ml-21 w-25">Created</span>
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
        <AddBtn
          isEvaluation={true}
          setAdd={() => {
            // setEditName(true);
            setAddStep(1);
          }}
          // onClick={() => createFolder()}
        />

        {/*  Modals */}
        {/* 평가 설문 문항 등록 Modal */}
        {addStep === 2 && (
          <AddEvaluation
            type={type}
            yearId={createdYearId!}
            editFolderName={editFolderName}
            addStep={addStep}
            createdYearId={createdYearId ?? 1}
            setCreatedYearId={setCreatedYearId}
            onClose={() => {
              setAddStep(0);
              setCreatedYearId(null);
              setEditFolderName('');
            }}
          />
        )}

        {/* 평가 설문 문항 수정 Modal */}
        {editSurvey && (
          <AddEvaluation
            type={type}
            yearId={createdYearId!} // 클릭한 년도 아이디로 변경
            setCreatedYearId={setCreatedYearId}
            onClose={() => setEditSurvey(false)}
            isEdit={true}
          />
        )}

        <FolderModals
          add={addStep === 1}
          editName={editName}
          editFolderName={editFolderName}
          setEditFolderName={setEditFolderName}
          onCloseAdd={() => setAddStep(0)}
          onCloseEdit={() => setEditName(false)}
          onSubmit={() => setAddStep(2)}
          onEdit={hanleEditName}
        />
      </div>
    </FolderWrapper>
  );
};
export default IndexPage;
