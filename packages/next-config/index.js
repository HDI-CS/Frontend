/**
 * next.config.ts는 next.js가 직접 로드하는 파일이라 빌드 파이프라인을
 * 거치지 않는다. 그래서 이 패키지는 일부러 빌드 스텝 없이 plain JS로만
 * 작성되어 있다 (tsc dist 빌드가 필요한 다른 @hdi/* 패키지와는 다름).
 *
 * admin/web 두 next.config.ts가 API rewrite destination을 각자
 * 손으로 주석 처리/해제하며 바꾸다가 로컬(localhost) 값이 그대로
 * 커밋되는 사고가 반복됐다. NODE_ENV 기준으로 자동 전환해서 이 문제를
 * 근본적으로 없앤다.
 */
function getApiOrigin() {
  return process.env.NODE_ENV === 'production'
    ? 'https://api.hdi.ai.kr'
    : 'http://localhost:8080';
}

module.exports = { getApiOrigin };
