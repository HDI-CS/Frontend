export const VIUSAL_QUESTION_TYPE_RANGES = [
  { start: 1, end: 3, type: 'AESTHETIC' },
  { start: 4, end: 7, type: 'FORM' },
  { start: 8, end: 9, type: 'CREATIVITY' },
  { start: 10, end: 11, type: 'USABILITY' },
  { start: 12, end: 14, type: 'FUNCTIONALITY' },
  { start: 15, end: 17, type: 'ETHICS' },
  { start: 18, end: 19, type: 'ECONOMY' },
  { start: 20, end: 21, type: 'PURPOSE' },
  { start: 22, end: 26, type: 'OVERALL' },
] as const;

export const INDUSTRY_QUESTION_TYPE_RANGES = [
  { start: 1, end: 6, type: 'AESTHETIC' }, // 심미성

  { start: 7, end: 9, type: 'FORM' }, // 조형성

  { start: 10, end: 16, type: 'CREATIVITY' }, // 혁신성 (독창성)

  { start: 17, end: 21, type: 'USABILITY' }, // 사용성

  { start: 22, end: 23, type: 'FUNCTIONALITY' }, // 기능성

  { start: 24, end: 26, type: 'ETHICS' }, // 윤리성

  { start: 27, end: 29, type: 'ECONOMY' }, // 경제성

  { start: 30, end: 32, type: 'PURPOSE' }, // 목적성

  { start: 33, end: 41, type: 'OVERALL' }, // 종합평가
] as const;

export const QUESTION_TYPE_META = {
  visual: {
    AESTHETIC: {
      title: '심미성',
      perspective: {
        highlight: '전문가의 관점',
        suffix: '에서',
      },
      description:
        '포스터가 감각적으로 얼마나 매력적이고 긍정적인 인상을 주는지',
    },
    FORM: {
      title: '조형성',
      perspective: {
        highlight: '전문가의 관점',
        suffix: '에서',
      },
      description:
        '포스터의 시각 요소들이 구조적으로 균형 있고 조화롭게 구성되어 있는지',
    },
    CREATIVITY: {
      title: '독창성',
      perspective: {
        highlight: '전문가의 관점',
        suffix: '에서',
      },
      description:
        '포스터가 얼마나 새롭고 차별화된 시각적 표현을 지니고 있는지',
    },
    USABILITY: {
      title: '사용성',
      perspective: {
        highlight: '전문가의 관점',
        suffix: '에서',
      },
      description:
        '포스터가 다양한 상황과 매체에서 효과적으로 활용 가능해 보이는지',
    },
    FUNCTIONALITY: {
      title: '기능성',
      perspective: {
        highlight: '전문가의 관점',
        suffix: '에서',
      },
      description: '포스터가 정보를 명확하게 전달하고 가독성이 우수한지',
    },
    ETHICS: {
      title: '윤리성',
      perspective: {
        highlight: '전문가의 관점',
        suffix: '에서',
      },
      description:
        '포스터가 사회적·문화적 기준을 준수하고 부적절한 요소를 포함하지 않는지',
    },
    ECONOMY: {
      title: '경제성',
      perspective: {
        highlight: '전문가의 관점',
        suffix: '에서',
      },
      description:
        '포스터가 제작 및 활용 측면에서 비용 효율성을 고려하고 있는지',
    },
    PURPOSE: {
      title: '목적성',
      perspective: {
        highlight: '전문가의 관점',
        suffix: '에서',
      },
      description:
        '포스터가 전달하고자 하는 메시지와 목표에 적합하게 설계되어 있는지',
    },
    OVERALL: {
      title: '종합평가',
      perspective: {
        highlight: '전문가의 관점',
        suffix: '에서',
      },
      description: '포스터의 전반적인 시각적 완성도와 만족도를',
    },
  },

  industry: {
    AESTHETIC: {
      title: '심미성',
      perspective: {
        highlight: '전문가의 안목',
        suffix: '으로',
      },
      description: '제품의 시각적 완성도를 엄격히',
    },
    FORM: {
      title: '조형성',
      perspective: {
        highlight: '전문가의 안목',
        suffix: '으로',
      },
      description: '제품의 조형적 완성도를 엄격히',
    },
    CREATIVITY: {
      title: '혁신성',
      perspective: {
        highlight: '전문가의 안목',
        suffix: '으로',
      },
      description: '제품의 새로운 시도와 창의적 접근이 있었는지',
    },
    USABILITY: {
      title: '사용성',
      perspective: {
        highlight: '사용자의 입장',
        suffix: '에서',
      },
      description: '제품의 편의성과 직관성을',
    },
    FUNCTIONALITY: {
      title: '기능성',
      perspective: {
        highlight: '사용자의 입장',
        suffix: '에서',
      },
      description: '제품의 기능적 적합성을',
    },
    ETHICS: {
      title: '윤리성',
      perspective: {
        highlight: '시장 관점',
        suffix: '에서',
      },
      description: '제품의 공정성을',
    },
    ECONOMY: {
      title: '경제성',
      perspective: {
        highlight: '사용자 입장',
        suffix: '에서',
      },
      description: '제품의 가격 경쟁력을',
    },
    PURPOSE: {
      title: '목적성',
      perspective: {
        highlight: '사용자 입장',
        suffix: '에서',
      },
      description: '제품이 목표 달성에 유용한지를',
    },
    OVERALL: {
      title: '종합평가',
      perspective: {
        highlight: '전문가의 입장',
        suffix: '에서',
      },
      description: '최종적인 디자인의 완성도와 가치를',
    },
  },
} as const;
