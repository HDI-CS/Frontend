// export function highlightText(
//   text: string,
//   keyword: string,
//   highlightClass = 'text-green-600 font-semibold'
// ) {
//   if (!keyword) return text;
//   if (!text) return text;

//   const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//   const regex = new RegExp(`(${escaped})`, 'gi');

//   const parts = text.split(regex);

//   return parts.map((part, idx) =>
//     regex.test(part) ? (
//       <span key={idx} className={highlightClass}>
//         {part}
//       </span>
//     ) : (
//       <span key={idx}>{part}</span>
//     )
//   );
// }


export function highlightText(
  text: string,
  keyword: string,
  options?: {
    active?: boolean; // ⭐ activeIndex row 여부
  }
): React.ReactNode {
  if (!keyword || !text) return text;

  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  const highlightClass = options?.active
    ? 'text-blue-600 font-semibold' // 🔵 activeIndex
    : 'text-green-600 font-semibold'; // 🟢 일반 검색

  return (
    <>
      {parts.map((part, idx) =>
        idx % 2 === 1 ? (
          <span key={idx} className={highlightClass}>
            {part}
          </span>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </>
  );
}
