'use client';
import FolderList from '@/src/components/FolderList';
import FolderWrapper from '@/src/components/layout/FolderWrapper';
import { useFolderManager } from '@/src/hooks/useFolderManager';
import { UserType } from '@/src/schemas/auth';
import { usePathname, useRouter } from 'next/navigation';

const ExpertPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const type: UserType = pathname.startsWith('/industry')
    ? 'INDUSTRY'
    : 'VISUAL';

  const {
    pressedKey,
    openMenuKey,

    setPressedKey,
    setOpenMenuKey,

    getFieldMenuItems,
  } = useFolderManager();

  const items = [
    {
      key: 'PROFILE',
      label: '전문가 인적사항',
      route: `/${type.toLowerCase()}/expert/profile`,
      createdAt: '2021-11-03 22:00',
      lastModifiedAt: '2021-11-03 22:00',
    },
    {
      key: 'MAPPING',
      label: '평가 데이터 ID',
      route: `/${type.toLowerCase()}/expert/id-mapping`,
      createdAt: '2021-11-03 22:00',
      lastModifiedAt: '2021-11-03 22:00',
    },
  ];

  return (
    <FolderWrapper>
      <div className="flex flex-col gap-5">
        <div className="flex text-[#4676FB]">
          <p className="ml-21 w-25">Folder</p>
          <span className="ml-25 w-25">Last Modified</span>
          <span className="ml-21 w-25">Created</span>
        </div>
        {/* Folder List */}
        <FolderList
          items={items}
          isPhase={false}
          pressedKey={pressedKey}
          openMenuKey={openMenuKey}
          isManage={false}
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
      </div>
    </FolderWrapper>
  );
};
export default ExpertPage;
