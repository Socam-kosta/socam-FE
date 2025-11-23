// ========== 리뷰 승인 관리 페이지 ==========
// 역할: 관리자만
// 기능: 리뷰 승인/거절/삭제

'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star, CheckCircle, XCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  getReviewList,
  getReviewsByStatus,
  updateReviewStatus,
  type ReviewListItem,
} from '@/lib/api/admin'

export default function AdminReviewsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [reviews, setReviews] = useState<ReviewListItem[]>([])
  const [rejectReason, setRejectReason] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // ========== 리뷰 목록 로드 ==========
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true)
        let data: ReviewListItem[]
        if (activeTab === 'pending') {
          data = await getReviewList()
        } else {
          const status = activeTab === 'approved' ? 'APPROVED' : 'REJECTED'
          data = await getReviewsByStatus(status)
        }
        setReviews(data)
      } catch (error) {
        console.error('리뷰 목록 로드 실패:', error)
        alert('리뷰 목록을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [activeTab])

  // ========== 승인 처리 ==========
  const handleApprove = async (reviewId: number) => {
    if (!confirm('이 리뷰를 승인하시겠습니까?')) return

    try {
      setIsProcessing(true)
      await updateReviewStatus(reviewId, 'APPROVED')
      alert('리뷰가 승인되었습니다')
      // 목록 새로고침
      let data: ReviewListItem[]
      if (activeTab === 'pending') {
        data = await getReviewList()
      } else {
        const status = activeTab === 'approved' ? 'APPROVED' : 'REJECTED'
        data = await getReviewsByStatus(status)
      }
      setReviews(data)
    } catch (error) {
      console.error('리뷰 승인 실패:', error)
      alert(error instanceof Error ? error.message : '리뷰 승인에 실패했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  // ========== 거절 처리 ==========
  const handleReject = async (reviewId: number, reason: string) => {
    if (!reason.trim()) {
      alert('거절 사유를 입력해주세요')
      return
    }

    if (!confirm('이 리뷰를 거절하시겠습니까?')) return

    try {
      setIsProcessing(true)
      await updateReviewStatus(reviewId, 'REJECTED', reason)
      alert('리뷰 승인이 거절되었습니다')
      setRejectReason('')
      // 목록 새로고침
      let data: ReviewListItem[]
      if (activeTab === 'pending') {
        data = await getReviewList()
      } else {
        const status = activeTab === 'approved' ? 'APPROVED' : 'REJECTED'
        data = await getReviewsByStatus(status)
      }
      setReviews(data)
    } catch (error) {
      console.error('리뷰 거절 실패:', error)
      alert(error instanceof Error ? error.message : '리뷰 거절에 실패했습니다.')
    } finally {
      setIsProcessing(false)
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
              <button
                className={`pb-4 font-medium transition-colors ${
                  activeTab === 'rejected'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('rejected')}
              >
                거절됨
              </button>
            </div>
          </div>

          {/* ========== 리뷰 목록 ========== */}
          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">로딩 중...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">
                      {activeTab === 'pending'
                        ? '미승인 리뷰가 없습니다'
                        : activeTab === 'approved'
                        ? '승인된 리뷰가 없습니다'
                        : '거절된 리뷰가 없습니다'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                reviews.map((review) => (
                  <Card key={review.reviewId}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">
                            {review.lectureName || `강의 ID: ${review.lectureId}`}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            작성자: {review.email}
                          </p>
                          <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.starRating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {review.contents}
                          </p>
                        </div>
                        {activeTab === 'pending' && (
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(review.reviewId)}
                              disabled={isProcessing}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              승인
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={isProcessing}
                                >
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
                                    onClick={() => handleReject(review.reviewId, rejectReason)}
                                    disabled={isProcessing}
                                  >
                                    거절 확인
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
