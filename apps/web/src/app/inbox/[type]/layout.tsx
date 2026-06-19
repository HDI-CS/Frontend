// import EmergencyContact from '@/components/ui/EmergencyContact';
import ProgressGuidelines from '@/components/ui/ProgressGuidelines';
import SurveyIntroduction from '@/components/ui/SurveyIntroduction';

interface InboxLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    type: string;
  }>;
}

export default async function InboxLayout({
  children,
  params,
}: InboxLayoutProps) {
  // params를 await하여 값을 가져옴
  const { type } = await params;

  // type 파라미터를 'visual' | 'industry' 타입으로 변환
  const surveyType = type === 'visual' || type === 'industry' ? type : 'visual'; // 기본값은 brand

  return (
    <div className="min-h-screen">
      <section className="rounded-b-xl bg-gray-50 py-6">
        <div className="grid grid-cols-1 gap-4 px-8 lg:grid-cols-2 lg:items-stretch">
          {/* 왼쪽 컬럼 - 설문지 소개 */}
          <div className="flex lg:col-span-1">
            <SurveyIntroduction className="flex-1" type={surveyType} />
          </div>

          {/* 오른쪽 컬럼 - 가이드라인 */}
          <div className="flex flex-col space-y-4 lg:col-span-1">
            <ProgressGuidelines className="flex-1" type={surveyType} />
            {/* <EmergencyContact type={surveyType} /> */}
          </div>
        </div>
      </section>
      {children}
    </div>
  );
}
