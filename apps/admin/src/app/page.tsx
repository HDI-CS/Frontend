import Header from '../components/layout/Header';

export default function Home() {
  return (
    <div className="font-pretendard text-blue text-blue grid min-h-screen">
      <Header name="관리자페이지" isInput={false} />
    </div>
  );
}
