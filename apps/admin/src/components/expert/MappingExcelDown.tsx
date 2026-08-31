import excelIcon from '@/public/data/Excel.svg';
import { UserType } from '@/src/schemas/auth';
import { downloadMappingExcel } from '@/src/services/expert/mapping';
import Image from 'next/image';

interface MappingExcelDownProps {
  type: UserType;
  roundId: number;
}

const MappingExcelDown = ({ type, roundId }: MappingExcelDownProps) => {
  const handleDownload = async () => {
    const res = await downloadMappingExcel({
      type: type ?? 'VISUAL',
      assessmentRoundId: roundId,
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
    <div className="mb-1 flex w-full justify-end">
      <button
        onClick={handleDownload}
        className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded border border-[#E5E5E5] bg-white hover:opacity-50"
      >
        <Image src={excelIcon} alt="excel" width={16} height={16} />
      </button>
    </div>
  );
};
export default MappingExcelDown;
