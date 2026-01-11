import { SurveyQustion } from '../types/evaluation';

type Question = {
  id: string;
  text: string;
};

export const SURVEY_QUESTIONS: Question[] = [
  {
    id: '1',
    text: '이 브랜드의 로고는 어떻게 생겼을까요?',
  },
  { id: '2', text: '이 브랜드의 로고는 어떻게 생겼을까요?' },
  { id: '3', text: '이 브랜드의 로고는 어떻게 생겼을까요?' },
  {
    id: '4',
    text: '이 브랜드의 로고는 어떻게 생겼을까요?',
  },
  {
    id: '5',
    text: '이 브랜드의 로고는 어떻게 생겼을까요?',
  },
  {
    id: '6',
    text: '이 브랜드의 로고는 어떻게 생겼을까요?',
  },
  {
    id: '7',
    text: '이 브랜드의 로고는 어떻게 생겼을까요?',
  },
  {
    id: '8',
    text: '이 브랜드의 로고는 어떻게 생겼을까요?',
  },
  {
    id: '9',
    text: '이 브랜드의 로고는 어떻게 생겼을까요?',
  },
  {
    id: '10',
    text: '이 브랜드의 로고는 어떻게 생겼을까요?',
  },
  {
    id: '11',
    text: '이 브랜드의 로고는 어떻게 생겼을까요?',
  },
  {
    id: '12',
    text: '이 브랜드의 로고는 어떻게 생겼을까요?',
  },
];

export const SUBJECT_QUESTION: Question = {
  id: 'subject',
  text: '적어주세요',
};

// 더미
export const DUMMY_SURVEY: SurveyQustion[] = [
  {
    id: 1,
    name: '장혜선',
    progress: 20,
    isWeighted: true,
    qualitativeEvaluation: [
      {
        id: 1,
        isQualitative: true,
      },
      {
        id: 2,
        isQualitative: false,
      },
      {
        id: 3,
        isQualitative: true,
      },
      {
        id: 4,
        isQualitative: true,
      },
      {
        id: 5,
        isQualitative: false,
      },
      {
        id: 6,
        isQualitative: true,
      },
      {
        id: 7,
        isQualitative: true,
      },
      {
        id: 8,
        isQualitative: false,
      },
      {
        id: 9,
        isQualitative: true,
      },
      {
        id: 10,
        isQualitative: true,
      },
      {
        id: 11,
        isQualitative: true,
      },
      {
        id: 12,
        isQualitative: true,
      },
    ],
  },
  {
    id: 2,
    name: '스타벅스',
    progress: 0,
    isWeighted: true,
    qualitativeEvaluation: [
      {
        id: 1,
        isQualitative: true,
      },
      {
        id: 2,
        isQualitative: false,
      },
      {
        id: 3,
        isQualitative: true,
      },
      {
        id: 4,
        isQualitative: true,
      },
      {
        id: 5,
        isQualitative: false,
      },
      {
        id: 6,
        isQualitative: true,
      },
      {
        id: 7,
        isQualitative: true,
      },
      {
        id: 8,
        isQualitative: false,
      },
      {
        id: 9,
        isQualitative: true,
      },
      {
        id: 10,
        isQualitative: true,
      },
      {
        id: 11,
        isQualitative: true,
      },
      {
        id: 12,
        isQualitative: true,
      },
    ],
  },
  {
    id: 3,
    name: '스타벅스',
    progress: 30,
    isWeighted: false,
    qualitativeEvaluation: [
      {
        id: 1,
        isQualitative: true,
      },
      {
        id: 2,
        isQualitative: false,
      },
      {
        id: 3,
        isQualitative: true,
      },
      {
        id: 4,
        isQualitative: true,
      },
      {
        id: 5,
        isQualitative: false,
      },
      {
        id: 6,
        isQualitative: true,
      },
      {
        id: 7,
        isQualitative: true,
      },
      {
        id: 8,
        isQualitative: false,
      },
      {
        id: 9,
        isQualitative: true,
      },
      {
        id: 10,
        isQualitative: true,
      },
      {
        id: 11,
        isQualitative: true,
      },
      {
        id: 12,
        isQualitative: true,
      },
    ],
  },
  {
    id: 4,
    name: '김민지',
    progress: 15,
    isWeighted: true,
    qualitativeEvaluation: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      isQualitative: i % 2 === 0,
    })),
  },
  {
    id: 5,
    name: '이서준',
    progress: 25,
    isWeighted: false,
    qualitativeEvaluation: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      isQualitative: i % 3 !== 0,
    })),
  },
  {
    id: 6,
    name: '박지훈',
    progress: 10,
    isWeighted: true,
    qualitativeEvaluation: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      isQualitative: true,
    })),
  },
  {
    id: 7,
    name: '최유진',
    progress: 20,
    isWeighted: true,
    qualitativeEvaluation: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      isQualitative: i !== 4,
    })),
  },
  {
    id: 8,
    name: '정하늘',
    progress: 30,
    isWeighted: false,
    qualitativeEvaluation: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      isQualitative: true,
    })),
  },
  {
    id: 9,
    name: '윤도현',
    progress: 0,
    isWeighted: true,
    qualitativeEvaluation: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      isQualitative: i < 6,
    })),
  },
  {
    id: 10,
    name: '한지민',
    progress: 25,
    isWeighted: false,
    qualitativeEvaluation: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      isQualitative: i % 2 === 1,
    })),
  },
  {
    id: 11,
    name: '오세훈',
    progress: 5,
    isWeighted: true,
    qualitativeEvaluation: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      isQualitative: i === 0,
    })),
  },
  {
    id: 12,
    name: '신예은',
    progress: 30,
    isWeighted: true,
    qualitativeEvaluation: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      isQualitative: i !== 9,
    })),
  },
];

//////////////////////////////
// 하나의 평가자의 응답 데이터
export interface ExpertResponse {
  id: number;
  evaluatorName: string; // 평가자명 (고정)
  surveyId: string; // 설문 ID
  quantitativeScores: number[]; // 1~5 점수들
  qualitativeComment: string; // 정성평가
}

export const DUMMY_EXPERT_RESPONSES: ExpertResponse[] = [
  {
    id: 1,
    evaluatorName: '장혜선',
    surveyId: '0001',
    quantitativeScores: [4, 4, 4, 5, 4, 4, 4, 4, 2, 4, 4, 4],
    qualitativeComment:
      '영문 스펠링이 길어서 자체 가독성이 좋지 않긴하지만, 적당한 굵기와 정리된 자간으로 한눈에 인식하기엔 좋은 로고 같다. 로고 옆에 인장 요소의 심볼과 어울어져 한방(?)의 브랜드 컨셉을 이해할 수 있음으로서 목적성에 부합한다. 사용성에 있어서는 로고 타입의 경우에는 적당한 굵기로 인쇄 등 작업에 용이하긴하지만 인장의 경우, 크기가 작아질 경우에 메어질 위험성이 다소 보인다. ',
  },
  {
    id: 2,
    evaluatorName: '장혜선',
    surveyId: '0002',
    quantitativeScores: [4, 3, 4, 4, 5, 4, 4, 4, 2, 4, 4, 1],
    qualitativeComment:
      '타깃 소비자 분석은 적절하나, 차별 포인트가 조금 더 드러나면 좋겠습니다.',
  },
  {
    id: 3,
    evaluatorName: '장혜선',
    surveyId: '0003',
    quantitativeScores: [5, 4, 5, 5, 5, 4, 4, 5, 2, 4, 4, 4],
    qualitativeComment:
      '브랜드 컨셉과 비주얼 전략이 매우 잘 정리되어 있으며 완성도가 높습니다.',
  },
  {
    id: 4,
    evaluatorName: '장혜선',
    surveyId: '0004',
    quantitativeScores: [1, 2, 4, 4, 4, 3, 3, 4, 2, 4, 4, 4],
    qualitativeComment:
      '기본적인 구성은 충실하지만 브랜드 고유의 스토리가 다소 약합니다.',
  },
  {
    id: 5,
    evaluatorName: '장혜선',
    surveyId: '0005',
    quantitativeScores: [4, 4, 4, 5, 5, 4, 4, 4, 2, 4, 4, 4],
    qualitativeComment:
      '시장 트렌드를 잘 반영하고 있으며, 실무 적용 가능성이 높아 보입니다.',
  },
  {
    id: 6,
    evaluatorName: '장혜선',
    surveyId: '0006',
    quantitativeScores: [2, 3, 3, 3, 4, 3, 3, 3, 2, 4, 4, 4],
    qualitativeComment:
      '전반적인 방향성은 이해되나, 구체적인 실행 전략이 부족합니다.',
  },
  {
    id: 7,
    evaluatorName: '장혜선',
    surveyId: '0007',
    quantitativeScores: [5, 5, 5, 5, 5, 5, 4, 2, 4, 4, 3, 4],
    qualitativeComment:
      '브랜드 전략, 표현 방식, 논리 구조 모두 매우 우수합니다.',
  },
  {
    id: 8,
    evaluatorName: '장혜선',
    surveyId: '0008',
    quantitativeScores: [4, 4, 3, 4, 4, 4, 3, 4, 4, 4, 3, 4],
    qualitativeComment:
      '전체적인 완성도는 좋으나 일부 항목에서 설명이 간결하지 못합니다.',
  },
  {
    id: 9,
    evaluatorName: '장혜선',
    surveyId: '0009',
    quantitativeScores: [3, 3, 3, 4, 4, 3, 3, 2, 4, 4, 3, 4],
    qualitativeComment:
      '기본 요건은 충족하지만 차별화 요소가 약해 인상도가 낮습니다.',
  },
  {
    id: 10,
    evaluatorName: '장혜선',
    surveyId: '0010',
    quantitativeScores: [5, 4, 5, 5, 4, 5, 5, 5, 4, 4, 3, 4],
    qualitativeComment:
      '브랜드 메시지가 명확하고 설득력이 높아 매우 긍정적인 평가입니다.',
  },
  {
    id: 11,
    evaluatorName: '장혜선',
    surveyId: '0011',
    quantitativeScores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4],
    qualitativeComment:
      '전반적으로 안정적인 수준이며, 큰 보완 없이도 활용 가능해 보입니다.',
  },
  {
    id: 12,
    evaluatorName: '장혜선',
    surveyId: '0012',
    quantitativeScores: [3, 4, 4, 4, 4, 3, 4, 2, 4, 4, 3, 4],
    qualitativeComment:
      '구성은 잘 되어 있으나 핵심 메시지를 조금 더 강조하면 좋겠습니다.',
  },
];

export enum AnswerValue {
  StronglyDisagree = 1,
  Disagree = 2,
  Neutral = 3,
  Agree = 4,
  StronglyAgree = 5,
}

export const ANSWER_TEXT: Record<AnswerValue, string> = {
  1: '전혀 그렇지 않다',
  2: '그렇지 않다',
  3: '보통이다',
  4: '그렇다',
  5: '매우 그렇다',
};
