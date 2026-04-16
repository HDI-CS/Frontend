export type QuestionType =
  | 'AESTHETIC'
  | 'FORM'
  | 'CREATIVITY'
  | 'USABILITY'
  | 'FUNCTIONALITY'
  | 'ETHICS'
  | 'ECONOMY'
  | 'PURPOSE'
  | 'OVERALL';

export const PREFIX_TO_TYPE = {
  // industry
  PR_AES: 'AESTHETIC',
  PR_FRM: 'FORM',
  PR_ORI: 'CREATIVITY',
  PR_USB: 'USABILITY',
  PR_FNC: 'FUNCTIONALITY',
  PR_ETH: 'ETHICS',
  PR_ECN: 'ECONOMY',
  PR_PRP: 'PURPOSE',
  PR_OVE: 'OVERALL',

  // visual
  VI_AES: 'AESTHETIC',
  VI_FRM: 'FORM',
  VI_CRE: 'CREATIVITY',
  VI_USB: 'USABILITY',
  VI_FNC: 'FUNCTIONALITY',
  VI_ETH: 'ETHICS',
  VI_ECN: 'ECONOMY',
  VI_PRP: 'PURPOSE',
  VI_OVE: 'OVERALL',
} as const;

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
