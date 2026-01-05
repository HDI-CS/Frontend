import useGridManager from '@/src/hooks/useGridManager';
import { MemberSurveyResult } from '@/src/schemas/evaluation';
import { truncateText } from '@/src/utils/truncateText';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import IdSortMenu from '../data/table/IdSortMenu';
import Td from '../data/table/Td';
import Th from '../data/table/Th';
import BaseGridTable from './BaseGridTable';
import ResultModal from './ResultMoal';
import ShowQuestionModal from './ShowQuestionModal';

interface OneExpertGridTableProps {
  expertData: MemberSurveyResult;
}

const OneExpertGridTable = ({ expertData }: OneExpertGridTableProps) => {
  const pathname = usePathname();
  const type = pathname.startsWith('/industry') ? 'INDUSTRY' : 'VISUAL';
  const {
    dataId,
    idMenu,
    rowQuestiontMenu,
    activeRowId,
    orderBy,
    selectedRow,
    showQuestion,
    selectedIndex,

    setDataId,
    setIdMenu,
    setRowExpertMenu,
    setRowQuestiontMenu,
    setActiveRowId,
    setIsEdit,
    setOrderBy,
    setSelectedRow,
    setShowQuestion,
    setSelectedIndex,
  } = useGridManager(type!);

  // 화살표 disabled 관리
  const responses = expertData.surveyDatas;
  const lastIndex = expertData.surveyDatas.length - 1;

  // 현재 index 계산
  const currentIndex = responses.findIndex(
    (r) => r.dataId === selectedRow?.dataId
  );

  // 이전
  const handlePrev = () => {
    if (currentIndex <= 0) return;
    const prevRow = responses[currentIndex - 1];
    if (!prevRow) return;

    setSelectedRow(prevRow);
    setActiveRowId(prevRow.dataId);
    setDataId(prevRow.dataId);
  };

  // 다음
  const handleNext = () => {
    if (currentIndex >= responses.length - 1) return;
    const nextRow = responses[currentIndex + 1];
    if (!nextRow) return;

    setSelectedRow(nextRow);
    setActiveRowId(nextRow.dataId);
    setDataId(nextRow.dataId);
  };

  /* ---------- coloumnCount ---------- */

  const MIN_COL_COUNT = 8;

  const questionData = responses[0]?.surveys ?? [];
  const columnCount = Math.max(MIN_COL_COUNT, questionData.length);

  /* ---------- coloumn Array for thead ---------- */
  const headerColumns = Array.from({ length: columnCount }).map((_, index) => {
    return questionData[index] ?? null;
  });

  /* ---------- 설문 문항 원문 모달로 넘길 데이터 ---------- */

  // 1. NUMBER 질문들
  const numberQuestions = questionData.filter((q) => q.surveyType === 'NUMBER');

  // 2. TEXT 질문 (정성평가, 1개)
  const subjectQuestion =
    questionData.find((q) => q.surveyType === 'TEXT') ?? null;

  return (
    <div>
      <BaseGridTable>
        <thead className="text-neutral-gray bg-white">
          <tr
            onMouseEnter={(e) => {
              e.preventDefault();
              setRowQuestiontMenu({
                x: e.clientX,
                y: e.clientY,
              });
            }}
            onMouseLeave={() => {
              setRowQuestiontMenu(null);
            }}
            onClick={(e) => {
              e.preventDefault();
              setShowQuestion(true);
            }}
            className="hover:bg-system-blueBg cursor-pointer"
          >
            <Th className="text-regular16 w-[63px] text-center">번호</Th>
            <Th className="text-regular16 w-[108px] text-start">평가자명</Th>
            <Th
              onContextMenu={(e) => {
                e.preventDefault();
                setIdMenu({
                  x: e.clientX,
                  y: e.clientY,
                });
              }}
              className="text-regular16 w-[106px] text-start hover:opacity-80"
            >
              설문 ID
            </Th>

            {/*  평가 헤더  생성 */}
            {/* 질문은 다 동일할 것으로 가정하여 0번의 질문만 */}
            {/* Q :: SAMPLE TYPE의 질문은 어떻게 처리할지 */}

            {headerColumns.map((question, index) =>
              question ? (
                question.surveyType === 'TEXT' ? (
                  <Th
                    key={`text-${index}`}
                    className="text-regular16 w-[148px] text-start"
                  >
                    정성평가
                  </Th>
                ) : (
                  <Th
                    key={`q-${index}`}
                    className="text-regular16 w-[148px] text-start"
                  >
                    {index + 1}. {truncateText(question.surveyContent, 6)}
                  </Th>
                )
              ) : (
                /* ---------- Dummy coloumn ---------- */
                <Th
                  key={`empty-${index}`}
                  className="text-regular16 w-[148px] text-start"
                >
                  &nbsp;
                </Th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {expertData.surveyDatas.map((row, index) => {
            // const qualitativeCount = getQualitativeCount(
            //   row.qualitativeEvaluation
            // );

            return (
              <tr
                key={row.dataId}
                onClick={() => setActiveRowId(row.dataId)}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  setSelectedRow(row);
                  setActiveRowId(row.dataId);
                  setDataId(row.dataId);
                  setSelectedIndex(String(index + 1));
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setRowExpertMenu({
                    x: e.clientX,
                    y: e.clientY,
                    row,
                  });
                  setActiveRowId(row.dataId);
                }}
                className={clsx(
                  'h-25 text-neutral-regularBlack hover:bg-[#F4F7FF]',
                  activeRowId === row.dataId
                    ? 'bg-[#F4F7FF]'
                    : 'bg-neutral-white'
                )}
              >
                {/* check Box */}
                {/* <Td className="text-regular16 h-25 group flex cursor-pointer justify-center py-1 text-center"> */}
                {/* 기본 이미지 */}
                {/* <Image
                    src={nocheck}
                    alt="check"
                    width={10}
                    className="block group-hover:hidden"
                  /> */}
                {/* hover 이미지 */}
                {/* <Image
                    src={check}
                    alt="check-hover"
                    width={20}
                    className="hidden scale-105 group-hover:block"
                  />{' '} */}
                {/* </Td> */}
                {/* <Td className="text-regular16 py-1 text-center">
                  <Image src={icon} alt="icon" />
                </Td> */}
                <Td className="text-regular16 text-neutral-regularBlack px-4 py-1 text-center">
                  {index + 1}
                </Td>

                <Td className="text-regular16 text-neutral-regularBlack px-4 py-1">
                  {expertData.memberName}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {row.dataCode}
                </Td>

                {/* 정성평가 데이터 */}
                {Array.from({ length: columnCount }).map((_, colIndex) => {
                  const survey = row.surveys[colIndex];

                  return (
                    <Td key={colIndex} className="w-[125px]">
                      {survey ? (
                        <div className="text-neutral-regularBlack text-regular16 bg-system-blueBg flex h-7 items-center justify-center rounded px-4 py-1">
                          {survey.answerContent ?? ''}
                        </div>
                      ) : (
                        <></>
                      )}
                    </Td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </BaseGridTable>

      {/* ID sort dropdown 오픈 */}
      {idMenu && (
        <IdSortMenu
          x={idMenu.x}
          y={idMenu.y}
          onClose={() => setIdMenu(null)}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
        />
      )}

      {/* 행 dropdown 오픈 */}
      {/* {rowExpertMenu && (
        <FieldActionMenu
          x={rowExpertMenu.x}
          y={rowExpertMenu.y}
          items={getFieldExpertMenuItems(rowExpertMenu.row)}
          onClose={() => {
            setRowExpertMenu(null);
            setActiveRowId(null);
          }}
          position="fixed"
        />
      )} */}

      {/* 설문결과 Modal 오픈 */}
      {dataId && (
        <ResultModal
          selectedIndex={selectedIndex}
          row={selectedRow}
          expertName={expertData.memberName}
          currentIndex={currentIndex}
          totalLength={responses.length}
          qusetionsData={questionData}
          lastIndex={lastIndex}
          onClose={() => {
            setDataId(null);
            setIsEdit(false);
          }}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

      {/* 설문문항 원문 Modal 오픈 */}
      {showQuestion && (
        <ShowQuestionModal
          type={type!}
          subjectData={subjectQuestion!}
          qusetionsData={numberQuestions}
          setShowQuestion={setShowQuestion}
        />
      )}

      {/*  HOVER시 설문문항 원문 보기 Modal 오픈 */}
      {rowQuestiontMenu && (
        <div
          className="border-system-lineGray fixed z-50 max-w-xs rounded-md border bg-white p-3 text-[14px] text-sm shadow-lg"
          style={{
            left: rowQuestiontMenu.x + 8,
            top: rowQuestiontMenu.y + 8,
          }}
        >
          설문 문항 원문 보기
        </div>
      )}
    </div>
  );
};
export default OneExpertGridTable;

/////////
// 기준 컬럼 개수 = Math.max(8, 실제 질문 개수)

// 실제 질문 개수보다 부족하면

// undefined용 더미 컬럼을 추가

// thead, tbody에서 같은 컬럼 배열을 기준으로 렌더링
////////
