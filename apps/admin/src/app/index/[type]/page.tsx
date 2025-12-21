'use client';
import FolderList from '@/src/components/FolderList';
import FolderModals from '@/src/components/FolderModals';
import { ADMIN_SECTIONS } from '@/src/constants/adminSection';
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
    editFolderName,
    setPressedKey,
    setOpenMenuKey,
    setAdd,
    setEditName,
    setEditFolderName,
    getFieldMenuItems,
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
        <div className="flex w-full cursor-pointer items-center justify-center">
          <div
            className={
              'border-1 h-fulll border-[#E9EFF4] text-center text-3xl font-light text-[#4676FB] hover:bg-[#4676FB] hover:text-[#ffffff]'
            }
          >
            <p
              onClick={() => setAdd(true)}
              className="-mt-1 flex h-5 w-5 items-center justify-center p-8"
            >
              +
            </p>
          </div>
        </div>

        {/* Modals */}
        <FolderModals
          add={add}
          editName={editName}
          editFolderName={editFolderName}
          setEditFolderName={setEditFolderName}
          onCloseAdd={() => setAdd(false)}
          onCloseEdit={() => setEditName(false)}
        />
      </div>
    </div>
  );
};
export default IndexPage;
