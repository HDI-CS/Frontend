'use client';
import { usePathname, useRouter } from 'next/navigation';
import MenuItem from './MenuItem';
import SubMenuItem from './SubMenuItem';

const ROUTES = {
  ROOT: '/index',
  DATA: '/index/data',
  DATA_YEAR1: '/data/year1',
  DATA_YEAR2: '/data/year2',
  EVALUATION: '/evaluation',
  EXPERT: '/expert',
};

const ROUTE_GROUPS = {
  ROOT: ['/index', '/data', '/evaluation', '/expert'],
  DATA: ['/index/data', '/data/year1', '/data/year2'],
};

const SidebarMenu = () => {
  const pathname = usePathname();
  const router = useRouter();

  const openRoot = ROUTE_GROUPS.ROOT.some((r) => pathname.startsWith(r));

  const openData = ROUTE_GROUPS.DATA.some((r) => pathname.startsWith(r));

  return (
    <div className="flex flex-col">
      {/* 시각디자인 */}
      <MenuItem
        label="시각디자인"
        open={openRoot}
        active={pathname === ROUTES.ROOT}
        onClick={() => router.push(ROUTES.ROOT)}
      >
        {/* 데이터 관리 */}
        <MenuItem
          label="데이터 관리"
          open={openData}
          active={pathname === ROUTES.DATA}
          onClick={() => router.push(ROUTES.DATA)}
        >
          <SubMenuItem
            label="1차년도"
            active={pathname === ROUTES.DATA_YEAR1}
            onClick={() => router.push(ROUTES.DATA_YEAR1)}
          />
          <SubMenuItem
            label="2차년도"
            active={pathname === ROUTES.DATA_YEAR2}
            onClick={() => router.push(ROUTES.DATA_YEAR2)}
          />
        </MenuItem>

        <MenuItem
          label="평가 관리"
          active={pathname === ROUTES.EVALUATION}
          onClick={() => router.push(ROUTES.EVALUATION)}
        />

        <MenuItem
          label="전문가 관리"
          active={pathname === ROUTES.EXPERT}
          onClick={() => router.push(ROUTES.EXPERT)}
        />
      </MenuItem>
    </div>
  );
};

export default SidebarMenu;
