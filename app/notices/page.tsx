// ========== 공지사항 목록 페이지 ==========
// 역할: 모든 사용자
// 기능: 공지사항 조회

'use client'

import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, Calendar } from 'lucide-react'
import Link from 'next/link'

// ========== 임시 공지사항 데이터 ==========
const notices = [
  {
    id: 1,
    title: '2월 강의 신청 시작 안내',
    date: '2025-02-10',
    views: 234,
    category: '공지',
  },
  {
    id: 2,
    title: '시스템 점검 공지 (2/20)',
    date: '2025-02-08',
    views: 156,
    category: '점검',
  },
  {
    id: 3,
    title: '신규 강의 오픈 안내',
    date: '2025-02-05',
    views: 189,
    category: '공지',
  },
]

export default function NoticesPage() {
  return (
    <>
      <Header />
      
      <main className="bg-background min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========== 페이지 헤더 ========== */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">공지사항</h1>
            <p className="text-muted-foreground">최신 소식을 확인하세요</p>
          </div>

          {/* ========== 공지사항 목록 ========== */}
          <div className="space-y-4">
            {notices.map((notice) => (
              <Link key={notice.id} href={`/notices/${notice.id}`}>
                <Card className="hover:border-primary transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {notice.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{notice.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{notice.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{notice.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
