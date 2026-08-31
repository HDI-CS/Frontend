'use client';
import IdMappingTable from '@/src/components/expert/IdMappingTable';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const IndexPage = () => {
  const pathname = usePathname();

  const type = pathname.startsWith('/industry') ? 'INDUSTRY' : 'VISUAL';
  const segments = pathname.split('/').filter(Boolean);
  const round = segments[4];

  const year = useMemo(() => {
    const y = Number(segments[3]);
    return Number.isFinite(y) ? y : null;
  }, [segments]);

  return (
    <div className="bg-system-blueBg min-h-screen pl-2 pt-1.5">
      <IdMappingTable type={type} round={Number(round)} year={year!} />
    </div>
  );
};
export default IndexPage;
