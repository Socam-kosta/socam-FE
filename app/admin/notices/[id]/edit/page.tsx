// ========== 공지사항 수정 페이지 ==========
// 역할: 관리자만
// 기능: 기존 공지사항 수정

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, X } from 'lucide-react'
import Link from 'next/link'
import { getNoticeDetail, updateNotice } from '@/lib/api/admin'

export default function EditNoticePage() {
  const router = useRouter()
  const params = useParams()
  const noticeId = Number(params.id)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  // ========== 공지사항 상세 정보 로드 ==========
  useEffect(() => {
    const fetchNoticeDetail = async () => {
      if (!noticeId || isNaN(noticeId)) {
        alert('유효하지 않은 공지사항 ID입니다.')
        router.push('/admin/notices')
        return
      }

      try {
        setIsFetching(true)
        const data = await getNoticeDetail(noticeId)
        setTitle(data.title)
        setContent(data.contents)
      } catch (error) {
        console.error('공지사항 상세 조회 실패:', error)
        alert(error instanceof Error ? error.message : '공지사항 정보를 불러오는데 실패했습니다.')
        router.push('/admin/notices')
      } finally {
        setIsFetching(false)
      }
    }

    fetchNoticeDetail()
  }, [noticeId, router])

  // ========== 공지사항 수정 처리 ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요')
      return
    }

    try {
      setIsLoading(true)
      await updateNotice(noticeId, {
        title,
        contents: content,
      })
      alert('공지사항이 수정되었습니다')
      router.push('/admin/notices')
    } catch (error) {
      console.error('공지사항 수정 실패:', error)
      alert(error instanceof Error ? error.message : '공지사항 수정에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <>
        <Header />
        <main className="bg-background min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">로딩 중...</p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      
      <main className="bg-background min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========== 페이지 헤더 ========== */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">공지사항 수정</h1>
            <p className="text-muted-foreground">공지사항 내용을 수정하세요</p>
          </div>

          {/* ========== 수정 폼 ========== */}
          <form onSubmit={handleSubmit}>
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* ========== 제목 입력 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    placeholder="공지사항 제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {title.length}/100
                  </p>
                </div>

                {/* ========== 내용 입력 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="content">내용 *</Label>
                  <Textarea
                    id="content"
                    placeholder="공지사항 내용을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={15}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {content.length}자
                  </p>
                </div>

                {/* ========== 액션 버튼 ========== */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? '수정 중...' : '수정하기'}
                  </Button>
                  <Link href="/admin/notices" className="flex-1">
                    <Button type="button" variant="outline" className="w-full" disabled={isLoading}>
                      <X className="h-4 w-4 mr-2" />
                      취소
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>

      <Footer />
    </>
  )
}

