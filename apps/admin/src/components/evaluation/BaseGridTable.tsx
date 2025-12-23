interface BaseGridTableProps {
  children: React.ReactNode;
}

const BaseGridTable = ({ children }: BaseGridTableProps) => (
  <div className="border border-[#E5E5E5] bg-white p-2">
    {/* 너비 넘어갈 시 가로 스크롤 */}
    <div className="w-full overflow-x-auto">
      <table className="min-w-max border-separate border-spacing-0 whitespace-nowrap">
        {children}
      </table>
    </div>
  </div>
);
export default BaseGridTable;
