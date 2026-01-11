interface BaseGridTableProps {
  children: React.ReactNode;
}

const BaseGridTable = ({ children }: BaseGridTableProps) => (
  <div className="flex h-full flex-col border border-[#E5E5E5] bg-white px-2 pt-2">
    {/* 너비 넘어갈 시 가로 스크롤 */}
    <div className="max-h-[680px] w-full flex-1 overflow-auto">
      <table className="min-w-max border-separate border-spacing-0 whitespace-nowrap">
        {children}
      </table>
    </div>
  </div>
);
export default BaseGridTable;
