import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ViewEvaluationsBtn = () => {
  const router = useRouter();
  return (
    <button
      onClick={router.back}
      className="bg-neutral-white text-primary-blue border-1 text-bold18 border-system-lineGray mb-1.5 flex cursor-pointer items-center gap-1 rounded px-3 py-2 hover:opacity-80"
    >
      <ChevronLeft />
      평가 중인 전문가 페이지로 이동
    </button>
  );
};
export default ViewEvaluationsBtn;
