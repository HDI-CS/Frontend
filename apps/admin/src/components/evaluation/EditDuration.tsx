import { useUpdateRoundRange } from '@/src/hooks/evaluation/useUpdateSurvey';
import clsx from 'clsx';
import { useState } from 'react';
import ModalComponent from '../ModalComponent';

import { UserType } from '@/src/schemas/auth';

interface EditDurationProps {
  name: string;
  type: UserType;
  createdRoundId: number;
  startDate: string;
  endDate: string;
  onClose: () => void;
}
const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // yyyy-mm-dd
};

const EditDuration = ({
  onClose,
  name,
  type,
  createdRoundId,
  startDate: initialStartDate,
  endDate: initialEndDate,
}: EditDurationProps) => {
  const today = getToday();

  const [startDate, setStartDate] = useState<string | null>(
    initialStartDate ?? today
  );
  const [endDate, setEndDate] = useState<string | null>(
    initialEndDate ?? today
  );
  const { mutate: updateDuration } = useUpdateRoundRange(type, createdRoundId);

  return (
    <ModalComponent
      title={name}
      subtitle="기간 설정"
      editBasicInfo={true}
      onClose={onClose}
      button="저장"
      onSubmit={() => {
        updateDuration(
          {
            startDate,
            endDate,
          },
          {
            onSuccess: () => {
              onClose();
            },
          }
        );
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={clsx('bg-neutral-gray30 w-1 self-stretch rounded')}
        ></div>
        <span className="text-bold16 w-27">기간 설정</span>
        <div className="flex flex-1 items-center gap-3">
          {/* api 연동 후 placeholder에 기존값 or 당일 시간 */}
          <input
            type="date"
            value={startDate ?? ''}
            onChange={(e) => setStartDate(e.target.value)}
            className="border-1 focus:outline-primary-blue flex-1 rounded border-[#E9E9E7] p-3 text-center"
          />
          -
          <input
            type="date"
            value={endDate ?? ''}
            onChange={(e) => setEndDate(e.target.value)}
            className="border-1 focus:outline-primary-blue flex-1 rounded border-[#E9E9E7] p-3 text-center"
          />
        </div>
      </div>
    </ModalComponent>
  );
};
export default EditDuration;
