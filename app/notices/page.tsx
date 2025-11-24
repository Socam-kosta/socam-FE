// ========== 공지사항 목록 페이지 ==========
// 역할: 모든 사용자
// 기능: 공지사항 조회

'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, Calendar } from 'lucide-react'
import Link from 'next/link'
import { getPublicNotices, type NoticeResponseDto } from '@/lib/api/notice'

export default function NoticesPage() {
  const [notices, setNotices] = useState<NoticeResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true)
        const data = await getPublicNotices()
        // 최신순 정렬 (regDate 기준)
        const sorted = data.sort((a, b) => {
          const dateA = new Date(a.regDate).getTime()
          const dateB = new Date(b.regDate).getTime()
          return dateB - dateA
        })
        setNotices(sorted)
      } catch (error) {
        console.error('공지사항 로드 실패:', error)
        setNotices([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotices()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0] // YYYY-MM-DD
  }

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

          {/* ========== 로딩 상태 ========== */}
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">공지사항을 불러오는 중...</p>
            </div>
          )}

          {/* ========== 공지사항이 없을 때 ========== */}
          {!isLoading && notices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">등록된 공지사항이 없습니다.</p>
            </div>
          )}

          {/* ========== 공지사항 목록 ========== */}
          {!isLoading && notices.length > 0 && (
            <div className="space-y-4">
              {notices.map((notice) => (
                <Link key={notice.noticeId} href={`/notices/${notice.noticeId}`}>
                  <Card className="hover:border-primary transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                              공지
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{notice.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(notice.regDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{notice.viewCount || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
