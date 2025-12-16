import { ResearchPartners } from '@/src/components/ui/ResearchPartners';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-8 pb-12 pt-12">
      <div className="flex-1" />
      {children}
      <div className="flex-1" />
      <ResearchPartners />
    </div>
  );
}
