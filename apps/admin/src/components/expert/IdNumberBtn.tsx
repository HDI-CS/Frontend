interface IdNumberBtn {
  item: string;
}
const IdNumberBtn = ({ item }: IdNumberBtn) => {
  return (
    <p className="bg-system-blueBg text-regular10 rounded px-1 py-0.5">
      {item}
    </p>
  );
};
export default IdNumberBtn;
