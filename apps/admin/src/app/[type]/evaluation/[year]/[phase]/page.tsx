'use client';

import AllExpertGridTable from '@/src/components/evaluation/AllExpertGridTable';
import { DUMMY_SURVEY } from '@/src/constants/surveyQuestions';
import { useState } from 'react';

const PhasePage = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  return (
    <div className="bg-system-blueBg p-1.5">
      <AllExpertGridTable
        activeId={activeId}
        setActiveId={setActiveId}
        rows={DUMMY_SURVEY}
      />
    </div>
  );
};
export default PhasePage;
