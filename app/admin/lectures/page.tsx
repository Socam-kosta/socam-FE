// ========== 강의 승인 관리 페이지 ==========
// 역할: 관리자만
// 기능: 강의 등록 승인/거절

'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { BookOpen, CheckCircle, XCircle, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  getPendingLectures,
  getLecturesByStatus,
  getLectureDetail,
  updateLectureStatus,
  deleteLecture,
  type LectureListItem,
  type LectureDetail,
} from '@/lib/api/admin'

export default function AdminLecturesPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [lectures, setLectures] = useState<LectureListItem[]>([])
  const [selectedLecture, setSelectedLecture] = useState<LectureDetail | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  // ========== 강의 목록 로드 ==========
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setIsLoading(true)
        let data: LectureListItem[]
        if (activeTab === 'pending') {
          data = await getPendingLectures()
        } else {
          // APPROVED, REJECTED는 상태별 조회
          data = await getLecturesByStatus(activeTab.toUpperCase() as 'APPROVED' | 'REJECTED')
        }
        setLectures(data)
      } catch (error) {
        console.error('강의 목록 로드 실패:', error)
        alert('강의 목록을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLectures()
  }, [activeTab])

  // ========== 강의 상세 로드 ==========
  const loadLectureDetail = async (lectureId: number) => {
    try {
      setIsDetailLoading(true)
      const detail = await getLectureDetail(lectureId)
      setSelectedLecture(detail)
    } catch (error) {
      console.error('강의 상세 로드 실패:', error)
      alert('강의 상세 정보를 불러오는데 실패했습니다.')
    } finally {
      setIsDetailLoading(false)
    }
  }

  // ========== 승인 처리 ==========
  const handleApprove = async (lectureId: number) => {
    if (!confirm('이 강의를 승인하시겠습니까?')) return

    try {
      setIsProcessing(true)
      await updateLectureStatus(lectureId, 'APPROVED')
      alert('강의가 승인되었습니다')
      // 목록 새로고침
      let data: LectureListItem[]
      if (activeTab === 'pending') {
        data = await getPendingLectures()
      } else {
        data = await getLecturesByStatus(activeTab.toUpperCase() as 'APPROVED' | 'REJECTED')
      }
      setLectures(data)
    } catch (error) {
      console.error('강의 승인 실패:', error)
      alert(error instanceof Error ? error.message : '강의 승인에 실패했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  // ========== 거절 처리 ==========
  const handleReject = async (lectureId: number, reason: string) => {
    if (!reason.trim()) {
      alert('거절 사유를 입력해주세요')
      return
    }

    if (!confirm('이 강의를 거절하시겠습니까?')) return

    try {
      setIsProcessing(true)
      await updateLectureStatus(lectureId, 'REJECTED', reason)
      alert('강의 승인이 거절되었습니다')
      setRejectReason('')
      // 목록 새로고침
      let data: LectureListItem[]
      if (activeTab === 'pending') {
        data = await getPendingLectures()
      } else {
        data = await getLecturesByStatus(activeTab.toUpperCase() as 'APPROVED' | 'REJECTED')
      }
      setLectures(data)
    } catch (error) {
      console.error('강의 거절 실패:', error)
      alert(error instanceof Error ? error.message : '강의 거절에 실패했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  // ========== 삭제 처리 ==========
  const handleDelete = async (lectureId: number) => {
    if (!confirm('이 강의를 삭제하시겠습니까?')) return

    try {
      setIsProcessing(true)
      await deleteLecture(lectureId)
      alert('강의가 삭제되었습니다')
      // 목록 새로고침
      let data: LectureListItem[]
      if (activeTab === 'pending') {
        data = await getPendingLectures()
      } else {
        data = await getLecturesByStatus(activeTab.toUpperCase() as 'APPROVED' | 'REJECTED')
      }
      setLectures(data)
    } catch (error) {
      console.error('강의 삭제 실패:', error)
      alert(error instanceof Error ? error.message : '강의 삭제에 실패했습니다.')
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
            <h1 className="text-3xl font-bold mb-2">강의 승인 관리</h1>
            <p className="text-muted-foreground">강의 등록 신청을 검토하세요</p>
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
                검토 중
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

          {/* ========== 강의 목록 ========== */}
          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">로딩 중...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {lectures.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">
                      {activeTab === 'pending'
                        ? '승인 대기 중인 강의가 없습니다'
                        : activeTab === 'approved'
                        ? '승인된 강의가 없습니다'
                        : '거절된 강의가 없습니다'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                lectures.map((lecture) => (
                  <Card key={lecture.lectureId}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4 flex-1">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                            <BookOpen className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{lecture.title}</h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mb-3">
                              <div>
                                <span className="text-muted-foreground">기관: </span>
                                <span>{lecture.orgName}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">이메일: </span>
                                <span>{lecture.email}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">시작일: </span>
                                <span>{lecture.startDate}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">종료일: </span>
                                <span>{lecture.endDate}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          {/* ========== 상세보기 다이얼로그 ========== */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() => loadLectureDetail(lecture.lectureId)}
                                disabled={isProcessing}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                상세
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  {selectedLecture?.title || lecture.title}
                                </DialogTitle>
                                <DialogDescription>강의 상세 정보</DialogDescription>
                              </DialogHeader>
                              {isDetailLoading ? (
                                <p className="text-center py-8">로딩 중...</p>
                              ) : selectedLecture ? (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-1">기관명</p>
                                      <p className="font-medium">{selectedLecture.organization}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-1">이메일</p>
                                      <p className="font-medium">{selectedLecture.email}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-1">시작일</p>
                                      <p className="font-medium">{selectedLecture.startDate}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-1">종료일</p>
                                      <p className="font-medium">{selectedLecture.endDate}</p>
                                    </div>
                                  </div>
                                  {selectedLecture.description && (
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-1">
                                        강의 설명
                                      </p>
                                      <p className="font-medium whitespace-pre-wrap">
                                        {selectedLecture.description}
                                      </p>
                                    </div>
                                  )}
                                  <div className="flex gap-2 pt-4">
                                    <Button
                                      className="flex-1"
                                      onClick={() => handleApprove(lecture.lectureId)}
                                      disabled={isProcessing}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      승인
                                    </Button>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="destructive"
                                          className="flex-1"
                                          disabled={isProcessing}
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          거절
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>강의 승인 거절</DialogTitle>
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
                                            onClick={() =>
                                              handleReject(lecture.lectureId, rejectReason)
                                            }
                                            disabled={isProcessing}
                                          >
                                            거절 확인
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                    <Button
                                      variant="outline"
                                      onClick={() => handleDelete(lecture.lectureId)}
                                      disabled={isProcessing}
                                    >
                                      삭제
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-center py-8">상세 정보를 불러올 수 없습니다</p>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
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
