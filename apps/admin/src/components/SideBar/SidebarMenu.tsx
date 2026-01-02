'use client';
import { DatasetType } from '@/src/types/common';
import { usePathname, useRouter } from 'next/navigation';
import MenuItem from './MenuItem';
import SubMenuItem from './SubMenuItem';

const YEARS = [1, 2] as const;
type Year = (typeof YEARS)[number];

const PHASES_BY_YEAR: Record<Year, number[]> = {
  1: [1, 2],
  2: [1],
};

// 재사용성 가능하게 수정
const ROUTES = {
  ROOT: (type: DatasetType) => `/${type}`,

  DATA: {
    ROOT: (type: DatasetType) => `/${type}/data`,
    YEAR: (type: DatasetType, year: number) => `/${type}/data/${year}`,
  },

  EVALUATION: {
    ROOT: (type: DatasetType) => `/${type}/evaluation`,
    YEAR: (type: DatasetType, year: number) => `/${type}/evaluation/${year}`,
    PHASE: (type: DatasetType, year: number, phase: number) =>
      `/${type}/evaluation/${year}/phase${phase}`,
  },

  EXPERT: {
    ROOT: (type: DatasetType) => `/${type}/expert`,
    PROFILE: (type: DatasetType) => `/${type}/expert/profile`,
    MAPPING: (type: DatasetType) => `/${type}/expert/id-mapping`,
    MAPPING_YEAR: (type: DatasetType, year: number) =>
      `/${type}/expert/id-mapping/${year}`,
    MAPPING_PHASE: (type: DatasetType, year: number, phase: number) =>
      `/${type}/expert/id-mapping/${year}/phase${phase}`,
  },
};

const ROUTE_GROUPS = {
  ROOT: (type: DatasetType) => [
    ROUTES.ROOT(type),
    ROUTES.DATA.ROOT(type),
    ROUTES.EVALUATION.ROOT(type),
    ROUTES.EXPERT.ROOT(type),
  ],

  DATA: (type: DatasetType) => YEARS.map((y) => ROUTES.DATA.YEAR(type, y)),

  EVALUATION: (type: DatasetType) =>
    YEARS.flatMap((y) => [
      ROUTES.EVALUATION.YEAR(type, y),
      ...PHASES_BY_YEAR[y].map((p) => ROUTES.EVALUATION.PHASE(type, y, p)),
    ]),

  EXPERT: (type: DatasetType) => [
    ROUTES.EXPERT.ROOT(type),
    ROUTES.EXPERT.MAPPING(type),
  ],
};

const SidebarMenu = () => {
  const pathname = usePathname();
  const type: DatasetType = pathname.startsWith('/industry')
    ? 'industry'
    : 'visual';

  const router = useRouter();
  // const { data: years, isLoading } = useEvaluationFolders();

  const openRoot = ROUTE_GROUPS.ROOT(type).some((r) => pathname.startsWith(r));
  const openData = ROUTE_GROUPS.DATA(type).some((r) => pathname.startsWith(r));

  const openEvaluation = ROUTE_GROUPS.EVALUATION(type).some((r) =>
    pathname.startsWith(r)
  );

  const openExpert = ROUTE_GROUPS.EXPERT(type).some((r) =>
    pathname.startsWith(r)
  );

  const openMapping = pathname.startsWith(ROUTES.EXPERT.MAPPING(type));
  // const openMappingYear1 = pathname.startsWith(ROUTES.EXPERT.MAPPING_YEAR1);

  return (
    <div className="flex flex-col">
      {/* 시각디자인 */}
      <MenuItem
        label="시각디자인"
        open={openRoot}
        active={pathname === ROUTES.ROOT(type)}
        onClick={() => router.push(ROUTES.ROOT(type))}
      >
        {/* 데이터 관리 */}
        <MenuItem
          label="데이터 관리"
          open={openData}
          active={pathname === ROUTES.DATA.ROOT(type)}
          onClick={() => router.push(ROUTES.DATA.ROOT(type))}
        >
          <SubMenuItem
            label="1차년도"
            active={pathname === ROUTES.DATA.YEAR(type, 1)}
            onClick={() => router.push(ROUTES.DATA.YEAR(type, 1))}
          />
          <SubMenuItem
            label="2차년도"
            active={pathname === ROUTES.DATA.YEAR(type, 2)}
            onClick={() => router.push(ROUTES.DATA.YEAR(type, 2))}
          />
        </MenuItem>

        {/* 평가 관리  */}
        <MenuItem
          label="평가 관리"
          open={openEvaluation}
          active={pathname === ROUTES.EVALUATION.ROOT(type)}
          onClick={() => router.push(ROUTES.EVALUATION.ROOT(type))}
        >
          {YEARS.map((year) => {
            const openYear = pathname.startsWith(
              ROUTES.EVALUATION.YEAR(type, year)
            );

            return (
              <MenuItem
                key={year}
                label={`${year}차년도`}
                open={openYear}
                active={pathname === ROUTES.EVALUATION.YEAR(type, year)}
                onClick={() => router.push(ROUTES.EVALUATION.YEAR(type, year))}
              >
                {PHASES_BY_YEAR[year].map((phase) => (
                  <SubMenuItem
                    key={phase}
                    label={`${phase}차 평가`}
                    active={
                      pathname === ROUTES.EVALUATION.PHASE(type, year, phase)
                    }
                    onClick={() =>
                      router.push(ROUTES.EVALUATION.PHASE(type, year, phase))
                    }
                  />
                ))}
              </MenuItem>
            );
          })}
        </MenuItem>

        {/* 전문가 관리  */}
        <MenuItem
          label="전문가 관리"
          open={openExpert}
          active={pathname === ROUTES.EXPERT.ROOT(type)}
          onClick={() => router.push(ROUTES.EXPERT.ROOT(type))}
        >
          <SubMenuItem
            label="전문가 인적사항"
            active={pathname === ROUTES.EXPERT.PROFILE(type)}
            onClick={() => router.push(ROUTES.EXPERT.PROFILE(type))}
          />
          {/* 평가 데이터 ID */}
          <MenuItem
            label="평가 데이터 ID"
            open={openMapping}
            active={pathname === ROUTES.EXPERT.MAPPING(type)}
            onClick={() => router.push(ROUTES.EXPERT.MAPPING(type))}
          >
            {/* N차년도 */}
            {YEARS.map((year) => (
              <MenuItem
                key={year}
                label={`${year}차년도`}
                open={pathname.startsWith(
                  ROUTES.EXPERT.MAPPING_YEAR(type, year)
                )}
                active={pathname === ROUTES.EXPERT.MAPPING_YEAR(type, year)}
                onClick={() =>
                  router.push(ROUTES.EXPERT.MAPPING_YEAR(type, year))
                }
              >
                {PHASES_BY_YEAR[year].map((phase) => (
                  <SubMenuItem
                    key={phase}
                    label={`${phase}차수`}
                    active={
                      pathname ===
                      ROUTES.EXPERT.MAPPING_PHASE(type, year, phase)
                    }
                    onClick={() =>
                      router.push(
                        ROUTES.EXPERT.MAPPING_PHASE(type, year, phase)
                      )
                    }
                  />
                ))}
              </MenuItem>
            ))}
          </MenuItem>
        </MenuItem>
      </MenuItem>
    </div>
  );
};

export default SidebarMenu;
