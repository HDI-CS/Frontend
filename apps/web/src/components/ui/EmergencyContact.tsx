import clsx from 'clsx';
import Image from 'next/image';

import { EMERGENCY_CONTACT } from '@/constants/notice';
import { HDILabBrandOpenChatQR, HDILabProductOpenChatQR } from '@hdi/ui';

interface EmergencyContactProps {
  className?: string;
  type?: 'visual' | 'industry';
}

export default function EmergencyContact({
  className = '',
  type = 'visual',
}: EmergencyContactProps) {
  const { TITLE, EMAIL, EMAIL_LABEL } = EMERGENCY_CONTACT[type];

  // 타입별 QR 코드 이미지 설정
  const getQRCodeImage = () => {
    switch (type) {
      case 'visual':
        return HDILabBrandOpenChatQR; // 기존 브랜드용 QR 코드
      case 'industry':
        return HDILabProductOpenChatQR; // TODO: 제품용 QR 코드 이미지로 교체 필요
      default:
        return HDILabBrandOpenChatQR;
    }
  };

  return (
    <div
      className={clsx(
        'flex flex-col rounded-lg border border-gray-100 bg-white p-6 shadow-sm',
        className
      )}
    >
      <div className="flex flex-1 items-center justify-center text-center">
        <h3 className="mb-4 text-lg font-bold text-gray-900 lg:text-xl">
          {TITLE}
        </h3>
        <div className="mx-auto mb-3 h-20 w-20">
          <div className="relative h-full w-full">
            <Image
              src={getQRCodeImage()}
              alt={`${type === 'visual' ? '브랜드' : '제품'} 설문 비상연락망 QR`}
              fill
              sizes="(max-width: 1024px) 96px, 112px"
              priority
            />
          </div>
        </div>
        <div className="text-gray-700">
          <p className="text-[13px] lg:text-sm">
            {EMAIL_LABEL}
            <span className="ml-1 font-medium">{EMAIL}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
