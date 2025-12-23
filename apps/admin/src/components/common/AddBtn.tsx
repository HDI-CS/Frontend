import clsx from 'clsx';

interface AddBtnProps {
  setAdd: React.Dispatch<React.SetStateAction<boolean>>;
  isEvaluation?: boolean;
  // isEvaluationYear?: boolean;
}

const AddBtn = ({ setAdd, isEvaluation = false }: AddBtnProps) => {
  return (
    <div className="mt-7.5 flex w-full cursor-pointer items-center justify-center">
      <div
        onClick={() => setAdd(true)}
        className={
          'border-1 h-fulll shadow-card bg-neutral-white flex items-center gap-2 border-[#E9EFF4] p-6 text-center text-3xl font-light text-[#4676FB] hover:bg-[#4676FB] hover:text-[#ffffff]'
        }
      >
        <p
          className={clsx(
            'flex h-5 w-5 items-center justify-center',
            isEvaluation ? '-mt-1.5' : '-mt-1'
          )}
        >
          +
        </p>
        {isEvaluation && <p className="text-regular16">평가 추가하기</p>}
      </div>
    </div>
  );
};
export default AddBtn;
