// ========== 공지사항 작성 페이지 ==========
// 역할: 관리자만
// 기능: 새 공지사항 작성

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, X } from 'lucide-react'
import Link from 'next/link'

export default function NewNoticePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // ========== 공지사항 작성 처리 ==========
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요')
      return
    }

    console.log('[v0] Notice created:', { title, content })
    alert('공지사항이 작성되었습니다')
    router.push('/admin/notices')
  }

  return (
    <>
      <Header />
      
      <main className="bg-background min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========== 페이지 헤더 ========== */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">새 공지사항 작성</h1>
            <p className="text-muted-foreground">플랫폼 공지사항을 작성하세요</p>
          </div>

          {/* ========== 작성 폼 ========== */}
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

                {/* ========== 이미지 업로드 (선택) ========== */}
                <div className="space-y-2">
                  <Label htmlFor="images">이미지 첨부 (선택)</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                  />
                  <p className="text-xs text-muted-foreground">
                    최대 5개, 각 10MB 이하
                  </p>
                </div>

                {/* ========== 액션 버튼 ========== */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    작성하기
                  </Button>
                  <Link href="/admin/notices" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
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
