'use client';
import AddBtn from '@/src/components/common/AddBtn';
import AddEvaluation from '@/src/components/evaluation/AddEvaluation';
import FolderList from '@/src/components/FolderList';
import FolderModals from '@/src/components/FolderModals';
import { ADMIN_SECTIONS } from '@/src/constants/adminSection';
import {
  SUBJECT_QUESTION,
  SURVEY_QUESTIONS,
} from '@/src/constants/surveyQuestions';
import { useFolderManager } from '@/src/hooks/useFolderManager';
import { useParams, useRouter } from 'next/navigation';

const sectionKeyMap = {
  data: 'DATA',
  evaluation: 'EVALUATION',
  expert: 'EXPERT',
} as const;

const IndexPage = () => {
  const router = useRouter();
  const params = useParams();

  const {
    pressedKey,
    openMenuKey,
    add,
    editName,
    editSurvey,
    editFolderName,
    setPressedKey,
    setOpenMenuKey,
    setAdd,
    setEditName,
    setEditSurvey,
    setEditFolderName,
    getFieldMenuItems,
    getFieldEvaluationMenuItems,
  } = useFolderManager();

  const sectionParam = params.type as keyof typeof sectionKeyMap | undefined;
  const isEvaluation = sectionParam === 'evaluation';

  if (!sectionParam) {
    return null; // or loading / redirect
  }

  const sectionKey = sectionKeyMap[sectionParam];

  if (!sectionKey) {
    return null; // 잘못된 URL 접근
  }

  const section = ADMIN_SECTIONS[sectionKey];
  const items = section.years ?? [];

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
          items={items}
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
          getFieldMenuItems={
            isEvaluation ? getFieldEvaluationMenuItems : getFieldMenuItems
          }
        />
        {/* ADD BTN */}
        <AddBtn isEvaluation={isEvaluation} setAdd={setAdd} />

        {/* Modals */}
        <FolderModals
          add={add}
          editName={editName}
          editFolderName={editFolderName}
          setEditFolderName={setEditFolderName}
          onCloseAdd={() => setAdd(false)}
          onCloseEdit={() => setEditName(false)}
        />

        {editSurvey && (
          <AddEvaluation
            onClose={() => setEditSurvey(false)}
            isEdit={true}
            qusetionsData={SURVEY_QUESTIONS}
            subjectiveData={SUBJECT_QUESTION}
          />
        )}
      </div>
    </div>
  );
};
export default IndexPage;
