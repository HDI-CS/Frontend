'use client';
import Folder from '@/src/components/Folder';
import FolderWrapper from '@/src/components/layout/FolderWrapper';
import { ADMIN_SECTIONS } from '@/src/constants/adminSection';
import { UserType } from '@/src/schemas/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const IndexPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const type: UserType = pathname.startsWith('/industry')
    ? 'INDUSTRY'
    : 'VISUAL';

  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const sections = Object.values(ADMIN_SECTIONS).map((section) => ({
    ...section,
    route: `/${type.toLowerCase()}${section.route}`,
  }));

  return (
    <FolderWrapper>
      <div className="flex flex-col gap-5">
        <div className="text-primary-blue flex">
          <p className="ml-21 w-25">Folder</p>
        </div>
        {sections.map((section) => (
          <Folder
            key={section.key}
            name={section.label}
            // modified={section.lastModifiedAt}
            // created={section.createdAt}
            isPhase={false}
            isActive={pressedKey === section.key}
            onClick={() => {
              setPressedKey(section.key);
              router.push(section.route);
            }}
          />
        ))}
      </div>
    </FolderWrapper>
  );
};
export default IndexPage;
