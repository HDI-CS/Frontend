'use client';
import AddBtn from '@/src/components/common/AddBtn';
import AddEvaluation from '@/src/components/evaluation/AddEvaluation';
import FolderList from '@/src/components/FolderList';
import ModalComponent from '@/src/components/ModalComponent';
import { mapEvaluationYearsToFolders } from '@/src/features/data/rowMeta';
import { useCreateEvaluationYear } from '@/src/hooks/evaluation/useCreateEvaluationYear';
import { useEvaluationYears } from '@/src/hooks/evaluation/useEvaluationYears';
import { useUpdateSurvey } from '@/src/hooks/evaluation/useUpdateSurvey';
import { useFolderManager } from '@/src/hooks/useFolderManager';
import { usePathname, useRouter } from 'next/navigation';

const IndexPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  // 평가 추가하기 -> 바로 해당 Id의 설문 문항 생성
  const {
    pressedKey,
    openMenuKey,
    add,
    editSurvey,
    editFolderName,
    editName,
    createdYearId,
    // selectedName, 평가 문항 수정시 사용할 폴더 네임
    setPressedKey,
    setOpenMenuKey,
    setAdd,
    setEditSurvey,
    setEditFolderName,
    setEditName,
    setCreatedYearId,
    // setSelectedName,
    getFieldEvaluationMenuItems,
  } = useFolderManager();

  const type = pathname.startsWith('/industry') ? 'INDUSTRY' : 'VISUAL';

  // 년도 평가 등록
  const { mutate } = useCreateEvaluationYear(type, (yearId) => {
    setCreatedYearId(yearId);
    setAdd(true);
  });

  const { data } = useEvaluationYears(type);
  const yearFolders = data?.result
    ? mapEvaluationYearsToFolders(
        data.result,
        `/${type.toLowerCase()}/evaluation`
      )
    : [];

  // 년도 폴더 이름 수정
  const { mutate: updateName } = useUpdateSurvey(type);

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

        {/*  Modals */}

        {/* 등록 Modal */}
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
        {/* 수정 Modal */}
        {editSurvey && createdYearId && (
          <AddEvaluation
            type={type}
            yearId={createdYearId!} // 클릭한 년도 아이디로 변경
            onClose={() => setEditSurvey(false)}
            isEdit={true}
          />
        )}

        {editName && (
          <ModalComponent
            title="폴더 이름"
            button="저장"
            editBasicInfo={true}
            onClose={() => setEditName(false)}
            onSubmit={hanleEditName}
          >
            <input
              value={editFolderName}
              onChange={(e) => setEditFolderName(e.target.value)}
              className="border-1 focus:outline-primary-blue w-full rounded border-[#E9E9E7] p-3 text-lg text-[#3A3A49]"
            />
          </ModalComponent>
        )}
      </div>
    </div>
  );
};
export default IndexPage;
