import ModalComponent from '@/src/components/ModalComponent';

interface FolderModalsProps {
  add: boolean;
  editName: boolean;
  editFolderName: string;
  setEditFolderName: (name: string) => void;
  onCloseAdd: () => void;
  onCloseEdit: () => void;
  onSubmit: () => void;
}

const FolderModals = ({
  add,
  editName,
  editFolderName,
  setEditFolderName,
  onCloseAdd,
  onCloseEdit,
  onSubmit,
}: FolderModalsProps) => {
  return (
    <>
      {add && (
        <ModalComponent
          editBasicInfo={true}
          title="폴더 이름"
          button="생성"
          onClose={onCloseAdd}
          onSubmit={onSubmit}
        >
          <input
            value={editFolderName ?? ''}
            onChange={(e) => setEditFolderName(e.target.value)}
            className="border-1 w-full rounded border-[#E9E9E7] p-3 text-[#3A3A49]"
          />
        </ModalComponent>
      )}

      {editName && (
        <ModalComponent
          title="폴더 이름"
          button="저장"
          editBasicInfo={true}
          onClose={onCloseEdit}
          onSubmit={onSubmit}
        >
          <input
            value={editFolderName ?? ''}
            onChange={(e) => setEditFolderName(e.target.value)}
            className="border-1 w-full rounded border-[#E9E9E7] p-3 text-lg text-[#3A3A49]"
          />
        </ModalComponent>
      )}
    </>
  );
};

export default FolderModals;
