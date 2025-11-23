// ========== 공지사항 관리 페이지 ==========
// 역할: 관리자만
// 기능: 공지사항 작성/수정/삭제

'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bell, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import {
  getNoticeList,
  deleteNotice,
  updateNoticeStatus,
  type NoticeItem,
} from '@/lib/api/admin'

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<NoticeItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  // ========== 공지사항 목록 로드 ==========
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true)
        const data = await getNoticeList()
        setNotices(data)
      } catch (error) {
        console.error('공지사항 목록 로드 실패:', error)
        alert('공지사항 목록을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotices()
  }, [])

  // ========== 상태 토글 처리 (VISIBLE ↔ REJECTED) ==========
  const handleToggleStatus = async (noticeId: number, currentStatus: "VISIBLE" | "REJECTED") => {
    try {
      const newStatus = currentStatus === "VISIBLE" ? "REJECTED" : "VISIBLE"
      await updateNoticeStatus(noticeId, newStatus)
      
      // 목록 새로고침
      const data = await getNoticeList()
      setNotices(data)
    } catch (error) {
      console.error('공지사항 상태 변경 실패:', error)
      alert(error instanceof Error ? error.message : '공지사항 상태 변경에 실패했습니다.')
    }
  }

  // ========== 삭제 처리 ==========
  const handleDelete = async (noticeId: number) => {
    if (!confirm('공지사항을 삭제하시겠습니까?')) return

    try {
      setIsDeleting(true)
      await deleteNotice(noticeId)
      alert('공지사항이 삭제되었습니다')
      // 목록 새로고침
      const data = await getNoticeList()
      setNotices(data)
    } catch (error) {
      console.error('공지사항 삭제 실패:', error)
      alert(error instanceof Error ? error.message : '공지사항 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Header />
      
      <main className="bg-background min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========== 페이지 헤더 ========== */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">공지사항 관리</h1>
              <p className="text-muted-foreground">플랫폼 공지사항을 관리하세요</p>
            </div>
            <Link href="/admin/notices/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                새 공지 작성
              </Button>
            </Link>
          </div>

          {/* ========== 검색 바 ========== */}
          <div className="mb-6">
            <Input
              placeholder="공지사항 제목 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* ========== 공지사항 목록 (테이블) ========== */}
          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">로딩 중...</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-medium text-sm">번호</th>
                        <th className="text-left p-4 font-medium text-sm">제목</th>
                        <th className="text-left p-4 font-medium text-sm">작성일</th>
                        <th className="text-left p-4 font-medium text-sm">조회수</th>
                        <th className="text-left p-4 font-medium text-sm">상태</th>
                        <th className="text-right p-4 font-medium text-sm">액션</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNotices.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-muted-foreground">
                            공지사항이 없습니다
                          </td>
                        </tr>
                      ) : (
                        filteredNotices.map((notice, index) => (
                          <tr
                            key={notice.noticeId}
                            className="border-b border-border hover:bg-muted/50"
                          >
                            <td className="p-4 text-sm">{notices.length - index}</td>
                            <td className="p-4">
                              <Link
                                href={`/notices/${notice.noticeId}`}
                                className="hover:underline"
                              >
                                {notice.title}
                              </Link>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {formatDate(notice.regDate)}
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {notice.viewCount}
                            </td>
                            <td className="p-4 text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  notice.status === 'VISIBLE'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {notice.status === 'VISIBLE' ? '공개' : '비공개'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleStatus(notice.noticeId, notice.status)}
                                  title={notice.status === "VISIBLE" ? "비공개로 변경" : "공개로 변경"}
                                >
                                  {notice.status === "VISIBLE" ? (
                                    <Eye className="h-4 w-4" />
                                  ) : (
                                    <EyeOff className="h-4 w-4" />
                                  )}
                                </Button>
                                <Link href={`/admin/notices/${notice.noticeId}/edit`}>
                                  <Button variant="ghost" size="sm" title="수정">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(notice.noticeId)}
                                  disabled={isDeleting}
                                  title="삭제"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ========== 검색 결과 없음 ========== */}
          {!isLoading && filteredNotices.length === 0 && notices.length > 0 && (
            <Card className="mt-4">
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">검색 결과가 없습니다</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
