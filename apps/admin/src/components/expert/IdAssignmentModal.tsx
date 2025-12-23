import { IdMappingType } from '@/src/constants/expert';
import clsx from 'clsx';
import { useState } from 'react';
import ModalComponent from '../ModalComponent';
import DesignAiEvaluationTaskIds from './DesignAiEvaluationTaskIds';

interface IdAssignmentModalProps {
  index: number;
  expert: IdMappingType;
  currentIndex: number;
  totalLength: number;
  lastIndex: number | null;

  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

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
  expert?: IdMappingType;
  assignedIds?: string[];
  setAssignedIds?: React.Dispatch<React.SetStateAction<string[]>>;
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
  expert,
  index,
  currentIndex,
  totalLength,
  onPrev,
  onNext,
}: IdAssignmentModalProps) => {
  const [assignedIds, setAssignedIds] = useState<string[]>([]);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= totalLength - 1;

  return (
    <>
      <ModalComponent
        title={String(index)}
        subtitle="평가 ID 배정"
        onClose={onClose}
        onSubmit={onClose}
        button="저장"
        allow={true}
        isPrevDisabled={isFirst}
        isNextDisabled={isLast}
        onPrev={onPrev}
        onNext={onNext}
      >
        <div className="flex flex-col gap-5">
          <LinedField
            value={expert.expertName}
            label="평가자명"
            isNumber={false}
          />
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
