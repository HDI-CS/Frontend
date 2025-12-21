interface HeaderOptions {
  showSearch?: boolean;
  isInput?: boolean;
}

function getHeaderOptions(pathname: string): HeaderOptions {
  // 인증
  if (pathname.startsWith('/auth')) {
    return { showSearch: false };
  }

  // /data/year1, /data/year2 ...
  if (/^\/data\/[^/]+$/.test(pathname)) {
    return { showSearch: true, isInput: true };
  }

  // /index 하위
  if (pathname.startsWith('/index')) {
    return { showSearch: false };
  }

  // 기본
  return { showSearch: false };
}
export default getHeaderOptions;
