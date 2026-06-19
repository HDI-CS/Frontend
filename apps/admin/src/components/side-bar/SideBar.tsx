import { UserType } from '@/src/schemas/auth';
import SidebarSection from './SidebarSection';
interface SidebarProps {
  type: UserType;
}

const SideBar = ({ type }: SidebarProps) => {
  return (
    <div className="w-60 min-w-max flex-shrink-0 border-r border-[#E9E9E7] p-4">
      <SidebarSection type={type} />
    </div>
  );
};

export default SideBar;
