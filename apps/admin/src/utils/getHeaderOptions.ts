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
  if (
    /^\/index\/data\/[^/]+$/.test(pathname) ||
    /^\/index\/evaluation\/[^/]+\/[^/]+(\/[^/]+)?$/.test(pathname) ||
    /^\/index\/expert\/profile/.test(pathname) ||
    /^\/index\/expert\/[^/]+\/[^/]+\/[^/]+(\/[^/]+)?$/.test(pathname)
  ) {
    return { showSearch: true, isInput: true };
  }

  // 기본
  return { showSearch: false, isInput: false };
}
export default getHeaderOptions;
