import { IndustrialDataItem } from '@/src/schemas/industry-data';
import { VisualDataItem } from '@/src/schemas/visual-data';
import { sortByString } from '@/src/utils/sortByType';
import { DatasetUIItem } from '../types/data/visual-data';

type SortDirection = 'ASC' | 'DESC';

/**
 * 현재 선택된 정렬 기준(sortType)에 맞춰 두 로우를 비교하는 함수.
 * VISUAL/INDUSTRY 타입에 따라 비교 가능한 필드가 다르므로 분기함.
 */
export const compareDatasetRows = (
  a: DatasetUIItem,
  b: DatasetUIItem,
  type: 'VISUAL' | 'INDUSTRY',
  sortType: string,
  orderBy: SortDirection
): number => {
  if (sortType === 'ID') {
    return sortByString(a.code, b.code, orderBy);
  }

  if (type === 'INDUSTRY') {
    const industryA = a as IndustrialDataItem;
    const industryB = b as IndustrialDataItem;

    switch (sortType) {
      case 'COMPANY':
        return sortByString(
          industryA.companyName,
          industryB.companyName,
          orderBy
        );
      case 'MODEL':
        return sortByString(industryA.modelName, industryB.modelName, orderBy);
      case 'PRODUCT':
        return sortByString(
          industryA.productName,
          industryB.productName,
          orderBy
        );
      default:
        return 0;
    }
  }

  // VISUAL
  const visualA = a as VisualDataItem;
  const visualB = b as VisualDataItem;

  switch (sortType) {
    case 'NAME':
      return sortByString(visualA.name, visualB.name, orderBy);
    case 'SECTOR':
      return sortByString(
        visualA.sectorCategory,
        visualB.sectorCategory,
        orderBy
      );
    case 'MAINPRODUCT':
      return sortByString(visualA.mainProduct, visualB.mainProduct, orderBy);
    case 'MAINCATEGORY':
      return sortByString(
        visualA.mainProductCategory,
        visualB.mainProductCategory,
        orderBy
      );
    default:
      return 0;
  }
};
