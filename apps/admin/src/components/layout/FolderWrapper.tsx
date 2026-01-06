interface FolderWrapperProps {
  children: React.ReactNode;
}
const FolderWrapper = ({ children }: FolderWrapperProps) => {
  return (
    <div className="font-pretendard mx-50 text-blue mt-14 min-h-screen">
      {children}
    </div>
  );
};
export default FolderWrapper;
