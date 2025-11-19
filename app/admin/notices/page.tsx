// ========== 공지사항 관리 페이지 ==========
// 역할: 관리자만
// 기능: 공지사항 작성/수정/삭제

'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bell, Plus, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// ========== 임시 공지사항 데이터 ==========
const notices = [
  {
    id: 1,
    title: '2월 강의 신청 시작 안내',
    views: 234,
    date: '2025-02-10',
  },
  {
    id: 2,
    title: '시스템 점검 공지',
    views: 456,
    date: '2025-02-01',
  },
  {
    id: 3,
    title: '신규 강의 오픈 안내',
    views: 123,
    date: '2025-01-25',
  },
]

export default function AdminNoticesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleDelete = (noticeId: number) => {
    if (confirm('공지사항을 삭제하시겠습니까?')) {
      console.log('[v0] Notice deleted:', noticeId)
      alert('공지사항이 삭제되었습니다')
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
                      <th className="text-right p-4 font-medium text-sm">액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNotices.map((notice, index) => (
                      <tr key={notice.id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-4 text-sm">{notices.length - index}</td>
                        <td className="p-4">
                          <Link href={`/notices/${notice.id}`} className="hover:underline">
                            {notice.title}
                          </Link>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{notice.date}</td>
                        <td className="p-4 text-sm text-muted-foreground">{notice.views}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/notices/${notice.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/notices/${notice.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(notice.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ========== 검색 결과 없음 ========== */}
          {filteredNotices.length === 0 && (
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
