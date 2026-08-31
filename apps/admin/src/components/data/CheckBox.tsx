import allCheck from '@/public/evaluation/allCheckBox.svg';
import check from '@/public/evaluation/checkbox.svg';
import noCheck from '@/public/evaluation/nocheckBox.svg';

import Image from 'next/image';
interface CheckBoxProps {
  onClick: () => void;
  isAll?: boolean;
  isCheck?: boolean;
}

const CheckBox = ({ isCheck, isAll, onClick }: CheckBoxProps) => {
  const imgSrc = isAll ? allCheck : isCheck ? check : noCheck;
  return (
    <div onClick={onClick} className="flex items-center justify-center">
      <Image
        src={imgSrc}
        alt="nocheck"
        className="cursor-pointer hover:opacity-55"
      />
    </div>
  );
};
export default CheckBox;
