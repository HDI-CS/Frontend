import excelIcon from '@/public/data/Excel.svg';
import { useImportAssignmentExcel } from '@/src/hooks/expert/useImportAssignmentExcel';
import { UserType } from '@/src/schemas/auth';
import { AssignmentImportResult } from '@/src/schemas/expert';
import axios from 'axios';
import Image from 'next/image';
import { useRef, useState } from 'react';
import AssignmentImportResultModal from './AssignmentImportResultModal';

interface MappingExcelUploadProps {
  type: UserType;
  roundId: number;
}

const MappingExcelUpload = ({ type, roundId }: MappingExcelUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<AssignmentImportResult | null>(null);

  const { mutate: importExcel, isPending } = useImportAssignmentExcel({
    type,
    assessmentRoundId: roundId,
  });

  const handlePickFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 파일을 다시 선택해도 onChange가 발생하도록 초기화
    e.target.value = '';
    if (!file) return;

    // ⚠️ 이 업로드는 추가(append)가 아니라, 팀별로 파일에 적힌 목록을
    // "최종 상태"로 보고 기존 매칭 중 파일에 없는 항목을 전부 삭제(치환)한다.
    // 일부 팀만 담긴 파일을 실수로 올리면 나머지 팀의 기존 매칭이 조용히
    // 사라질 수 있어, 실행 전 명시적으로 확인을 받는다.
    const confirmed = window.confirm(
      '엑셀 업로드는 추가가 아니라 전체 교체 방식입니다.\n' +
        '파일에 없는 팀/데이터의 기존 매칭은 모두 삭제됩니다.\n\n' +
        '계속하시겠습니까?'
    );
    if (!confirmed) return;

    importExcel(file, {
      onSuccess: (res) => {
        setResult(res.result);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          const messageDetail = error.response?.data?.messageDetail;
          alert(messageDetail ?? '엑셀 업로드 중 오류가 발생했습니다.');
          return;
        }
        alert('알 수 없는 오류가 발생했습니다.');
      },
    });
  };

  return (
    <>
      <button
        onClick={handlePickFile}
        disabled={isPending}
        className="flex h-[32px] items-center gap-1.5 rounded border border-[#E5E5E5] bg-white px-3 hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Image src={excelIcon} alt="excel" width={16} height={16} />
        <span className="text-regular14 text-[#2D2E2E]">
          {isPending ? '업로드 중...' : 'ID 매칭 엑셀'}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />

      {result && (
        <AssignmentImportResultModal
          result={result}
          onClose={() => setResult(null)}
        />
      )}
    </>
  );
};

export default MappingExcelUpload;
