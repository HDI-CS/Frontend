'use client';
import AddBtn from '@/src/components/common/AddBtn';
import Folder from '@/src/components/Folder';
import FolderList from '@/src/components/FolderList';
import FolderModals from '@/src/components/FolderModals';
import FolderWrapper from '@/src/components/layout/FolderWrapper';
import ModalComponent from '@/src/components/ModalComponent';
import { mapEvaluationPhaseToFolders } from '@/src/features/data/rowMeta';
import { useCreateEvaluationRound } from '@/src/hooks/evaluation/useCreateEvaluationYear';
import { useEvaluationYears } from '@/src/hooks/evaluation/useEvaluationYears';
import {
  useUpdatePhaseSurvey,
  useUpdateSurvey,
} from '@/src/hooks/evaluation/useUpdateSurvey';
import { useFolderManager } from '@/src/hooks/useFolderManager';
import { useSubHeaderStore } from '@/src/store/subHeaderStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const IndexPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const type = pathname.startsWith('/industry') ? 'INDUSTRY' : 'VISUAL';
  const segments = pathname.split('/').filter(Boolean);
  const year = segments[3];
  const {
    pressedKey,
    openMenuKey,
    add,
    editName,
    editFolderName,
    createdYearId,

    setPressedKey,
    setOpenMenuKey,
    setAdd,
    setEditName,
    setEditFolderName,
    setCreatedYearId,
    getFieldMenuItems,
  } = useFolderManager();

  const { data, isLoading: yearDataLoading } = useEvaluationYears(type);
  const { mutateAsync: updateFolderName } = useUpdateSurvey(type);

  const hanleEditName = () => {
    const body = {
      folderName: editFolderName,
      yearId: createdYearId ?? 0,
    };
    updateFolderName(body, {
      onSuccess: () => {
        setEditName(false);
        setEditFolderName('');
        setCreatedYearId(null);
      },
    });
  };
  const rounds =
    data?.result.find((y) => y.yearId === Number(year))?.rounds ?? [];

  const roundsFolders = rounds
    ? mapEvaluationPhaseToFolders(
        year ?? '1',
        rounds,
        `/${type.toLowerCase()}/expert/id-mapping`
      )
    : [];

  // 차수 폴더 생성
  const { mutateAsync: createRoundEvaluation } = useCreateEvaluationRound(
    type,
    Number(year)
  );

  //차수  폴더 이름 수정
  const { mutateAsync: updateName } = useUpdatePhaseSurvey(type);

  const handleSubmit = async () => {
    try {
      // 1 폴더 생성
      const createRes = await createRoundEvaluation();
      const newRoundId = createRes.result.roundId;

      // 2 생성 직후 → 바로 이름 수정
      await updateName({
        assessmentRoundId: newRoundId,
        folderName: editFolderName,
      });

      // 3 UI 정리
      setAdd(false);
      setEditFolderName('');
    } catch (e) {
      console.error('폴더 생성 실패', e);
    }
  };
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
            <p className="ml-33 w-25">Duration</p>
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
          <p className="ml-25 w-25">Last Modified</p>
          <p className="ml-21 w-25">Created</p>
          <p className="ml-33 w-25">Duration</p>
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
          getFieldMenuItems={getFieldMenuItems}
        />
        {/* ADD BTN */}
        <AddBtn isEvaluation={false} setAdd={setAdd} />

        {/* Modals */}
        <FolderModals
          add={add}
          editName={editName}
          editFolderName={editFolderName}
          setEditFolderName={setEditFolderName}
          onCloseAdd={() => setAdd(false)}
          onCloseEdit={() => setEditName(false)}
          onSubmit={handleSubmit}
        />

        {editName && (
          <ModalComponent
            title="폴더 이름"
            button="저장"
            editBasicInfo={true}
            onClose={() => setEditName(false)}
            onSubmit={hanleEditName}
          >
            <input
              value={editFolderName}
              onChange={(e) => setEditFolderName(e.target.value)}
              className="border-1 focus:outline-primary-blue w-full rounded border-[#E9E9E7] p-3 text-lg text-[#3A3A49]"
            />
          </ModalComponent>
        )}
      </div>
    </FolderWrapper>
  );
};
export default IndexPage;
