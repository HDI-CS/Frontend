import { useState } from 'react';
import { FieldActionMenuItem } from '../components/FieldActionMenu';
import { ExpertResponse } from '../constants/surveyQuestions';
import { VisualDataItem } from '../types/data/visual-data';

export const useFolderManager = () => {
  // dataId. : 선택 ID
  const [dataId, setDataId] = useState<number | null>(null);

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
    row: VisualDataItem;
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

  // const [questions, setQuestions] = useState<Question[]>();

  const [orderBy, setOrderBy] = useState<'first' | 'last'>('first');

  // UI : 클릭된 row 하이라이트
  const [activeRowId, setActiveRowId] = useState<number | null>(null);

  // modal용 state
  const [selectedRow, setSelectedRow] = useState<ExpertResponse | null>(null);

  // Edit <Boolean>
  const [isEdit, setIsEdit] = useState(false);

  // showQuestion : 설문 문항 보여주는 상태  <Boolean>
  const [showQuestion, setShowQuestion] = useState(false);

  // row별 동작 정의
  // const getFieldMenuItems = (row: VisualDataItem): FieldActionMenuItem[] => [
  //   {
  //     key: 'edit',
  //     label: 'edit field',
  //     onClick: () => {
  //       setIsEdit(true);
  //       setDataId(row.id); // code인지 id인지는 봐야됨
  //     },
  //   },
  //   {
  //     key: 'duplicate',
  //     label: 'duplicate field',
  //     onClick: () => {
  //       console.log('duplicate field', row);
  //     },
  //   },
  //   {
  //     key: 'delete',
  //     label: 'delete field',
  //     variant: 'danger',
  //     onClick: () => {
  //       // 서버에 먼저 요청 → 성공 시 데이터를 새롭게 받음
  //     },
  //   },
  // ];

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
        setSelectedRow(row);
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
    orderBy,
    selectedRow,
    showQuestion,

    // setters
    setDataId,
    setIdMenu,
    setRowMenu,
    setRowExpertMenu,
    setRowQuestiontMenu,
    setActiveRowId,
    setIsEdit,
    setOrderBy,
    setSelectedRow,
    setShowQuestion,

    // actions
    getFieldExpertMenuItems,
  };
};
export default useFolderManager;
