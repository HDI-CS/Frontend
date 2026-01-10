'use client';
import AddBtn from '@/src/components/common/AddBtn';
import AddEvaluation from '@/src/components/evaluation/AddEvaluation';
import EditDuration from '@/src/components/evaluation/EditDuration';
import Folder from '@/src/components/Folder';
import FolderList from '@/src/components/FolderList';
import FolderWrapper from '@/src/components/layout/FolderWrapper';
import ModalComponent from '@/src/components/ModalComponent';
import { mapEvaluationPhaseToFolders } from '@/src/features/data/rowMeta';
import { useCreateEvaluationRound } from '@/src/hooks/evaluation/useCreateEvaluationYear';
import { useEvaluationYears } from '@/src/hooks/evaluation/useEvaluationYears';
import { useUpdatePhaseSurvey } from '@/src/hooks/evaluation/useUpdateSurvey';
import { useFolderManager } from '@/src/hooks/useFolderManager';
import { useSubHeaderStore } from '@/src/store/subHeaderStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const IndexPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const type = pathname.startsWith('/industry') ? 'INDUSTRY' : 'VISUAL';
  const segments = pathname.split('/').filter(Boolean);
  const year = segments[2];

  const {
    pressedKey,
    openMenuKey,
    add,
    editName,
    editSurvey,
    editFolderName,
    createdRoundId,

    setPressedKey,
    setOpenMenuKey,
    setAdd,
    setEditName,
    setEditSurvey,
    setEditFolderName,
    setCreatedRoundId,
    getFieldEvaluationRangeMenuItems,
  } = useFolderManager();

  const { data, isLoading: yearDataLoading } = useEvaluationYears(type);
  const rounds =
    data?.result.find((y) => y.yearId === Number(year))?.rounds ?? [];

  const roundsFolders = rounds
    ? mapEvaluationPhaseToFolders(
        year ?? '1',
        rounds,
        `/${type.toLowerCase()}/evaluation`
      )
    : [];
  // 차수 폴더 생성
  const { mutate: createRoundEvaluation } = useCreateEvaluationRound(
    type,
    Number(year)
  );
  const handleAddRoundEvaluation = () => {
    createRoundEvaluation();
  };

  //차수  폴더 이름 수정
  const { mutate: updateName } = useUpdatePhaseSurvey(type);

  const handleEditName = () => {
    const body = {
      folderName: editFolderName,
      assessmentRoundId: createdRoundId ?? 0,
    };
    updateName(body, {
      onSuccess: () => {
        setEditName(false);
        setEditFolderName('');
        setCreatedRoundId(null);
      },
    });
  };

  // 차수 폴더 기간 수정을 위한 변수
  const currentRound = rounds.find((round) => round.roundId === createdRoundId);

  const { setExtraLabel } = useSubHeaderStore();
  useEffect(() => {
    const folderName = data?.result.find(
      (d) => d.yearId === Number(year)
    )?.folderName;
    setExtraLabel(folderName);
    return () => setExtraLabel('');
  }, [data, setExtraLabel, year]);

  // 로딩 중 스켈레톤
  if (yearDataLoading) {
    const skeletonFactors = Array(7).fill(null);

    return (
      <FolderWrapper>
        <div className="flex flex-col gap-5">
          <div className="flex text-[#4676FB]">
            <p className="ml-21 w-70">Folder</p>
            <span className="ml-25 w-25">Last Modified</span>
            <span className="ml-21 w-25">Created</span>
            <span className="ml-33 w-25">Duration</span>
          </div>
          {/* Folder List */}
          {skeletonFactors.map((_, index) => (
            <Folder key={index} name={''} isSkeleton isPhase={false} />
          ))}
          {/* ADD BTN */}
          <AddBtn isEvaluation={false} setAdd={setAdd} />
        </div>
      </FolderWrapper>
    );
  }

  return (
    <FolderWrapper>
      <div className="flex flex-col gap-5">
        <div className="flex text-[#4676FB]">
          <p className="ml-21 w-70">Folder</p>
          <span className="ml-25 w-25">Last Modified</span>
          <span className="ml-21 w-25">Created</span>
          <span className="ml-33 w-25">Duration</span>
        </div>
        {/* Folder List */}
        <FolderList
          items={roundsFolders}
          isPhase={true}
          pressedKey={pressedKey}
          openMenuKey={openMenuKey}
          onSelect={(item) => {
            setPressedKey(item.key);
            router.push(item.route);
          }}
          onToggleMenu={(key) =>
            setOpenMenuKey((prev) => (prev === key ? null : key))
          }
          onCloseMenu={() => setOpenMenuKey(null)}
          getFieldMenuItems={getFieldEvaluationRangeMenuItems}
        />
        {/* ADD BTN */}
        <AddBtn
          isEvaluation={true}
          setAdd={setAdd}
          onClick={handleAddRoundEvaluation}
        />

        {/* Modals */}
        {add && <AddEvaluation type={type} onClose={() => setAdd(false)} />}
        {editName && (
          <ModalComponent
            title="폴더 이름"
            button="저장"
            editBasicInfo={true}
            onClose={() => setEditName(false)}
            onSubmit={handleEditName}
          >
            <input
              value={editFolderName ?? ''}
              onChange={(e) => setEditFolderName(e.target.value)}
              className="border-1 focus:outline-primary-blue w-full rounded border-[#E9E9E7] p-3 text-lg text-[#3A3A49]"
            />
          </ModalComponent>
        )}
        {editSurvey && (
          <EditDuration
            name={editFolderName}
            type={type}
            createdRoundId={createdRoundId!}
            startDate={currentRound?.startDate ?? ''}
            endDate={currentRound?.endDate ?? ''}
            onClose={() => setEditSurvey(false)}
          />
        )}
      </div>
    </FolderWrapper>
  );
};
export default IndexPage;
