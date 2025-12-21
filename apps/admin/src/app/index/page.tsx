'use client';
import Folder from '@/src/components/Folder';
import { ADMIN_SECTIONS } from '@/src/constants/adminSection';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const IndexPage = () => {
  const router = useRouter();
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const sections = Object.values(ADMIN_SECTIONS);

  return (
    <div className="font-pretendard text-blue text-blue pl-47 pr-90 mt-14 grid min-h-screen">
      <div className="flex flex-col gap-5">
        <div className="text-primary-blue flex">
          <p className="ml-21 w-25">Folder</p>
          <span className="ml-25 w-25">Last Modified</span>
          <span className="ml-31 w-25">Created</span>
        </div>
        {sections.map((section) => (
          <Folder
            key={section.key}
            name={section.label}
            modified={section.lastModifiedAt}
            created={section.createdAt}
            isActive={pressedKey === section.key}
            onClick={() => {
              setPressedKey(section.key);
              router.push(section.route);
            }}
          />
        ))}
      </div>
    </div>
  );
};
export default IndexPage;
