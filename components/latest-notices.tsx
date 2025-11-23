// ========== 최신 공지사항 섹션 컴포넌트 ==========
// 최신 공지 3개 표시

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Eye } from 'lucide-react'
import { getPublicNotices, type NoticeResponseDto } from '@/lib/api/notice'

// ========== 공지사항 데이터 타입 ==========
interface NoticeItem {
  id: number
  title: string
  date: string
  views: number
}

export default function LatestNotices() {
  const [notices, setNotices] = useState<NoticeItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // ========== 공지사항 데이터 로드 ==========
  useEffect(() => {
    const loadNotices = async () => {
      try {
        setIsLoading(true)
        const publicNotices = await getPublicNotices()

        // VISIBLE 상태인 공지사항만 필터링하고 최신순 정렬
        const visibleNotices = publicNotices
          .filter((notice) => notice.status === 'VISIBLE')
          .sort((a, b) => {
            // regDate 기준 내림차순 (최신순)
            return new Date(b.regDate).getTime() - new Date(a.regDate).getTime()
          })
          .slice(0, 3) // 최신 3개만
          .map((notice) => ({
            id: notice.noticeId,
            title: notice.title,
            date: notice.regDate.split('T')[0], // YYYY-MM-DD 형식으로 변환
            views: notice.viewCount || 0,
          }))

        setNotices(visibleNotices)
      } catch (error) {
        console.error('공지사항 로드 실패:', error)
        setNotices([])
      } finally {
        setIsLoading(false)
      }
    }

    loadNotices()
  }, [])

  // ========== 로딩 중 ==========
  if (isLoading) {
    return (
      <section className="py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">공지사항</h2>
              <p className="text-muted-foreground">최신 소식을 확인하세요</p>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-border p-4 bg-muted animate-pulse"
              >
                <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted-foreground/20 rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // ========== 공지사항이 없을 때 ==========
  if (notices.length === 0) {
    return null
  }

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
