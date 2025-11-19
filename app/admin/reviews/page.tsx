// ========== 리뷰 승인 관리 페이지 ==========
// 역할: 관리자만
// 기능: 리뷰 승인/거절/삭제

'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// ========== 임시 리뷰 데이터 ==========
const pendingReviews = [
  {
    id: 1,
    lectureName: 'React 완벽 마스터',
    author: '학생1',
    rating: 5,
    content: '정말 좋은 강의입니다. 실무에 바로 적용할 수 있는 내용들이 많았습니다.',
    date: '2025-02-15',
  },
  {
    id: 2,
    lectureName: 'Python 데이터 분석',
    author: '학생2',
    rating: 4,
    content: '강사님의 설명이 명확하고 이해하기 쉬웠습니다.',
    date: '2025-02-18',
  },
]

export default function AdminReviewsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending')
  const [rejectReason, setRejectReason] = useState('')

  const handleApprove = (reviewId: number) => {
    console.log('[v0] Review approved:', reviewId)
    alert('리뷰가 승인되었습니다')
  }

  const handleReject = (reviewId: number, reason: string) => {
    console.log('[v0] Review rejected:', reviewId, reason)
    alert('리뷰 승인이 거절되었습니다')
    setRejectReason('')
  }

  const handleDelete = (reviewId: number) => {
    if (confirm('리뷰를 삭제하시겠습니까?')) {
      console.log('[v0] Review deleted:', reviewId)
      alert('리뷰가 삭제되었습니다')
    }
  }

  return (
    <>
      <Header />
      
      <main className="bg-background min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========== 페이지 헤더 ========== */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">리뷰 승인 관리</h1>
            <p className="text-muted-foreground">강의 리뷰를 검토하세요</p>
          </div>

          {/* ========== 탭 네비게이션 ========== */}
          <div className="border-b border-border mb-8">
            <div className="flex gap-8">
              <button
                className={`pb-4 font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('pending')}
              >
                미승인
              </button>
              <button
                className={`pb-4 font-medium transition-colors ${
                  activeTab === 'approved'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('approved')}
              >
                승인됨
              </button>
            </div>
          </div>

          {/* ========== 미승인 리뷰 목록 ========== */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{review.lectureName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">작성자: {review.author}</p>
                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{review.content}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(review.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          승인
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <XCircle className="h-4 w-4 mr-1" />
                              거절
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>리뷰 승인 거절</DialogTitle>
                              <DialogDescription>거절 사유를 입력하세요</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Textarea
                                placeholder="거절 사유를 입력하세요"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={4}
                              />
                              <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => handleReject(review.id, rejectReason)}
                              >
                                거절 확인
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(review.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* ========== 승인됨 탭 ========== */}
          {activeTab === 'approved' && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">승인된 리뷰가 없습니다</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
