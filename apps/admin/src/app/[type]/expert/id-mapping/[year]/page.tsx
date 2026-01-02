'use client';
import AddBtn from '@/src/components/common/AddBtn';
import AddEvaluation from '@/src/components/evaluation/AddEvaluation';
import FolderList from '@/src/components/FolderList';
import FolderModals from '@/src/components/FolderModals';
import { MAPPING_PHASE_FOLDER } from '@/src/constants/expert';
import {
  SUBJECT_QUESTION,
  SURVEY_QUESTIONS,
} from '@/src/constants/surveyQuestions';
import { useFolderManager } from '@/src/hooks/useFolderManager';
import { useRouter } from 'next/navigation';

const IndexPage = () => {
  const router = useRouter();

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
  } = useFolderManager();

  const items = MAPPING_PHASE_FOLDER ?? [];

  return (
    <div className="font-pretendard text-blue text-blue pl-47 mt-14 grid min-h-screen pr-80">
      <div className="flex flex-col gap-5">
        <div className="flex text-[#4676FB]">
          <p className="ml-21 w-25">Folder</p>
          <p className="ml-25 w-25">Last Modified</p>
          <p className="ml-31 w-25">Created</p>
          <p className="ml-31 w-25">Duration</p>
        </div>
        {/* Folder List */}
        <FolderList
          items={items}
          isPhase={true}
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
          getFieldMenuItems={getFieldMenuItems}
        />
        {/* ADD BTN */}
        <AddBtn isEvaluation={false} setAdd={setAdd} />

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
