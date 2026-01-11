import clsx from 'clsx';

interface FolderWrapperProps {
  children: React.ReactNode;
  isManage?: boolean;
}
const FolderWrapper = ({ children, isManage = true }: FolderWrapperProps) => {
  return (
    <div
      className={clsx(
        'font-pretendard text-blue mb-10 mt-14 min-h-screen',
        isManage ? 'mx-30' : 'mx-60'
      )}
    >
      {children}
    </div>
  );
};
export default FolderWrapper;
