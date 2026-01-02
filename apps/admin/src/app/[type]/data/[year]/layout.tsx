// import EmergencyContact from '@/components/ui/EmergencyContact';

interface InboxLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    type: string;
  }>;
}

export default async function InboxLayout({
  children,
}: InboxLayoutProps) {
  // params를 await하여 값을 가져옴

  return <main className="">{children}</main>;
}
