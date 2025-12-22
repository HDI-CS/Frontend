'use client';
import { usePathname, useRouter } from 'next/navigation';
import MenuItem from './MenuItem';
import SubMenuItem from './SubMenuItem';

// 재사용성 가능하게 수정
const ROUTES = {
  ROOT: '/index',

  DATA: {
    ROOT: '/index/data',
    YEAR1: '/index/data/year1',
    YEAR2: '/index/data/year2',
  },

  EVALUATION: {
    ROOT: '/index/evaluation',
    YEAR1: '/index/evaluation/year1',
    YEAR1_PHASE1: '/index/evaluation/year1/phase1',
    YEAR1_PHASE2: '/index/evaluation/year1/phase2',
    YEAR2: '/index/evaluation/year2',
  },

  EXPERT: '/index/expert',
};

const ROUTE_GROUPS = {
  ROOT: [ROUTES.ROOT, ROUTES.DATA.ROOT, ROUTES.EVALUATION.ROOT, ROUTES.EXPERT],

  DATA: Object.values(ROUTES.DATA),

  EVALUATION: Object.values(ROUTES.EVALUATION),

  EVALUATION_YEAR1: [
    ROUTES.EVALUATION.YEAR1,
    ROUTES.EVALUATION.YEAR1_PHASE1,
    ROUTES.EVALUATION.YEAR1_PHASE2,
  ],

  EVALUATION_YEAR2: [ROUTES.EVALUATION.YEAR2],

  EXPERT: [ROUTES.EXPERT],
};

const SidebarMenu = () => {
  const pathname = usePathname();
  const router = useRouter();

  const openRoot = ROUTE_GROUPS.ROOT.some((r) => pathname.startsWith(r));
  const openData = ROUTE_GROUPS.DATA.some((r) => pathname.startsWith(r));
  const openEvaluation = ROUTE_GROUPS.EVALUATION.some((r) =>
    pathname.startsWith(r)
  );

  const openYear1 = ROUTE_GROUPS.EVALUATION_YEAR1.some((r) =>
    pathname.startsWith(r)
  );

  const openYear2 = ROUTE_GROUPS.EVALUATION_YEAR2.some((r) =>
    pathname.startsWith(r)
  );

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
          active={pathname === ROUTES.DATA.ROOT}
          onClick={() => router.push(ROUTES.DATA.ROOT)}
        >
          <SubMenuItem
            label="1차년도"
            active={pathname === ROUTES.DATA.YEAR1}
            onClick={() => router.push(ROUTES.DATA.YEAR1)}
          />
          <SubMenuItem
            label="2차년도"
            active={pathname === ROUTES.DATA.YEAR2}
            onClick={() => router.push(ROUTES.DATA.YEAR2)}
          />
        </MenuItem>

        <MenuItem
          label="평가 관리"
          open={openEvaluation}
          active={pathname === ROUTES.EVALUATION.ROOT}
          onClick={() => router.push(ROUTES.EVALUATION.ROOT)}
        >
          <MenuItem
            label="1차년도"
            open={openYear1}
            active={pathname === ROUTES.EVALUATION.YEAR1}
            onClick={() => router.push(ROUTES.EVALUATION.YEAR1)}
          >
            <SubMenuItem
              label="1차 평가"
              active={pathname === ROUTES.EVALUATION.YEAR1_PHASE1}
              onClick={() => router.push(ROUTES.EVALUATION.YEAR1_PHASE1)}
            />
            <SubMenuItem
              label="2차 평가"
              active={pathname === ROUTES.EVALUATION.YEAR1_PHASE2}
              onClick={() => router.push(ROUTES.EVALUATION.YEAR1_PHASE2)}
            />
          </MenuItem>
          <MenuItem
            label="2차년도"
            open={openYear2}
            active={pathname === ROUTES.EVALUATION.YEAR2}
            onClick={() => router.push(ROUTES.EVALUATION.YEAR2)}
          />
        </MenuItem>
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
