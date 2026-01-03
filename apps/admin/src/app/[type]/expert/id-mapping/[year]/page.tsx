'use client';
import AddBtn from '@/src/components/common/AddBtn';
import AddEvaluation from '@/src/components/evaluation/AddEvaluation';
import FolderList from '@/src/components/FolderList';
import FolderModals from '@/src/components/FolderModals';
import { mapEvaluationPhaseToFolders } from '@/src/features/data/rowMeta';
import { useEvaluationYears } from '@/src/hooks/evaluation/useEvaluationYears';
import { useFolderManager } from '@/src/hooks/useFolderManager';
import { usePathname, useRouter } from 'next/navigation';

const IndexPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const type = pathname.startsWith('/industry') ? 'INDUSTRY' : 'VISUAL';
  const segments = pathname.split('/').filter(Boolean);
  const year = segments[3];
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

  // const items = MAPPING_PHASE_FOLDER ?? [];
  const { data } = useEvaluationYears(type);
  const rounds =
    data?.result.find((y) => y.yearId === Number(year))?.rounds ?? [];

  const roundsFolders = rounds
    ? mapEvaluationPhaseToFolders(
        year ?? '1',
        rounds,
        `/${type.toLowerCase()}/expert/id-mapping`
      )
    : [];

  return (
    <div className="font-pretendard text-blue text-blue pl-40 mt-14 grid min-h-screen pr-60">
      <div className="flex flex-col gap-5">
        <div className="flex text-[#4676FB]">
          <p className="ml-21 w-25">Folder</p>
          <p className="ml-25 w-25">Last Modified</p>
          <p className="ml-31 w-25">Created</p>
          <p className="ml-31 w-25">Duration</p>
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
            type={type}
            onClose={() => setEditSurvey(false)}
            isEdit={true}
          />
        )}
      </div>
    </div>
  );
};
export default IndexPage;
