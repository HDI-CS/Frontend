import { IndustryCategory } from '@/src/schemas/industry-data';
import { VisualCategory } from '@/src/schemas/visual-data';
import { downloadExcel, downloadImageZip } from '@/src/services/data/common';
import { useState } from 'react';

/** 브라우저에 blob을 파일로 저장하는 공통 로직 */
const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

interface UseDatasetDownloadParams {
  type: 'VISUAL' | 'INDUSTRY';
  yearId: number;
  activeCategory: VisualCategory | IndustryCategory | null;
}

/**
 * 데이터 페이지의 두 가지 다운로드 기능(엑셀 전체 다운로드, 선택 이미지 zip 다운로드)을 관리하는 훅.
 * 관련 상태(isDownload)와 핸들러를 한 군데로 모아 컴포넌트 본문을 단순화함.
 */
export const useDatasetDownload = ({
  type,
  yearId,
  activeCategory,
}: UseDatasetDownloadParams) => {
  const [isDownload, setIsDownload] = useState(false);

  // 현재 카테고리의 데이터 전체를 엑셀로 다운로드
  const handleDownload = async () => {
    const res = await downloadExcel({
      type,
      yearId,
      category: activeCategory ?? undefined,
    });

    const blob = new Blob([res.data], {
      type: res.headers['content-type'],
    });

    // 서버가 내려준 filename을 우선 사용, 없으면 기본값
    const disposition = res.headers['content-disposition'];
    const filenameMatch = disposition?.match(/filename\*=UTF-8''(.+)/);
    const filename = filenameMatch
      ? decodeURIComponent(filenameMatch[1])
      : `${type.toLowerCase()}_data.xlsx`;

    downloadBlob(blob, filename);
  };

  // 체크된 row들의 이미지를 zip으로 묶어 다운로드
  const handleImageDownload = async (rowIds: number[], onDone: () => void) => {
    if (!rowIds.length) return;

    try {
      setIsDownload(true);
      const blob = await downloadImageZip(type, { ids: rowIds });
      downloadBlob(blob, 'images.zip');
    } catch (e) {
      console.error('이미지 zip 다운로드 실패:', e);
      alert('다운로드 실패! (서버 응답 지연)');
    } finally {
      setIsDownload(false);
      onDone();
    }
  };

  return { isDownload, handleDownload, handleImageDownload };
};
