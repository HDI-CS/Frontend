'use client';
import { FieldActionMenuItem } from '@/src/components/FieldActionMenu';
import { useEffect, useState } from 'react';

export type GetFieldMenuItems = (item: {
  key: string;
  label: string;
}) => FieldActionMenuItem[];

export const useFolderManager = () => {
  // 선택된 폴더
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  // 열린 드롭다운 (단 하나)
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);

  // 생성 / 수정 모달
  const [add, setAdd] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editSurvey, setEditSurvey] = useState(false);
  const [editFolderName, setEditFolderName] = useState('');

  // 수정 대상
  const [editTarget, setEditTarget] = useState<{
    key: string;
    name: string;
  } | null>(null);


  // 수정 대상 바뀌면 input 값 동기화
  useEffect(() => {
    if (editTarget) {
      setEditFolderName(editTarget.name);
    }
  }, [editTarget]);

  // /index/data 드롭다운 메뉴 정의
  const getFieldMenuItems: GetFieldMenuItems = (item) => [
    {
      key: 'edit file',
      label: 'edit file name',
      onClick: () => {
        setEditTarget({ key: item.key, name: item.label });
        setEditName(true);
        setOpenMenuKey(null);
      },
    },
    {
      key: 'delete',
      label: 'delete file',
      variant: 'danger',
      onClick: () => {},
    },
  ];

  // index/evaluation/year 드롭다운 메뉴 정의
  const getFieldEvaluationMenuItems: GetFieldMenuItems = (item) => [
    {
      key: 'edit file',
      label: 'edit file name',
      onClick: () => {
        setEditTarget({ key: item.key, name: item.label });
        setEditName(true);
        setOpenMenuKey(null);
      },
    },
    {
      key: 'edit survey',
      label: 'edit 평가문항',
      onClick: () => {
        setEditTarget({ key: item.key, name: item.label }); // API 구현 후 수정 필요
        setEditSurvey(true);
        setOpenMenuKey(null);
      },
    },
    {
      key: 'delete',
      label: 'delete file',
      variant: 'danger',
      onClick: () => {
        // delete api
      },
    },
  ];

  return {
    // state
    pressedKey,
    openMenuKey,
    add,
    editName,
    editTarget,
    editFolderName,
    editSurvey,

    // setters
    setPressedKey,
    setOpenMenuKey,
    setAdd,
    setEditName,
    setEditTarget,
    setEditFolderName,
    setEditSurvey,

    // actions
    getFieldMenuItems,
    getFieldEvaluationMenuItems,
  };
};
