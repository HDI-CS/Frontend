'use client';
import AddBtn from '@/src/components/common/AddBtn';
import AddEvaluation from '@/src/components/evaluation/AddEvaluation';
import EditDuration from '@/src/components/evaluation/EditDuration';
import FolderList from '@/src/components/FolderList';
import ModalComponent from '@/src/components/ModalComponent';
import { ADMIN_SECTIONS } from '@/src/constants/adminSection';
import DataPage from '@/src/features/data/DataYearPage';
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
    getFieldEvaluationRangeMenuItems,
  } = useFolderManager();

  const sectionParam = params.type as keyof typeof sectionKeyMap | undefined;

  if (!sectionParam) {
    return null; // or loading / redirect
  }
  const sectionKey = sectionKeyMap[sectionParam];

  if (!sectionKey) {
    return null; // 잘못된 URL 접근
  }
  const section = ADMIN_SECTIONS[sectionKey];
  const yearParam = params.year as string | undefined;
  const isEvaluation = sectionParam === 'evaluation';

  const year = section.years.find((y) => y.route.endsWith(`/${yearParam}`));

  const phases = year?.phases ?? [];

  // data page
  if (sectionParam === 'data') return <DataPage />;

  return (
    <div className="font-pretendard text-blue text-blue pl-47 pr-50 mt-14 grid min-h-screen">
      <div className="flex flex-col gap-5">
        <div className="flex text-[#4676FB]">
          <p className="ml-21 w-25">Folder</p>
          <span className="ml-25 w-25">Last Modified</span>
          <span className="ml-31 w-25">Created</span>
          <span className="ml-31 w-25">Duration</span>
        </div>
        {/* Folder List */}
        <FolderList
          items={phases}
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
          getFieldMenuItems={getFieldEvaluationRangeMenuItems}
        />
        {/* ADD BTN */}
        <AddBtn isEvaluation={isEvaluation} setAdd={setAdd} />

        {/* Modals */}
        {add && <AddEvaluation onClose={() => setAdd(false)} />}
        {editName && (
          <ModalComponent
            title="폴더 이름"
            button="저장"
            onClose={() => setEditName(false)}
            onSubmit={() => setEditName(false)}
          >
            <input
              value={editFolderName}
              onChange={(e) => setEditFolderName(e.target.value)}
              className="border-1 w-full rounded border-[#E9E9E7] p-3 text-lg text-[#3A3A49]"
            />
          </ModalComponent>
        )}
        {editSurvey && (
          <EditDuration
            name={editFolderName}
            onClose={() => setEditSurvey(false)}
          />
        )}
      </div>
    </div>
  );
};
export default IndexPage;
