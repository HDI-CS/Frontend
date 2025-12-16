import '@hdi/ui/styles.css';

import type { Metadata } from 'next';
import localFont from 'next/font/local';

import LayoutWrapper from '../components/layout/LayoutWrapper';
import './globals.css';

const pretendard = localFont({
  src: [
    {
      path: './fonts/PretendardVariable.ttf',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HDI LAB Admin',
  description: 'HDI LAB Admin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable}`}>
        <LayoutWrapper>
          <main>{children}</main>
        </LayoutWrapper>
      </body>
    </html>
  );
}
