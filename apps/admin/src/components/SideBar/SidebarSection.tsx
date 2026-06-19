import { UserType } from '@/src/schemas/auth';
import SidebarMenu from './SidebarMenu';

interface SidebarProps {
  type: UserType;
}

const SidebarSection = ({ type }: SidebarProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="px-3 py-1 text-sm font-light text-[#8D8D8D]">
        Dashboard
      </span>

      <SidebarMenu type={type} />
    </div>
  );
};

export default SidebarSection;
