import { AssignmentImportResult } from '@/src/schemas/expert';
import ModalComponent from '../ModalComponent';

interface AssignmentImportResultModalProps {
  result: AssignmentImportResult;
  onClose: () => void;
}

const SummaryRow = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center justify-between py-1">
    <p className="text-regular16 text-[#2D2E2E]">{label}</p>
    <p className="text-bold16 text-[#2D2E2E]">{value}</p>
  </div>
);

const AssignmentImportResultModal = ({
  result,
  onClose,
}: AssignmentImportResultModalProps) => {
  const { teamsProcessed, assignmentsAdded, assignmentsRemoved, warnings } =
    result;

  return (
    <ModalComponent
      title="엑셀 업로드 결과"
      button="확인"
      editBasicInfo
      onClose={onClose}
      onSubmit={onClose}
    >
      <div className="flex flex-col gap-4">
        <div className="border-system-lineGray flex flex-col divide-y divide-[#E9E9E7] rounded-lg border px-4">
          <SummaryRow label="처리된 팀" value={teamsProcessed} />
          <SummaryRow label="추가된 매칭" value={assignmentsAdded} />
          <SummaryRow label="삭제된 매칭" value={assignmentsRemoved} />
        </div>

        {warnings.length > 0 && (
          <div className="flex flex-col gap-1.5 rounded-lg bg-[#FFF7E6] p-4">
            <p className="text-bold14 text-[#B25E09]">
              확인이 필요한 항목 ({warnings.length})
            </p>
            <ul className="flex flex-col gap-1">
              {warnings.map((warning, index) => (
                <li
                  key={index}
                  className="text-regular14 list-disc pl-4 text-[#8A5A17]"
                >
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ModalComponent>
  );
};

export default AssignmentImportResultModal;
