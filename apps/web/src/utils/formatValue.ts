export function formatValue(key: string, value: string | null) {
  if (!value) return '-';

  if (key === 'price') {
    return Number(value).toLocaleString() + '원';
  }

  return value;
}
