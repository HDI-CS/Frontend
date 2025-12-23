import allCheck from '@/public/evaluation/allCheckBox.svg';
import check from '@/public/evaluation/checkbox.svg';
import nocheck from '@/public/evaluation/nocheckBox.svg';
import icon from '@/public/evaluation/sizeImg.svg';
import {
  ANSWER_TEXT,
  AnswerValue,
  DUMMY_EXPERT_RESPONSES,
  SUBJECT_QUESTION,
  SURVEY_QUESTIONS,
} from '@/src/constants/surveyQuestions';
import useGridManager from '@/src/hooks/useGridManager';
import { truncateText } from '@/src/utils/s';
import clsx from 'clsx';
import Image from 'next/image';
import IdSortMenu from '../data/table/IdSortMenu';
import Td from '../data/table/Td';
import Th from '../data/table/Th';
import FieldActionMenu from '../FieldActionMenu';
import BaseGridTable from './BaseGridTable';
import ResultModal from './ResultMoal';
import ShowQuestionModal from './ShowQuestionModal';

const OneExpertGridTable = () => {
  const {
    dataId,
    idMenu,
    rowExpertMenu,
    rowQuestiontMenu,
    activeRowId,
    isEdit,
    orderBy,
    selectedRow,
    showQuestion,

    setDataId,
    setIdMenu,
    setRowExpertMenu,
    setRowQuestiontMenu,
    setActiveRowId,
    setIsEdit,
    setOrderBy,
    setSelectedRow,
    setShowQuestion,

    getFieldExpertMenuItems,
  } = useGridManager();

  // 화살표 disabled 관리
  const responses = DUMMY_EXPERT_RESPONSES;
  const lastIndex = DUMMY_EXPERT_RESPONSES.length - 1;

  // 현재 index 계산
  const currentIndex = responses.findIndex((r) => r.id === selectedRow?.id);

  // 이전
  const handlePrev = () => {
    if (currentIndex <= 0) return;
    const prevRow = responses[currentIndex - 1];
    if (!prevRow) return;

    setSelectedRow(prevRow);
    setActiveRowId(prevRow.id);
    setDataId(prevRow.id);
  };

  // 다음
  const handleNext = () => {
    if (currentIndex >= responses.length - 1) return;
    const nextRow = responses[currentIndex + 1];
    if (!nextRow) return;

    setSelectedRow(nextRow);
    setActiveRowId(nextRow.id);
    setDataId(nextRow.id);
  };

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
            <Th className="text-regular16 group w-[40px] cursor-pointer text-start">
              <Image
                src={allCheck}
                alt="AllCheck"
                className="block scale-105 group-hover:hidden"
              />
              {/* hover 이미지 */}
              <Image
                src={check}
                alt="check-hover"
                width={20}
                className="hidden scale-105 group-hover:block"
              />
            </Th>
            <Th className="text-regular16 w-[40px] text-start">
              <Image src={icon} alt="icon" />
            </Th>
            <Th className="text-regular16 w-[63px] text-start">번호</Th>
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
            {SURVEY_QUESTIONS.map((question, index) => (
              <Th key={index} className="text-regular16 w-[148px] text-start">
                {index + 1}. {truncateText(question.text, 6)}
              </Th>
            ))}
          </tr>
        </thead>

        <tbody>
          {DUMMY_EXPERT_RESPONSES.map((row, index) => {
            // const qualitativeCount = getQualitativeCount(
            //   row.qualitativeEvaluation
            // );

            return (
              <tr
                key={row.id}
                onClick={() => setActiveRowId(row.id)}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  setSelectedRow(row);
                  setActiveRowId(row.id);
                  setDataId(row.id);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setRowExpertMenu({
                    x: e.clientX,
                    y: e.clientY,
                    row,
                  });
                  setActiveRowId(row.id);
                }}
                className={clsx(
                  'h-25 text-neutral-regularBlack hover:bg-[#F4F7FF]',
                  activeRowId === row.id ? 'bg-[#F4F7FF]' : 'bg-neutral-white'
                )}
              >
                {/* check Box */}
                <Td className="text-regular16 h-25 group flex cursor-pointer justify-center py-1 text-center">
                  {/* 기본 이미지 */}
                  <Image
                    src={nocheck}
                    alt="check"
                    width={10}
                    className="block group-hover:hidden"
                  />
                  {/* hover 이미지 */}
                  <Image
                    src={check}
                    alt="check-hover"
                    width={20}
                    className="hidden scale-105 group-hover:block"
                  />{' '}
                </Td>
                <Td className="text-regular16 py-1 text-center">
                  <Image src={icon} alt="icon" />
                </Td>
                <Td className="text-regular16 text-neutral-regularBlack px-4 py-1 text-center">
                  {index + 1}
                </Td>

                <Td className="text-regular16 text-neutral-regularBlack px-4 py-1">
                  {row.evaluatorName}
                </Td>
                <Td className="text-neutral-regularBlack text-regular16 px-4 py-1 text-start">
                  {row.surveyId}
                </Td>

                {/* 정성평가 데이터 */}
                {row.quantitativeScores.map((score, index) => {
                  return (
                    <Td key={index} className="w-[125px]">
                      <div className="text-neutral-regularBlack text-regular16 bg-system-blueBg flex items-center justify-center rounded px-4 py-1">
                        {truncateText(
                          `${score}. ${ANSWER_TEXT[score as AnswerValue]}`,
                          7
                        )}
                      </div>
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
      {rowExpertMenu && (
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
      )}

      {/* 설문결과 Modal 오픈 */}
      {dataId && (
        <ResultModal
          dataId={dataId}
          row={selectedRow}
          currentIndex={currentIndex}
          totalLength={responses.length}
          qusetionsData={SURVEY_QUESTIONS}
          isEdit={isEdit}
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
          subjectData={SUBJECT_QUESTION}
          qusetionsData={SURVEY_QUESTIONS}
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
