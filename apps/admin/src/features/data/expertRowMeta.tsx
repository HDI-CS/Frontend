import { ExpertProfile } from '@/src/constants/expert';
import { CreateExpertMember, UpdateExpertMember } from '@/src/schemas/expert';

// 수정 가능한 필드 (PATCH 대상)
export type EditableFieldMeta<T> = {
  label: string;
  field: keyof T;
  editable: true;
};

// 표시 전용 필드 (PATCH x)
export type ReadonlyFieldMeta = {
  label: string;
  field: 'email' | 'password' | 'participation';
  editable: false;
};

export type ExpertlFieldMeta =
  | EditableFieldMeta<UpdateExpertMember>
  | ReadonlyFieldMeta;

export type CreateFieldMeta = {
  label: string;
  field: keyof CreateExpertMember;
};

export const EXPERT_EDIT_FIELDS: readonly ExpertlFieldMeta[] = [
  // 수정 가능 (UpdateExpertMember 기준)
  { label: '평가자명', field: 'name', editable: true },

  //  표시 전용 (개인정보 / 서버 계산값 -> 이메일, 비밀번호, 차수 )
  { label: '참여 차수', field: 'participation', editable: false },
  { label: '전문가 이메일', field: 'email', editable: false },
  { label: '연락처', field: 'phoneNumber', editable: true },
  { label: '비밀번호', field: 'password', editable: false },
  { label: '성별', field: 'gender', editable: true },
  { label: '나이', field: 'age', editable: true },
  { label: '경력', field: 'career', editable: true },
  { label: '학계/실무계', field: 'academic', editable: true },
  { label: '전문 분야', field: 'expertise', editable: true },
  { label: '회사', field: 'company', editable: true },
] as const;

// 신규 등록용 필드
export const EXPERT_CREATE_FIELDS: readonly CreateFieldMeta[] = [
  { label: '평가자명', field: 'name' },
  { label: '전문가 이메일', field: 'email' },
  { label: '비밀번호', field: 'password' },

  { label: '연락처', field: 'phoneNumber' },
  { label: '성별', field: 'gender' },
  { label: '나이', field: 'age' },
  { label: '경력', field: 'career' },
  { label: '학계/실무계', field: 'academic' },
  { label: '전문 분야', field: 'expertise' },
  { label: '회사', field: 'company' },
];
// input 창에 값 꺼내기 위한 함수
export const getReadonlyValue = (
  field: ExpertlFieldMeta['field'],
  row: ExpertProfile
) => {
  switch (field) {
    case 'email':
      return row.email;
    case 'password':
      return row.password; // 또는 '********'
    case 'participation':
      return row.participation;

    case 'phoneNumber':
      return row.phone;
    case 'career':
      return row.experience;
    case 'academic':
      return row.background;
    case 'expertise':
      return row.field;

    case 'company':
      return row.company;
    case 'gender':
      return row.gender;
    case 'age':
      return row.ageGroup;
    case 'name':
      return row.name;

    default:
      return '-';
  }
};
