import type { Metadata } from 'next';
import './globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import '../../public/style/style.css';
import React from 'react';
import Layout from '../components/layout/layout';
import localFont from 'next/font/local';
import { Sidebar, Header } from '@/components';
import { SnackbarProvider } from 'notistack';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
})

export const metadata: Metadata = {
  title: 'GRB | 도커를 쉽게',
  description: 'Generated by create next app',
};

export default function RootLayout({ children, }: Readonly<{
  children: React.ReactNode; }>) {

  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
          <Header />
          <Layout>{children}</Layout>
      </body>
    </html>
  );
}