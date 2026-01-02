import { useState } from 'react';
import { FieldActionMenuItem } from '../components/FieldActionMenu';
import { ExpertProfile, IdMappingType } from '../constants/expert';
import { ExpertResponse } from '../constants/surveyQuestions';
import { UserType } from '../schemas/auth';
import { VisualDataItem } from '../types/data/visual-data';
import { useDeleteDataset } from './data/useDeleteDataset';
import { useDuplicateDataset } from './data/useDuplicateDataset';

export const useFolderManager = (type: UserType) => {
  // dataId. : 선택 ID
  const [dataId, setDataId] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);

  // thead -> Id / tbody -> field 이벤트 완전히 분리
  // 헤더(ID 정렬용)
  const [idMenu, setIdMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // 행(Field 액션용)
  const [rowMenu, setRowMenu] = useState<{
    x: number;
    y: number;
    rowId: number;
  } | null>(null);

  const [rowExpertMenu, setRowExpertMenu] = useState<{
    x: number;
    y: number;
    row: ExpertResponse; // 하나의 평가자의 응답 데이터
  } | null>(null);

  const [rowQuestiontMenu, setRowQuestiontMenu] = useState<{
    x: number;
    y: number;
    // questions: Question[]; // 설문 문항
  } | null>(null);

  const [selectedExpertData, setSelectedExpertData] =
    useState<ExpertProfile | null>();

  // const [questions, setQuestions] = useState<Question[]>();

  const [orderBy, setOrderBy] = useState<'first' | 'last'>('first');

  // UI : 클릭된 row 하이라이트
  const [activeRowId, setActiveRowId] = useState<number | null>(null);

  // modal용 state
  const [selectedRow, setSelectedRow] = useState<ExpertResponse | null>(null);
  const [selectedExpertRow, setSelectedExpertRow] =
    useState<IdMappingType | null>(null);
  const [selectedDataRow, setSelectedDataRow] = useState<VisualDataItem | null>(
    null
  );

  // 왜씀?
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  // Edit <Boolean>
  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  // showQuestion : 설문 문항 보여주는 상태  <Boolean>
  const [showQuestion, setShowQuestion] = useState(false);

  // useMutation
  const { mutate: deleteDataset } = useDeleteDataset({ type });
  const { mutate: duplicateDataset } = useDuplicateDataset({ type });

  // row별 동작 정의
  const getFieldMenuItems = (rowId: number): FieldActionMenuItem[] => [
    {
      key: 'edit',
      label: 'edit field',
      onClick: () => {
        setIsEdit(true);
        setDataId(rowId); // code인지 id인지는 봐야됨
      },
    },
    {
      key: 'duplicate',
      label: 'duplicate field',
      onClick: () => {
        duplicateDataset([rowId]);
      },
    },
    {
      key: 'delete',
      label: 'delete field',
      variant: 'danger',
      onClick: () => {
        // 서버에 먼저 요청 → 성공 시 데이터를 새롭게 받음
        deleteDataset([rowId]);
      },
    },
  ];

  // row별 동작 정의
  const getFieldExpertMenuItems = (
    row: ExpertResponse
  ): FieldActionMenuItem[] => [
    {
      key: 'edit',
      label: 'edit field',
      onClick: () => {
        setIsEdit(true);
        setDataId(row.id); // code인지 id인지는 봐야됨
        setSelectedRow(row); // 하나의 평가자의 응답 데이터 저장
      },
    },
    {
      key: 'duplicate',
      label: 'duplicate field',
      onClick: () => {
        console.log('duplicate field', row);
      },
    },
    {
      key: 'delete',
      label: 'delete field',
      variant: 'danger',
      onClick: () => {
        // 서버에 먼저 요청 → 성공 시 데이터를 새롭게 받음
      },
    },
  ];

  return {
    // state
    dataId,
    idMenu,
    rowMenu,
    rowExpertMenu,
    rowQuestiontMenu,
    activeRowId,
    isEdit,
    isAdd,
    orderBy,
    selectedRow,
    showQuestion,
    selectedExpertRow,
    selectedDataRow,
    selectedRowId,
    selectedIndex,
    selectedExpertData,

    // setters
    setDataId,
    setIdMenu,
    setRowMenu,
    setRowExpertMenu,
    setRowQuestiontMenu,
    setActiveRowId,
    setIsEdit,
    setIsAdd,
    setOrderBy,
    setSelectedRow,
    setShowQuestion,
    setSelectedExpertRow,
    setSelectedDataRow,
    setSelectedRowId,
    setSelectedIndex,
    setSelectedExpertData,

    // actions
    getFieldMenuItems,
    getFieldExpertMenuItems,
  };
};
export default useFolderManager;
