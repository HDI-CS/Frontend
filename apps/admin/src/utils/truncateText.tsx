export const truncateText = (text: string, maxLength = 6) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
