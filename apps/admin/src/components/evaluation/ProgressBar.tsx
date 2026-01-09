interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percent = Math.min(Math.round((current / total) * 100), 100);

  const isComplete = current >= total;
  const isEmpty = current === 0;

  const statusText = isComplete ? '완료!' : '진행중...';

  const barColor = isComplete
    ? 'bg-system-green'
    : isEmpty
      ? 'bg-neutral-gray30'
      : 'bg-primary-blue';

  const textColor = isComplete ? 'text-system-green' : 'text-neutral-gray';

  return (
    <div className="flex flex-col gap-2">
      {/* 텍스트 */}
      <div className="flex items-center gap-2">
        <span className="text-bold18 text-neutral-regularBlack">
          {current}/{total}
        </span>
        <span className={`text-regular10 ${textColor}`}>{statusText}</span>
      </div>

      {/* 진행 바 */}
      <div className="bg-neutral-gray10 h-[8px] w-full rounded-full">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
