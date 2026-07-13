export const withCacheBust = (
  url?: string | null,
  version?: number
): string | null | undefined => {
  if (!url) return url;
  return version ? `${url}?v=${version}` : url;
};