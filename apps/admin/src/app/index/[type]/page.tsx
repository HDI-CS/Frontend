'use client';
import plusBtn from '@/public/common/folder/plusBtn.svg';
import Folder from '@/src/components/Folder';
import { ADMIN_SECTIONS } from '@/src/constants/adminSection';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

const sectionKeyMap = {
  data: 'DATA',
  evaluation: 'EVALUATION',
  expert: 'EXPERT',
} as const;

const IndexPage = () => {
  const router = useRouter();
  const params = useParams();

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
    <div className="font-pretendard text-blue text-blue grid min-h-screen">
      <div className="flex flex-col gap-5">
        <div className="flex text-[#4676FB]">
          <p className="ml-21 w-25">Folder</p>
          <span className="ml-25 w-25">Last Modified</span>
          <span className="ml-31 w-25">Created</span>
        </div>
        {items.map((item) => (
          <Folder
            key={item.key}
            name={item.label}
            modified={item.lastModifiedAt}
            created={item.createdAt}
            onClick={() => router.push(item.route)}
            isManage={true}
          />
        ))}
        <div className="flex w-full justify-center">
          <Image
            src={plusBtn}
            alt="plus"
            className="cursor-pointer hover:opacity-60"
          />
        </div>
      </div>
    </div>
  );
};
export default IndexPage;
