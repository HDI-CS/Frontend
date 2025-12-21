import Folder from '@/src/components/Folder';
import { AdminYear } from '../constants/adminSection';
import { GetFieldMenuItems } from '../hooks/useFolderManager';

interface FolderListProps {
  items: AdminYear[];
  pressedKey: string | null;
  openMenuKey: string | null;
  onSelect: (item: AdminYear) => void;
  onToggleMenu: (key: string) => void;
  onCloseMenu: () => void;
  getFieldMenuItems: GetFieldMenuItems;
}

const FolderList = ({
  items,
  pressedKey,
  openMenuKey,
  onSelect,
  onToggleMenu,
  onCloseMenu,
  getFieldMenuItems,
}: FolderListProps) => {
  return (
    <>
      {items.map((item) => (
        <Folder
          key={item.key}
          name={item.label}
          modified={item.lastModifiedAt}
          created={item.createdAt}
          isActive={pressedKey === item.key}
          isManage
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
