import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SOCAM - 한국 교육 플랫폼 | 강의, 부트캠프, 훈련 프로그램',
  description: '정부 지원 교육 플랫폼. 웹개발, 모바일, 데이터AI, 클라우드 등 다양한 강의와 훈련 프로그램을 검색하고 신청하세요.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
