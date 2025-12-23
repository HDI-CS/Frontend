import Folder from '@/src/components/Folder';
import { AdminEvaluationPhase, AdminYear } from '../constants/adminSection';
import { GetFieldMenuItems } from '../hooks/useFolderManager';

interface FolderListProps {
  isPhase: boolean;
  items: AdminYear[] | AdminEvaluationPhase[];
  pressedKey: string | null;
  openMenuKey: string | null;
  onSelect: (item: AdminYear) => void;
  onToggleMenu: (key: string) => void;
  onCloseMenu: () => void;
  getFieldMenuItems: GetFieldMenuItems;
}

const FolderList = ({
  isPhase = false,
  items,
  pressedKey,
  openMenuKey,
  onSelect,
  onToggleMenu,
  onCloseMenu,
  getFieldMenuItems,
}: FolderListProps) => {
  const isPhaseItem = (
    item: AdminYear | AdminEvaluationPhase
  ): item is AdminEvaluationPhase => {
    return 'duration' in item;
  };

  return (
    <>
      {items.map((item) => (
        <Folder
          key={item.key}
          name={item.label}
          modified={item.lastModifiedAt}
          created={item.createdAt}
          duration={isPhaseItem(item) ? item.duration : ''}
          isActive={pressedKey === item.key}
          isManage
          isPhase={isPhase}
          isMenuOpen={openMenuKey === item.key}
          onToggleMenu={() => onToggleMenu(item.key)}
          onCloseMenu={onCloseMenu}
          onClick={() => onSelect(item)}
          getFieldMenuItems={() =>
            getFieldMenuItems({ key: item.key, label: item.label })
          }
        />
      ))}
    </>
  );
};

export default FolderList;
