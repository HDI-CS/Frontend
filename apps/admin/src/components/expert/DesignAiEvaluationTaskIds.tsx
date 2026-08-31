import checkImg from '@/public/expert/blueCheck.svg';
import noCheck from '@/public/expert/noCheck.svg';
import { useDatasetCandidate } from '@/src/hooks/expert/useDatasetCandidate';
import { dataIdsSet } from '@/src/schemas/expert';
import clsx from 'clsx';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { DataId } from './IdAssignmentModal';

interface DesignAiEvaluationTaskIdsProps {
  expert: dataIdsSet;
  assignedIds: DataId[];
  setAssignedIds: React.Dispatch<React.SetStateAction<DataId[]>>;
}

const DesignAiEvaluationTaskIds = ({
  expert,
  assignedIds,
  setAssignedIds,
}: DesignAiEvaluationTaskIdsProps) => {
  const pathname = usePathname();

  const type = pathname.startsWith('/industry') ? 'INDUSTRY' : 'VISUAL';
  const segments = pathname.split('/').filter(Boolean);

  const year = useMemo(() => {
    const y = Number(segments[3]);
    return Number.isFinite(y) ? y : null;
  }, [segments]);
  // 전문가에게 매칭할 데이터셋 후보 조회
  const { data: idData } = useDatasetCandidate(type, year ?? 0);

  const allId = useMemo<DataId[]>(() => {
    if (!idData?.result) return [];
    return idData.result.map((v) => ({
      datasetId: v.id,
      dataCode: v.code,
    }));
  }, [idData]);

  useEffect(() => {
    if (!idData?.result) return;

    const expertIdSet = new Set(expert.dataIds.map((e) => e.datasetId));

    const initialAssigned: DataId[] = idData.result
      .filter((data) => expertIdSet.has(data.id))
      .map((data) => ({
        datasetId: data.id,
        dataCode: data.code,
      }));

    setAssignedIds(initialAssigned);
  }, [idData, expert, setAssignedIds]);

  return (
    <div className="grid grid-cols-5 gap-2 p-3">
      {allId?.map((one) => {
        const checked = assignedIds.some(
          (id) => id.datasetId === one.datasetId
        );

        return (
          <EvaluationTaskId
            key={one.datasetId}
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
  id: DataId;
  checked: boolean;
  setAssignedIds: React.Dispatch<React.SetStateAction<DataId[]>>;
}) => {
  return (
    <div
      onClick={() => {
        setAssignedIds((prev) =>
          prev.some((v) => v.datasetId === id.datasetId)
            ? prev.filter((v) => v.datasetId !== id.datasetId)
            : [...prev, id]
        );
      }}
      className={clsx(
        'border-1 hover:border-primary-blue flex h-11 cursor-pointer items-center justify-between gap-1 rounded-lg p-2',

        checked ? 'border-primary-blue' : 'border-system-lineGray'
      )}
    >
      <div className="text-neutral-regularBlack">{id.dataCode}</div>
      <Image src={checked ? checkImg : noCheck} alt="check" />
    </div>
  );
};
