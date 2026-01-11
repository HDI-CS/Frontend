import { useCreateExpertAssignment } from '@/src/hooks/expert/useCreateExpertAssignment';
import { useUpdatMapping } from '@/src/hooks/expert/useUpdateExpert';
import { UserType } from '@/src/schemas/auth';
import { dataIdsSet } from '@/src/schemas/expert';
import clsx from 'clsx';
import { useState } from 'react';
import ModalComponent from '../ModalComponent';
import DesignAiEvaluationTaskIds from './DesignAiEvaluationTaskIds';

interface IdAssignmentModalProps {
  type: UserType;
  round: number;
  isTemp: boolean;
  index: number;
  expert: dataIdsSet;
  currentIndex: number;
  totalLength: number;
  lastIndex: number | null;

  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export type DataId = {
  datasetId: number;
  dataCode: string;
};

const LinedField = ({
  value,
  label,
  isNumber,
  expert,
  assignedIds,
  setAssignedIds,
}: {
  value: string;
  label: string;
  isNumber: boolean;
  expert?: dataIdsSet;
  assignedIds?: DataId[];
  setAssignedIds?: React.Dispatch<React.SetStateAction<DataId[]>>;
}) => {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={clsx('bg-system-lineGray w-1 self-stretch rounded')}
      ></div>
      {isNumber && expert && setAssignedIds && assignedIds ? (
        <div className="flex w-full flex-col gap-2.5">
          <div className="flex flex-1 justify-between">
            <p className={clsx('text-bold16 py-1 text-[#2D2E2E]')}>{label}</p>
            <p className="text-neutral-gray text-regular16">{`${assignedIds.length ?? 0} selected`}</p>
          </div>
          <DesignAiEvaluationTaskIds
            expert={expert}
            assignedIds={assignedIds}
            setAssignedIds={setAssignedIds}
          />
        </div>
      ) : (
        <>
          <p className={clsx('text-bold16 w-22 py-1 text-[#2D2E2E]')}>
            {label}
          </p>
        </>
      )}

      {!isNumber && (
        <p
          className={clsx(
            'border-1 border-system-lineGray min-w-37 min-h-11.5 flex-1 rounded-lg p-2.5 text-[#2D2E2E]'
          )}
        >
          {value}
        </p>
      )}
    </div>
  );
};

const IdAssignmentModal = ({
  onClose,
  type,
  round,
  isTemp,
  expert,
  index,
  currentIndex,
  totalLength,
  onPrev,
  onNext,
}: IdAssignmentModalProps) => {
  const [assignedIds, setAssignedIds] = useState<DataId[]>([]);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= totalLength - 1;
  const { mutate: mapping } = useUpdatMapping(type, round, index);
  const { mutate: register } = useCreateExpertAssignment({
    type,
    assessmentRoundId: round,
  });

  const handleSubmit = () => {
    const idArray = assignedIds.map((i) => i.datasetId);
    // 등록일 경우
    if (isTemp) {
      const registerData = {
        memberId: index,
        datasetsIds: idArray,
      };
      register(registerData);
    }
    // 수정일 경우 
    if (!isTemp) {
      mapping({
        ids: idArray,
      });
    }
    onClose();
  };

  return (
    <>
      <ModalComponent
        title={String(index)}
        subtitle="평가 ID 배정"
        onClose={() => {
          onClose();
          setAssignedIds([]);
        }}
        onSubmit={handleSubmit}
        button="저장"
        allow={true}
        isPrevDisabled={isFirst}
        isNextDisabled={isLast}
        onPrev={onPrev}
        onNext={onNext}
      >
        <div className="flex flex-col gap-5">
          <LinedField value={expert.name} label="평가자명" isNumber={false} />
          <LinedField
            value=""
            label="디자인 AI 해석 및 평가 리스트 수행 번호"
            isNumber={true}
            expert={expert}
            assignedIds={assignedIds}
            setAssignedIds={setAssignedIds}
          />
        </div>
      </ModalComponent>
    </>
  );
};

export default IdAssignmentModal;
