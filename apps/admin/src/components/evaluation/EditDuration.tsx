import clsx from 'clsx';
import ModalComponent from '../ModalComponent';

interface EditDurationProps {
  name: string;
  onClose: () => void;
}
const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // yyyy-mm-dd
};

const EditDuration = ({ onClose, name }: EditDurationProps) => {
  const today = getToday();

  return (
    <ModalComponent
      title={name}
      subtitle="기간 설정"
      onClose={onClose}
      onSubmit={onClose}
      button="저장"
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
            placeholder={today}
            defaultValue={today}
            className="border-1 focus:outline-primary-blue flex-1 rounded border-[#E9E9E7] p-3 text-center"
          />
          -
          <input
            type="date"
            placeholder={today}
            className="border-1 focus:outline-primary-blue flex-1 rounded border-[#E9E9E7] p-3 text-center"
          />
        </div>
      </div>
    </ModalComponent>
  );
};
export default EditDuration;
