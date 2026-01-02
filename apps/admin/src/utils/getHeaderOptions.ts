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
    /^\/[^/]+\/data\/[^/]+$/.test(pathname) ||
    /^\/[^/]+\/evaluation\/[^/]+\/[^/]+(\/[^/]+)?$/.test(pathname) ||
    /^\/[^/]+\/expert\/profile/.test(pathname) ||
    /^\/[^/]+\/expert\/[^/]+\/[^/]+\/[^/]+(\/[^/]+)?$/.test(pathname)
  ) {
    return { showSearch: true, isInput: true };
  }

  // 기본
  return { showSearch: false, isInput: false };
}
export default getHeaderOptions;
