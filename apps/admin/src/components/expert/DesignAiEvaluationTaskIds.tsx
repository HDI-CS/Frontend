import checkImg from '@/public/expert/blueCheck.svg';
import noCheck from '@/public/expert/noCheck.svg';
import { ALL_IDS, IdMappingType } from '@/src/constants/expert';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface DesignAiEvaluationTaskIdsProps {
  expert: IdMappingType;
  assignedIds: string[];
  setAssignedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const DesignAiEvaluationTaskIds = ({
  expert,
  assignedIds,
  setAssignedIds,
}: DesignAiEvaluationTaskIdsProps) => {
  const [allId, setAllId] = useState<string[]>([]);

  useEffect(() => {
    setAssignedIds(expert.assignedProductIds);
    setAllId(ALL_IDS);
  }, [expert, setAssignedIds]);

  return (
    <div className="grid grid-cols-5 gap-2 p-3">
      {allId?.map((one) => {
        const checked = assignedIds.includes(one);

        return (
          <EvaluationTaskId
            key={one}
            id={one}
            checked={checked}
            setAssignedIds={setAssignedIds}
          />
        );
      })}
    </div>
  );
};
export default DesignAiEvaluationTaskIds;

const EvaluationTaskId = ({
  id,
  checked,
  setAssignedIds,
}: {
  id: string;
  checked: boolean;
  setAssignedIds: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  return (
    <div
      onClick={() => {
        setAssignedIds(
          (prev) =>
            prev.includes(id)
              ? prev.filter((v) => v !== id) // 이미 있으면 제거
              : [...prev, id] // 없으면 추가
        );
      }}
      className={clsx(
        'border-1 hover:border-primary-blue flex cursor-pointer justify-between gap-1 rounded-lg p-2',

        checked ? 'border-primary-blue' : 'border-system-lineGray'
      )}
    >
      <div className="text-neutral-regularBlack">{id}</div>
      <Image src={checked ? checkImg : noCheck} alt="check" />
    </div>
  );
};
