interface WeightEvaluationHeaderProps {
  type?: 'visual' | 'industry';
}

export default function WeightEvaluationHeader({
  type = 'visual',
}: WeightEvaluationHeaderProps) {
  const getHeaderContent = () => {
    if (type === 'visual') {
      return {
        title: '부문별 평가요인 가중치',
        description:
          '각 카테고리 별 로고 디자인 평가 항목의 중요도에 대해 평가부탁드립니다.',
      };
    } else {
      return {
        title: '부문별 평가요인 가중치',
        description:
          '각 카테고리 별 제품 디자인 평가 항목의 중요도에 대해 평가부탁드립니다.',
      };
    }
  };

  const { title, description } = getHeaderContent();

  return (
    <div className="flex-shrink-0 border-b border-gray-200 bg-blue-50 px-6 py-4">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      <p className="mt-1 text-sm text-gray-600">{description}</p>

      {/* 상태 색상 가이드 */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <h3 className="mb-3 text-sm font-medium text-gray-800">
          📊 합계 상태 가이드:
        </h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-green-200 bg-green-50"></div>
            <span className="font-medium text-green-700">100% 완료</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-orange-200 bg-orange-100"></div>
            <span className="font-medium text-orange-700">100% 미만</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-red-200 bg-red-100"></div>
            <span className="font-medium text-red-700">100% 초과</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-red-200 bg-red-50"></div>
            <span className="font-medium text-red-700">검증 오류</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          각 카테고리별 가중치 합이 정확히 100%가 되어야 평가완료가 가능합니다.
        </p>
      </div>
    </div>
  );
}
