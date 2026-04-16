// 쿠키 관리 유틸리티 함수들

// getCookie는 clearAuthCookies와 clearAllCookies에서 사용됨
export const getCookie = (name: string): string | null => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    const c = ca[i];
    if (c) {
      let trimmedC = c;
      while (trimmedC.charAt(0) === ' ')
        trimmedC = trimmedC.substring(1, trimmedC.length);
      if (trimmedC.indexOf(nameEQ) === 0)
        return trimmedC.substring(nameEQ.length, trimmedC.length);
    }
  }
  return null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// 로그아웃 시 모든 관련 쿠키 삭제
export const clearAuthCookies = () => {
  const authCookies = ['user', 'JSESSIONID', 'session', 'token'];

  authCookies.forEach((cookieName) => {
    deleteCookie(cookieName);
    // 도메인별로도 삭제 (혹시 다른 도메인에 설정된 경우)
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.hdi.ai.kr;`;
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=localhost;`;
  });

  console.log('🍪 인증 관련 모든 쿠키 삭제 완료');
};
