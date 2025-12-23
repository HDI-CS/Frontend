// GET : 평가 설문 문항 조회
type survey = {
  id: string;
  text: string;
};

export type SurveyQualitative = {
  id: number;
  isQualitative: boolean;
};

export type SurveyQustion = {
  id: number;
  name: string;
  progress: number;
  isWeighted: boolean;
  qualitativeEvaluation: SurveyQualitative[];
};

export type RequestGetSurveyDto = {
  surveyQuestions: survey[];
};

// /api/v1/{type}/survey/{surveyId}
// export type RequestEditSurveyDto = {};
