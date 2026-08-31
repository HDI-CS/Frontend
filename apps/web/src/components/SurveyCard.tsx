'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import {
  SURVEY_STATUS_BUTTON_STYLES,
  SURVEY_STATUS_LABELS,
} from '@/constants/survey';
import type { SurveyResult } from '@/schemas/survey';

export default function SurveyCard({
  item,
  index,
}: {
  item: SurveyResult;
  index: number;
}) {
  const { name, image, dataId, responseStatus } = item;
  const { type } = useParams();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const numberLabel = (index + 1).toString().padStart(2, '0');
  const status = responseStatus;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow duration-300 ease-out hover:shadow-md">
      {/* 번호 */}
      <span className="mb-3 block text-xs font-medium text-gray-500 sm:text-sm">
        {numberLabel}
      </span>

      {/* 이미지 영역 - 4:3 비율로 변경 */}
      <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded">
        {/* 이미지 로딩 중일 때 스켈레톤 표시 */}
        {imageLoading && !imageError && (
          <div className="absolute inset-0 animate-pulse rounded bg-gray-200"></div>
        )}

        {/* 이미지 로딩 실패 시 대체 텍스트 표시 */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="px-2 text-center text-xs font-bold text-gray-500">
              {name}
            </div>
          </div>
        )}

        {/* 실제 이미지 */}
        <Image
          src={image}
          alt={name}
          fill
          sizes="100vw"
          className={`object-contain transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => {
            setImageLoading(false);
            setImageError(false);
          }}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
        />
      </div>

      {/* 브랜드명 */}
      <span className="mb-4 mt-8 block text-center text-[13px] font-medium text-gray-900 sm:text-sm md:text-base">
        {name}
      </span>

      {/* 버튼 */}
      <Link
        href={`/survey/${type}/${dataId}`}
        className={`block w-full rounded-lg px-3 py-2.5 text-center text-[13px] transition-colors md:py-2.5 md:text-sm ${SURVEY_STATUS_BUTTON_STYLES[status]}`}
      >
        {SURVEY_STATUS_LABELS[status]}
      </Link>
    </div>
  );
}
