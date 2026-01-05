'use client';
import AddBtn from '@/src/components/common/AddBtn';
import AddEvaluation from '@/src/components/evaluation/AddEvaluation';
import FolderList from '@/src/components/FolderList';
import FolderModals from '@/src/components/FolderModals';
import { mapEvaluationYearsToFoldersForDataPage } from '@/src/features/data/rowMeta';
import { useDataYears } from '@/src/hooks/data/useDataYears';
import { useCreateEvaluationYear } from '@/src/hooks/evaluation/useCreateEvaluationYear';
import { useUpdateSurvey } from '@/src/hooks/evaluation/useUpdateSurvey';
import { useFolderManager } from '@/src/hooks/useFolderManager';
import { EvaluationYearFolder } from '@/src/types/evaluation';
import { usePathname, useRouter } from 'next/navigation';

const IndexPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const type = pathname.startsWith('/industry') ? 'INDUSTRY' : 'VISUAL';

  const {
    pressedKey,
    openMenuKey,
    add,
    editName,
    editSurvey,
    editFolderName,
    createdYearId,
    setPressedKey,
    setOpenMenuKey,
    setAdd,
    setEditName,
    setEditSurvey,
    setEditFolderName,
    setCreatedYearId,
    getFieldMenuItems,
  } = useFolderManager();

  // 년도 조회 api

  // const { data } = useEvaluationYears(type);
  const { data: yearData } = useDataYears(type);

  // 년도 폴더 이름 수정
  const { mutateAsync: createFolder } = useCreateEvaluationYear(type);
  const { mutateAsync: updateFolderName } = useUpdateSurvey(type);

  const handleSubmit = async () => {
    try {
      // 1 폴더 생성
      const createRes = await createFolder();
      const newYearId = createRes.result.yearId;

      // 2 생성 직후 → 바로 이름 수정
      await updateFolderName({
        yearId: newYearId,
        folderName: editFolderName,
      });

      // 3 UI 정리
      setAdd(false);
      setEditFolderName('');
    } catch (e) {
      console.error('폴더 생성 실패', e);
    }
  };

  const yearFolders = yearData?.result
    ? mapEvaluationYearsToFoldersForDataPage(
        yearData?.result,
        `/${type.toLowerCase()}/data`
      )
    : [];

  // 년도 폴더 이름 수정
  const { mutate: updateName } = useUpdateSurvey(type);

  const hanleEditName = () => {
    const body = {
      folderName: editFolderName,
      yearId: createdYearId ?? 0,
    };
    updateName(body, {
      onSuccess: () => {
        setEditName(false);
        setEditFolderName('');
        setCreatedYearId(null);
      },
    });
  };

  // const yearFolders = useMemo(() => {
  //   console.log(data?.result,'dsads');
  //   if (!data?.result) return [];
  //   return mapEvaluationYearsToFolders(data.result, '/data');
  // }, [data]);

  {
    /* data가 아직 없을 때 mapper가 먼저 실행되지 않게 하고, data가 들어오면 그때 자동으로 다시 계산되게*/
  }

  return (
    <div className="font-pretendard text-blue text-blue pl-47 mt-14 grid min-h-screen pr-80">
      <div className="flex flex-col gap-5">
        <div className="flex text-[#4676FB]">
          <p className="ml-21 w-25">Folder</p>
          <span className="ml-25 w-25">Last Modified</span>
          <span className="ml-31 w-25">Created</span>
        </div>
        {/* Folder List */}
        <FolderList<EvaluationYearFolder>
          items={yearFolders}
          isPhase={false}
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
          onEdit={hanleEditName}
        />

        {editSurvey && (
          <AddEvaluation
            type={type}
            onClose={() => setEditSurvey(false)}
            isEdit={true}
          />
        )}
      </div>
    </div>
  );
};
export default IndexPage;
