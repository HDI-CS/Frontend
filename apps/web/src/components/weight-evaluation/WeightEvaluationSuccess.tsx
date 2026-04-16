'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ThumbUp } from '@hdi/ui';

interface WeightEvaluationSuccessProps {
  onRedirect?: () => void;
  type: 'visual' | 'industry';
}

export default function WeightEvaluationSuccess({
  onRedirect,
  type,
}: WeightEvaluationSuccessProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onRedirect?.();
          // 다음 이벤트 루프 틱으로 지연시켜서 React 렌더링 사이클과 충돌 방지
          setTimeout(() => {
            router.push(`/inbox/${type}`);
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, onRedirect, type]);

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-8 px-4 py-8">
      {/* 성공 아이콘 */}
      <div className="relative">
        <div className="rounded-full bg-green-100 p-8 shadow-lg">
          <Image
            src={ThumbUp}
            alt="ThumbUp"
            width={64}
            className="h-auto object-contain"
            priority
          />
        </div>
        {/* 애니메이션 효과 */}
        <div className="absolute inset-0 animate-ping rounded-full bg-green-200 opacity-20"></div>
      </div>

      {/* 성공 메시지 */}
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800">설문 완료!</h1>
        <p className="text-lg text-gray-600">
          설문 문항 평가와 가중치 평가가 모두 성공적으로 완료되었습니다.
        </p>
        <p className="text-sm text-gray-500">
          귀중한 시간을 내어 설문에 참여해주셔서 감사합니다.
        </p>
      </div>

      {/* 카운트다운 */}
      <div className="rounded-lg bg-blue-50 px-6 py-4 shadow-sm">
        <p className="text-center text-sm text-blue-700">
          <span className="font-medium">{countdown}초</span> 후 자동으로 Inbox로
          이동합니다...
        </p>
        <div className="mt-2 h-2 w-full rounded-full bg-blue-200">
          <div
            className="h-2 rounded-full bg-blue-500 transition-all duration-1000 ease-linear"
            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 수동 이동 버튼 */}
      <button
        onClick={() => {
          onRedirect?.();
          // 다음 이벤트 루프 틱으로 지연시켜서 React 렌더링 사이클과 충돌 방지
          setTimeout(() => {
            router.push(`/inbox/${type}`);
          }, 0);
        }}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        나의 Inbox로 이동
      </button>
    </div>
  );
}
