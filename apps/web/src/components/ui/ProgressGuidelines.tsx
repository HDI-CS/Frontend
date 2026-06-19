import clsx from 'clsx';
import Image from 'next/image';

import { PROGRESS_GUIDELINES } from '@/constants/notice';
import { UserTypeLower } from '@/schemas/auth';
import { HDILabBrandOpenChatQR, HDILabProductOpenChatQR } from '@hdi/ui';

interface ProgressGuidelinesProps {
  className?: string;
  type?: UserTypeLower;
}

export default function ProgressGuidelines({
  className = '',
  type = 'visual',
}: ProgressGuidelinesProps) {
  const { TITLE, STEPS } = PROGRESS_GUIDELINES[type];

  // 타입별 QR 코드 이미지 설정
  const getQRCodeImage = () => {
    switch (type) {
      case 'visual':
        return HDILabBrandOpenChatQR;
      case 'industry':
        return HDILabProductOpenChatQR;
      default:
        return HDILabBrandOpenChatQR;
    }
  };

  return (
    <div
      className={clsx(
        'relative flex flex-col rounded-lg border border-blue-100 bg-blue-50 p-8 shadow-sm',
        className
      )}
    >
      {/* QR 코드 - 우측 상단 absolute 포지셔닝 */}
      <div className="absolute right-6 top-6 z-10">
        <div className="h-12 w-12 sm:h-16 sm:w-16">
          <div className="relative h-full w-full rounded-lg bg-white p-1 shadow-sm">
            <Image
              src={getQRCodeImage()}
              alt={`${type === 'visual' ? '브랜드' : '제품'} 설문 카카오톡 오픈채팅 QR`}
              fill
              sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 64px"
              priority
              className="rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-full max-w-2xl flex-col">
        <h2 className="mb-8 text-center text-xl font-bold text-gray-800">
          {TITLE}
        </h2>
        <section className="flex flex-1 flex-col justify-between">
          <ul className="space-y-4">
            {STEPS.map((step) => (
              <li
                key={step.number}
                className="flex items-start space-x-2 sm:space-x-3"
              >
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md bg-blue-500 text-[11px] font-medium text-white sm:h-5 sm:w-5 sm:text-xs">
                  {step.number}
                </span>
                <div className="text-sm text-gray-700 sm:text-[15px]">
                  <p className="flex items-center gap-1 sm:gap-2">
                    {step.image ? (
                      <>
                        {step.content.split("'홍익대학교'")[0]}
                        <span className="inline-flex items-center">
                          <Image
                            src={step.image}
                            alt="홍익대학교 로고"
                            width={60}
                            height={20}
                            className="inline-block h-4 w-auto object-contain sm:h-5"
                          />
                        </span>
                        {step.content.split("'홍익대학교'")[1]}
                      </>
                    ) : (
                      step.content
                    )}
                  </p>
                  {step.note && (
                    <div className="mt-1 space-y-0.5">
                      {Array.isArray(step.note) ? (
                        step.note.map((noteItem, noteIndex) => (
                          <p
                            key={noteIndex}
                            className="text-xs font-medium text-red-600 sm:text-sm"
                          >
                            {noteItem}
                          </p>
                        ))
                      ) : (
                        <p className="text-xs font-medium text-red-600 sm:text-sm">
                          {step.note}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* 참고사항 - 급한 연락 안내 */}
          <div className="mt-4">
            <p className="text-xs text-gray-400 sm:text-sm">
              *급한 연락이 필요한 경우, 우측 상단 QR을 찍고 카카오톡
              오픈채팅으로 연락해주세요.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
