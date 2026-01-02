'use client';
import OneExpertGridTable from '@/src/components/evaluation/OneExpertGridTable';
import ViewEvaluationsBtn from '@/src/components/evaluation/ViewEvaluationsBtn';

const MemberPage = () => {
  return (
    <div className="bg-system-blueBg min-h-screen p-1.5">
      <ViewEvaluationsBtn />
      <OneExpertGridTable />
    </div>
  );
};
export default MemberPage;
