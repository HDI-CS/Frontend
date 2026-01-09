import Folder from '@/src/components/Folder';
import { AdminEvaluationPhase, AdminYear } from '../constants/adminSection';
import { IdMappingFolder } from '../constants/expert';
import { GetFieldMenuItems } from '../hooks/useFolderManager';
import { EvaluationYearFolder } from '../types/evaluation';

interface BaseFolderItem {
  key: string;
  label: string;
  route: string;
  createdAt?: string;
  lastModifiedAt?: string;
}

interface FolderListProps<T extends BaseFolderItem> {
  isPhase: boolean;
  items: T[];
  pressedKey: string | null;
  openMenuKey: string | null;
  isManage?: boolean;
  onSelect: (item: T) => void;
  onToggleMenu: (key: string) => void;
  onCloseMenu: () => void;
  getFieldMenuItems: GetFieldMenuItems;
}

// interface FolderListProps {
//   isPhase: boolean;
//   items: EvaluationYearFolder[];
//   pressedKey: string | null;
//   openMenuKey: string | null;
//   isManage?: boolean;
//   onSelect: (item: EvaluationYearFolder) => void;
//   onToggleMenu: (key: string) => void;
//   onCloseMenu: () => void;
//   getFieldMenuItems: GetFieldMenuItems;
// }

const FolderList = <T extends BaseFolderItem>({
  isPhase = false,
  items,
  pressedKey,
  openMenuKey,
  isManage = true,
  onSelect,
  onToggleMenu,
  onCloseMenu,
  getFieldMenuItems,
}: FolderListProps<T>) => {
  const isPhaseItem = (
    item:
      | AdminYear
      | AdminEvaluationPhase
      | IdMappingFolder
      | EvaluationYearFolder
      | BaseFolderItem
  ): item is AdminEvaluationPhase | IdMappingFolder => {
    return 'startDate' in item && 'endDate' in item;
  };

  return (
    <>
      {items.map((item) => (
        <Folder
          key={item.key}
          name={item.label ?? ''}
          modified={item.lastModifiedAt}
          created={item.createdAt}
          startDate={isPhaseItem(item) ? item.startDate : ''}
          endDate={isPhaseItem(item) ? item.endDate : ''}
          isActive={pressedKey === item.key}
          isManage={isManage}
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
