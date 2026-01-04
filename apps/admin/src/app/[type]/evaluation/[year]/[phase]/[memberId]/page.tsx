'use client';
import excelIcon from '@/public/data/Excel.svg';
import OneExpertGridTable from '@/src/components/evaluation/OneExpertGridTable';
import ViewEvaluationsBtn from '@/src/components/evaluation/ViewEvaluationsBtn';
import { useGetOneEvaluationStatus } from '@/src/hooks/evaluation/useGetEvaluationStatus';
import { downloadEvaluationExcel } from '@/src/services/evaluation';
import Image from 'next/image';

import { usePathname } from 'next/navigation';

const MemberPage = () => {
  const pathname = usePathname();
  const type = pathname.startsWith('/industry') ? 'INDUSTRY' : 'VISUAL';

  const segments = pathname.split('/').filter(Boolean);
  const roundId = segments[3];
  const memberId = segments[4];
  console.log(roundId, memberId);
  const { data, isLoading } = useGetOneEvaluationStatus(
    type,
    Number(roundId),
    Number(memberId)
  );
  if (isLoading || !data?.result) {
    return <div>로딩중...</div>;
  }

  {
    /* 엑셀 다운로드 */
  }
  const handleDownload = async () => {
    const res = await downloadEvaluationExcel({
      type: type ?? 'VISUAL',
      assessmentRoundId: Number(roundId),
    });

    const blob = new Blob([res.data], {
      type: res.headers['content-type'],
    });

    // 파일명 추출 (서버가 내려준 filename 사용)
    const disposition = res.headers['content-disposition'];
    const filenameMatch = disposition?.match(/filename\*=UTF-8''(.+)/);
    const filename = filenameMatch
      ? decodeURIComponent(filenameMatch[1])
      : 'visual_data.xlsx';

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-system-blueBg min-h-screen p-1.5">
      <div className="flex items-center justify-between">
        {/* Excel */}
        <ViewEvaluationsBtn />
        <button
          onClick={handleDownload}
          className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#E5E5E5] bg-white hover:opacity-50"
        >
          <Image src={excelIcon} alt="excel" width={16} height={16} />
        </button>
      </div>
      <OneExpertGridTable expertData={data?.result} />
    </div>
  );
};
export default MemberPage;
