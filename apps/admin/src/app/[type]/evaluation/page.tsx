'use client';
import AddBtn from '@/src/components/common/AddBtn';
import AddEvaluation from '@/src/components/evaluation/AddEvaluation';
import FolderList from '@/src/components/FolderList';
import {
  SUBJECT_QUESTION,
  SURVEY_QUESTIONS,
} from '@/src/constants/surveyQuestions';
import { mapEvaluationYearsToFolders } from '@/src/features/data/rowMeta';
import { useEvaluationYears } from '@/src/hooks/evaluation/useEvaluationYears';
import { useFolderManager } from '@/src/hooks/useFolderManager';
import { usePathname, useRouter } from 'next/navigation';

const IndexPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const type = pathname.startsWith('/industry') ? 'INDUSTRY' : 'VISUAL';

  const {
    pressedKey,
    openMenuKey,
    add,
    editSurvey,
    setPressedKey,
    setOpenMenuKey,
    setAdd,
    setEditSurvey,
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
        <AddBtn isEvaluation={true} setAdd={setAdd} />

        {/* Modals */}
        {add && <AddEvaluation onClose={() => setAdd(false)} />}

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
