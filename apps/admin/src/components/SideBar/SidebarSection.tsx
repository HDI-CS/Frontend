import SidebarMenu from './SidebarMenu';

const SidebarSection = () => {
  return (
    <div className="flex flex-col gap-2">
      <span className="px-3 py-1 text-sm font-light text-[#8D8D8D]">
        Dashboard
      </span>

      <SidebarMenu />
    </div>
  );
};

export default SidebarSection;
