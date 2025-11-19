// ========== 최신 공지사항 섹션 컴포넌트 ==========
// 최신 공지 3개 표시

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Eye } from 'lucide-react'

// ========== 임시 데이터 ==========
const notices = [
  {
    id: 1,
    title: '2월 강의 신청 시작 안내',
    date: '2025-02-10',
    views: 234,
  },
  {
    id: 2,
    title: '시스템 점검 공지 (2/20)',
    date: '2025-02-08',
    views: 156,
  },
  {
    id: 3,
    title: '신규 강의 오픈 안내',
    date: '2025-02-05',
    views: 189,
  },
]

export default function LatestNotices() {
  return (
    <section className="py-16 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== 섹션 제목 ========== */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">공지사항</h2>
            <p className="text-muted-foreground">최신 소식을 확인하세요</p>
          </div>

          {/* ========== 전체보기 버튼 ========== */}
          <Link href="/notices">
            <Button variant="ghost">
              전체보기 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* ========== 공지 목록 ========== */}
        <div className="space-y-4">
          {notices.map((notice) => (
            <Link
              key={notice.id}
              href={`/notices/${notice.id}`}
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:border-primary hover:bg-card"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{notice.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{notice.date}</p>
              </div>

              {/* ========== 조회수 ========== */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{notice.views}</span>
              </div>

              <ArrowRight className="ml-4 h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
