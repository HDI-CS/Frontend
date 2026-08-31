export const sortByString = (
  aValue: string | null | undefined,
  bValue: string | null | undefined,
  orderBy: 'ASC' | 'DESC'
) => {
  const a = aValue ?? '';
  const b = bValue ?? '';

  if (!a && b) return 1;
  if (a && !b) return -1;

  return orderBy === 'ASC' ? a.localeCompare(b) : b.localeCompare(a);
};
