'use client';
import { useEvaluationFolders } from '@/src/hooks/useEvaluationFolders';
import { UserType } from '@/src/schemas/auth';
import { EvaluationYear } from '@/src/schemas/survey';
import { DatasetType } from '@/src/types/common';
import { usePathname, useRouter } from 'next/navigation';
import MenuItem from './MenuItem';
import SubMenuItem from './SubMenuItem';

interface SidebarMenuProps {
  type: UserType;
}

export interface EvaluationRoundFolder {
  roundId: number;
  roundName: string;
}

export interface EvaluationYearFolder {
  yearId: number;
  yearName: string;
  rounds: EvaluationRoundFolder[];
}

export function toDatasetTypeLower(type: string): 'visual' | 'industry' {
  if (type === 'VISUAL') return 'visual';
  return 'industry';
}

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
      `/${type}/evaluation/${year}/${phase}`,
    MEMBER: (type: DatasetType, year: number, phase: number, member: number) =>
      `/${type}/evaluation/${year}/${phase}/${member}`,
  },

  EXPERT: {
    ROOT: (type: DatasetType) => `/${type}/expert`,
    PROFILE: (type: DatasetType) => `/${type}/expert/profile`,
    MAPPING: (type: DatasetType) => `/${type}/expert/id-mapping`,
    MAPPING_YEAR: (type: DatasetType, year: number) =>
      `/${type}/expert/id-mapping/${year}`,
    MAPPING_PHASE: (type: DatasetType, year: number, phase: number) =>
      `/${type}/expert/id-mapping/${year}/${phase}`,
  },
};

const SidebarMenu = ({ type }: SidebarMenuProps) => {
  const pathname = usePathname();
  const typeLable = {
    VISUAL: '시각디자인',
    INDUSTRY: '산업디자인',
  };
  const lowerType = toDatasetTypeLower(type);

  const { data } = useEvaluationFolders(type);
  const yearFolders: EvaluationYearFolder[] =
    data?.result.map((year: EvaluationYear) => ({
      yearId: year.yearId,
      yearName: year.folderName,
      rounds: year.rounds.map((round) => ({
        roundId: round.roundId,
        roundName: round.folderName ?? '',
      })),
    })) ?? [];

  const ROUTE_GROUPS = {
    ROOT: (type: DatasetType) => [
      ROUTES.ROOT(type),
      ROUTES.DATA.ROOT(type),
      ROUTES.EVALUATION.ROOT(type),
      ROUTES.EXPERT.ROOT(type),
    ],

    DATA: (type: DatasetType) =>
      yearFolders.map((y) => ROUTES.DATA.YEAR(type, y.yearId)),

    EVALUATION: (type: DatasetType) =>
      yearFolders.flatMap((y) => [
        ROUTES.EVALUATION.YEAR(type, y.yearId),
        y.rounds.map((p) => ROUTES.EVALUATION.PHASE(type, y.yearId, p.roundId)),
      ]),

    EXPERT: (type: DatasetType) => [
      ROUTES.EXPERT.ROOT(type),
      ROUTES.EXPERT.MAPPING(type),
    ],
  };

  const router = useRouter();
  // const { data: years, isLoading } = useEvaluationFolders();

  const openRoot = ROUTE_GROUPS.ROOT(lowerType).some((r) =>
    pathname.startsWith(r)
  );
  const openData = pathname.startsWith(ROUTES.DATA.ROOT(lowerType));

  const openEvaluation = pathname.startsWith(ROUTES.EVALUATION.ROOT(lowerType));

  const openExpert = ROUTE_GROUPS.EXPERT(lowerType).some((r) =>
    pathname.startsWith(r)
  );

  const openMapping = pathname.startsWith(ROUTES.EXPERT.MAPPING(lowerType));
  // const openMappingYear1 = pathname.startsWith(ROUTES.EXPERT.MAPPING_YEAR1);

  return (
    <div className="flex flex-col">
      {/* 시각디자인 */}
      <MenuItem
        label={typeLable[type]}
        open={openRoot}
        active={pathname === ROUTES.ROOT(lowerType)}
        onClick={() => router.push(ROUTES.ROOT(lowerType))}
      >
        {/* 데이터 관리 */}
        <MenuItem
          label="데이터 관리"
          open={openData}
          active={pathname === ROUTES.DATA.ROOT(lowerType)}
          onClick={() => router.push(ROUTES.DATA.ROOT(lowerType))}
        >
          {yearFolders.map((year) => (
            <SubMenuItem
              key={year.yearId}
              label={year.yearName}
              active={pathname === ROUTES.DATA.YEAR(lowerType, year.yearId)}
              onClick={() =>
                router.push(ROUTES.DATA.YEAR(lowerType, year.yearId))
              }
            />
          ))}
        </MenuItem>

        {/* 평가 관리  */}
        <MenuItem
          label="평가 관리"
          open={openEvaluation}
          active={pathname === ROUTES.EVALUATION.ROOT(lowerType)}
          onClick={() => router.push(ROUTES.EVALUATION.ROOT(lowerType))}
        >
          {yearFolders.map((year: EvaluationYearFolder) => {
            const openYear = pathname.startsWith(
              ROUTES.EVALUATION.YEAR(lowerType, year.yearId ?? 0)
            );

            return (
              <MenuItem
                key={year.yearId}
                label={`${year.yearName ?? ''}`}
                open={openYear}
                active={
                  pathname ===
                  ROUTES.EVALUATION.YEAR(lowerType, year.yearId ?? 0)
                }
                onClick={() =>
                  router.push(
                    ROUTES.EVALUATION.YEAR(lowerType, year.yearId ?? 0)
                  )
                }
              >
                {year.rounds.map((round: EvaluationRoundFolder) => (
                  <SubMenuItem
                    key={round.roundId}
                    label={`${round.roundName}`}
                    active={pathname === 
                      ROUTES.EVALUATION.PHASE(
                        lowerType,
                        year.yearId,
                        round.roundId ?? 0
                      
                    )}
                    onClick={() =>
                      router.push(
                        ROUTES.EVALUATION.PHASE(
                          lowerType,
                          year.yearId,
                          round.roundId ?? 0
                        )
                      )
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
          active={pathname === ROUTES.EXPERT.ROOT(lowerType)}
          onClick={() => router.push(ROUTES.EXPERT.ROOT(lowerType))}
        >
          <SubMenuItem
            label="전문가 인적사항"
            active={pathname === ROUTES.EXPERT.PROFILE(lowerType)}
            onClick={() => router.push(ROUTES.EXPERT.PROFILE(lowerType))}
          />
          {/* 평가 데이터 ID */}
          <MenuItem
            label="평가 데이터 ID"
            open={openMapping}
            active={pathname === ROUTES.EXPERT.MAPPING(lowerType)}
            onClick={() => router.push(ROUTES.EXPERT.MAPPING(lowerType))}
          >
            {/* N차년도 */}
            {yearFolders.map((year: EvaluationYearFolder) => (
              <MenuItem
                key={year.yearId}
                label={`${year.yearName ?? ''}`}
                open={pathname.startsWith(
                  ROUTES.EXPERT.MAPPING_YEAR(lowerType, year.yearId ?? 0)
                )}
                active={
                  pathname ===
                  ROUTES.EXPERT.MAPPING_YEAR(lowerType, year.yearId ?? 0)
                }
                onClick={() =>
                  router.push(
                    ROUTES.EXPERT.MAPPING_YEAR(lowerType, year.yearId ?? 0)
                  )
                }
              >
                {year.rounds.map((round) => (
                  <SubMenuItem
                    key={round.roundId}
                    label={`${round.roundName ?? ''}`}
                    active={
                      pathname ===
                      ROUTES.EXPERT.MAPPING_PHASE(
                        lowerType,
                        year.yearId ?? 0,
                        round.roundId ?? 0
                      )
                    }
                    onClick={() =>
                      router.push(
                        ROUTES.EXPERT.MAPPING_PHASE(
                          lowerType,
                          year.yearId ?? 0,
                          round.roundId ?? 0
                        )
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
