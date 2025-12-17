'use client';
import Folder from '@/src/components/Folder';
import { ADMIN_SECTIONS } from '@/src/constants/adminSection';
import { useRouter } from 'next/navigation';

const IndexPage = () => {
  const router = useRouter();

  const sections = Object.values(ADMIN_SECTIONS);

  return (
    <div className="font-pretendard text-blue text-blue grid min-h-screen">
      <div className="flex flex-col gap-5">
        <div className="flex text-[#4676FB]">
          <p className="ml-21 w-25">Folder</p>X$
          <span className="ml-25 w-25">Last Modified</span>
          <span className="ml-31 w-25">Created</span>
        </div>
        {sections.map((section) => (
          <Folder
            key={section.key}
            name={section.label}
            modified={section.lastModifiedAt}
            created={section.createdAt}
            onClick={() => router.push(section.route)}
          />
        ))}
      </div>
    </div>
  );
};
export default IndexPage;
