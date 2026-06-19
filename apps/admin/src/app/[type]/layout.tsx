interface IndexLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    type: string;
  }>;
}

export default async function IndexLayout({ children }: IndexLayoutProps) {
  return <main className="">{children}</main>;
}
