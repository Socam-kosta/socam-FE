// ========== 강의 승인 관리 페이지 ==========
// 역할: 관리자만
// 기능: 강의 등록 승인/거절

'use client'

import { useState } from 'react'
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

// ========== 임시 강의 데이터 ==========
const pendingLectures = [
  {
    id: 1,
    title: 'TypeScript 완벽 가이드',
    orgName: 'ABC학원',
    instructor: '송민지',
    category: '프론트엔드',
    target: '취업자',
    method: '온라인',
    startDate: '2025-03-05',
    endDate: '2025-05-05',
    description: 'TypeScript의 핵심 개념부터 실전 프로젝트까지',
    applicationDate: '2025-02-15',
  },
]

export default function AdminLecturesPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [rejectReason, setRejectReason] = useState('')

  const handleApprove = (lectureId: number) => {
    console.log('[v0] Lecture approved:', lectureId)
    alert('강의가 승인되었습니다')
  }

  const handleReject = (lectureId: number, reason: string) => {
    console.log('[v0] Lecture rejected:', lectureId, reason)
    alert('강의 승인이 거절되었습니다')
    setRejectReason('')
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

          {/* ========== 검토 중인 강의 목록 ========== */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingLectures.map((lecture) => (
                <Card key={lecture.id}>
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
                              <span className="text-muted-foreground">강사: </span>
                              <span>{lecture.instructor}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">카테고리: </span>
                              <span>{lecture.category}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">대상: </span>
                              <span>{lecture.target}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">방식: </span>
                              <span>{lecture.method}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">신청일: </span>
                              <span>{lecture.applicationDate}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {lecture.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {/* ========== 상세보기 다이얼로그 ========== */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              상세
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{lecture.title}</DialogTitle>
                              <DialogDescription>강의 상세 정보</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">기관명</p>
                                  <p className="font-medium">{lecture.orgName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">강사명</p>
                                  <p className="font-medium">{lecture.instructor}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">카테고리</p>
                                  <p className="font-medium">{lecture.category}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">대상</p>
                                  <p className="font-medium">{lecture.target}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">강의 설명</p>
                                <p className="font-medium">{lecture.description}</p>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button
                                  className="flex-1"
                                  onClick={() => handleApprove(lecture.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  승인
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="destructive" className="flex-1">
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
                                        onClick={() => handleReject(lecture.id, rejectReason)}
                                      >
                                        거절 확인
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* ========== 승인됨/거절됨 탭 ========== */}
          {(activeTab === 'approved' || activeTab === 'rejected') && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  {activeTab === 'approved' ? '승인된' : '거절된'} 강의가 없습니다
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
