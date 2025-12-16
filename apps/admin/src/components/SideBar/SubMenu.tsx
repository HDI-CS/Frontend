import MenuItem from './MenuItem';
import SubMenuItem from './SubMenuItem';

const SubMenu = () => {
  return (
    <div className="mt-1 flex flex-col gap-1 pl-4">
      <MenuItem label="데이터 관리">
        <SubMenuItem label="1차년도" />
      </MenuItem>
      <SubMenuItem label="평가 관리" />
      <SubMenuItem label="전문가 관리" />
    </div>
  );
};

export default SubMenu;
