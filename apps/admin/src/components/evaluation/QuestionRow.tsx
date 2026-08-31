import clsx from 'clsx';

interface QuestionRowProps {
  index: number;
  value: string;
  active: boolean;
  onChange: (v: string) => void;
  onFocus: () => void;
  onRemove: () => void;
}

const QuestionRow = ({
  index,
  value,
  active,
  onChange,
  onFocus,
  onRemove,
}: QuestionRowProps) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-2.5"
    >
      <div
        className={clsx(
          'h-11 w-1 self-stretch rounded',
          active ? 'bg-primary-blue' : 'bg-system-lineGray'
        )}
      ></div>

      {/* 번호 */}
      <span className="w-22 text-bold16 -mb-1 h-5 text-sm text-[#2D2E2E]">
        {index + 1}
      </span>

      {/* 입력 */}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder="평가 질문을 적어주세요"
        className={clsx(
          'placeholder:text-gray text-regular16 h-11 flex-1 rounded-lg border-[1px] px-3 py-3 text-[#2D2E2E] outline-none',
          active
            ? 'border-primary-blue ring-primary-blue ring-[1px]'
            : 'border-[#E5E5E5]'
        )}
      />

      {/* 삭제 */}
      <button
        onClick={onRemove}
        className="-1mt-1 hover:text-primary-blue cursor-pointer text-2xl font-light text-[#D4D4D4]"
      >
        ×
      </button>
    </div>
  );
};
export default QuestionRow;
