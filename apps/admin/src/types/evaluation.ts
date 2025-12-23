// GET : 평가 설문 문항 조회
type survey = {
  id: string;
  text: string;
};
export type RequestGetSurveyDto = {
  surveyQuestions: survey[];
};

// /api/v1/{type}/survey/{surveyId}
// export type RequestEditSurveyDto = {};
