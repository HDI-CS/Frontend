'use client';
import AddBtn from '@/src/components/common/AddBtn';
import AddEvaluation from '@/src/components/evaluation/AddEvaluation';
import EditDuration from '@/src/components/evaluation/EditDuration';
import FolderList from '@/src/components/FolderList';
import ModalComponent from '@/src/components/ModalComponent';
import { mapEvaluationPhaseToFolders } from '@/src/features/data/rowMeta';
import { useEvaluationYears } from '@/src/hooks/evaluation/useEvaluationYears';
import { useFolderManager } from '@/src/hooks/useFolderManager';
import { usePathname, useRouter } from 'next/navigation';

const IndexPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const type = pathname.startsWith('/industry') ? 'INDUSTRY' : 'VISUAL';
  const segments = pathname.split('/').filter(Boolean);
  const year = segments[2];

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

  const { data } = useEvaluationYears(type);
  const rounds =
    data?.result.find((y) => y.yearId === Number(year))?.rounds ?? [];


  const roundsFolders = rounds
    ? mapEvaluationPhaseToFolders(
        year ?? '1',
        rounds,
        `/${type.toLowerCase()}/evaluation`
      )
    : [];

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
          items={roundsFolders}
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
        <AddBtn isEvaluation={true} setAdd={setAdd} />

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
