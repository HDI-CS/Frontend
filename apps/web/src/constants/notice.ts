import { HongikUnivLogo } from '@hdi/ui';
import { StaticImageData } from 'next/image';

// 진행 가이드라인 상수
interface ProgressStep {
  number: number;
  content: string;
  note?: string | string[];
  image?: StaticImageData;
}

export const PROGRESS_GUIDELINES = {
  visual: {
    TITLE: '진행 가이드라인',
    STEPS: [
      {
        number: 1,
        content: '‘설문하러 가기’ 버튼을 클릭해주세요.',
      },
      {
        number: 2,
        content:
          '왼쪽의 디자인 세트를 확인하고, 오른쪽의 디자인 평가 설문을 진행해주세요.',
        note: [
          '*필수 사항: 평가 전 웹사이트 링크를 확인하여 브랜드의 분위기를 파악해주세요.',
          '*진행 중인 평가는 문항별로 자동 저장되며, 원하는 시점에 이어서 진행할 수 있습니다.',
        ],
      },
      {
        number: 3,
        content:
          '누락된 평가 항목이 없는지 확인한 후 ‘전체 평가 제출’ 버튼을 클릭하여 제출해주세요.',
      },
      {
        number: 4,
        content:
          "좌측 상단 '홍익대학교' 로고를 클릭하면 첫 화면으로 이동 가능합니다.",
        image: HongikUnivLogo,
      },
      {
        number: 5,
        content:
          "총 50개 평가가 완료되면 '전체 평가 제출' 버튼을 클릭하여 가중치 평가를 진행해주세요.",
      },
      {
        number: 6,
        content: "'최종 제출하기' 버튼을 클릭하여 제출을 완료해주세요.",
      },
    ] as ProgressStep[],
  },
  industry: {
    TITLE: '진행 가이드라인',
    STEPS: [
      {
        number: 1,
        content: '‘설문하러 가기’ 버튼을 클릭해주세요.',
      },
      {
        number: 2,
        content:
          '왼쪽의 디자인 세트를 확인하고, 오른쪽의 디자인 평가 설문을 진행해주세요.',
        note: [
          '*필수 사항: 평가 전 제품 정보를 확인하여 제품의 특성을 파악해주세요.',
          '*진행 중인 평가는 문항별로 자동 저장되며, 원하는 시점에 이어서 진행할 수 있습니다.',
        ],
      },
      {
        number: 3,
        content:
          '누락된 평가 항목이 없는지 확인한 후 ‘전체 평가 제출’ 버튼을 클릭하여 제출해주세요.',
      },
      {
        number: 4,
        content:
          "좌측 상단 '홍익대학교' 로고를 클릭하면 첫 화면으로 이동 가능합니다.",
        image: HongikUnivLogo,
      },
      {
        number: 5,
        content:
          "총 50개 평가가 완료되면 '전체 평가 제출' 버튼을 클릭하여 가중치 평가를 진행해주세요.",
      },
      {
        number: 6,
        content: "'최종 제출하기' 버튼을 클릭하여 제출을 완료해주세요.",
      },
    ] as ProgressStep[],
  },
} as const;

// 설문 소개 상수
interface RichSegment {
  text: string;
  highlight?: boolean; // 문장 내 강조 여부
  className?: string; // 추가 스타일
  breakAfter?: boolean; // 해당 세그먼트 뒤에서 줄바꿈 여부
}

interface ContentItem {
  type: 'text' | 'highlight' | 'rich';
  content: string | string[] | RichSegment[];
  className?: string;
}

export const SURVEY_INTRODUCTION = {
  visual: {
    TITLE: '로고 디자인 해석·평가 AI 개발을 위한 설문지',
    CONTENT: [
      {
        type: 'rich',
        content: [
          { text: '안녕하십니까.', breakAfter: true },
          { text: '본 연구는 ' },
          { text: '한국산업기술기획평가원과 홍익대학교 HDI LAB에서 수행하는 ' },
          { text: "'생성AI 기반 디자인 평가 시스템 구축'", highlight: true },
          {
            text: ' 연구입니다. 해당 연구는 시각 디자인 요소를 객관적으로 분석·평가할 수 있는 AI 모델을 구축하는 것을 목표로 합니다.',
          },
        ] as RichSegment[],
      },
      {
        type: 'text',
        content:
          '참여자는 제시된 로고 디자인을 평가하게 되며, 그 결과는 연구 데이터베이스에 축적되어 AI 모델이 디자인을 해석하고 분석하는 방식을 정교화하는 데 활용됩니다.',
      },
      {
        type: 'text',
        content:
          '설문은 심미성, 조형성, 독창성, 사용성, 기능성, 윤리성, 경제성, 목적성, 종합평가의 아홉 가지 평가 지표를 바탕으로 구성되어 있으며, 각 응답은 AI가 다각적인 평가 기준을 학습할 수 있도록 지원합니다.',
      },
      {
        type: 'text',
        content:
          '본 연구는 통계법 제33조(비밀의 보호) 및 개인정보보호법에 의거하여 수행됩니다. 수집된 모든 데이터는 연구 목적 외에는 일절 사용되지 않으며, 응답자의 익명성은 철저히 보장됨을 약속드립니다.',
      },
      {
        type: 'text',
        content: '참여해 주셔서 대단히 감사드립니다.',
        className: 'font-semibold',
      },
    ] as ContentItem[],
    FOOTER: {
      RESEARCH_INSTITUTION: '연구책임기관: 홍익대학교 HDI LAB',
      CONTACT_EMAIL: '문의 메일: hdilab01@gmail.com',
    },
  },
  industry: {
    TITLE: '제품 디자인 해석·평가 AI 개발을 위한 설문지',
    CONTENT: [
      {
        type: 'rich',
        content: [
          { text: '안녕하십니까.', breakAfter: true },
          { text: '본 연구는 ' },
          { text: '한국산업기술기획평가원과 홍익대학교 HDI LAB에서 수행하는 ' },
          { text: "'생성AI 기반 디자인 평가 시스템 구축'", highlight: true },
          {
            text: ' 연구입니다. 해당 연구는 제품 디자인 요소를 객관적으로 분석·평가할 수 있는 AI 모델을 구축하는 것을 목표로 합니다.',
          },
        ] as RichSegment[],
      },
      {
        type: 'text',
        content:
          '참여자는 제시된 제품 디자인을 평가하게 되며, 그 결과는 연구 데이터베이스에 축적되어 AI 모델이 제품 디자인을 해석하고 분석하는 방식을 정교화하는 데 활용됩니다.',
      },
      {
        type: 'text',
        content:
          '설문은 심미성, 조형성, 독창성, 사용성, 기능성, 윤리성, 경제성, 목적성, 종합평가의 아홉 가지 평가 지표를 바탕으로 구성되어 있으며, 각 응답은 AI가 다각적인 평가 기준을 학습할 수 있도록 지원합니다.',
      },
      {
        type: 'text',
        content:
          '본 연구는 통계법 제33조(비밀의 보호) 및 개인정보보호법에 의거하여 수행됩니다. 수집된 모든 데이터는 연구 목적 외에는 일절 사용되지 않으며, 응답자의 익명성은 철저히 보장됨을 약속드립니다.',
      },
      {
        type: 'text',
        content: '참여해 주셔서 대단히 감사드립니다.',
        className: 'font-semibold',
      },
    ] as ContentItem[],
    FOOTER: {
      RESEARCH_INSTITUTION: '연구책임기관: 홍익대학교 HDI LAB',
      CONTACT_EMAIL: '문의 메일: hdilab01@gmail.com',
    },
  },
} as const;

// 비상 연락망 상수
export const EMERGENCY_CONTACT = {
  visual: {
    TITLE: '비상 연락망',
    EMAIL: 'hdilab01@gmail.com',
    EMAIL_LABEL: '비상연락망:',
  },
  industry: {
    TITLE: '비상 연락망',
    EMAIL: 'hdilab01@gmail.com',
    EMAIL_LABEL: '비상연락망:',
  },
} as const;
