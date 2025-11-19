// ========== 기관 마이페이지 ==========
// 역할: 운영기관만
// 기능: 기관정보, 강의관리, 강의승인현황, 리뷰조회

'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2, BookOpen, CheckCircle, MessageSquare, Edit, Trash2, Star } from 'lucide-react'
import Link from 'next/link'

// ========== 임시 기관 데이터 ==========
const orgData = {
  email: 'org@company.com',
  name: 'ABC학원',
  contact: '02-1234-5678',
  manager: '홍길동',
  approvalStatus: '승인됨',
  joinDate: '2024-01-01',
}

// ========== 임시 강의 목록 ==========
const orgLectures = [
  {
    id: 1,
    title: 'React 완벽 마스터',
    category: '프론트엔드',
    target: '재직자',
    method: '온라인',
    startDate: '2025-03-01',
    status: '승인',
  },
  {
    id: 2,
    title: 'Node.js 백엔드 개발',
    category: '백엔드',
    target: '재직자',
    method: '온라인',
    startDate: '2025-03-15',
    status: '검토중',
  },
]

// ========== 임시 리뷰 목록 ==========
const orgReviews = [
  {
    id: 1,
    lectureName: 'React 완벽 마스터',
    author: '학생1',
    rating: 5,
    content: '정말 좋은 강의입니다.',
    date: '2025-02-15',
    status: '승인완료',
  },
]

export default function OrgPage() {
  const [activeTab, setActiveTab] = useState<'info' | 'lectures' | 'approval' | 'reviews'>('info')
  const [isEditMode, setIsEditMode] = useState(false)

  return (
    <>
      <Header />
      
      <main className="bg-background min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========== 페이지 헤더 ========== */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">기관 관리</h1>
            <p className="text-muted-foreground">기관 정보와 강의를 관리하세요</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* ========== 좌측 사이드바 ========== */}
            <aside className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab('info')}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                        activeTab === 'info'
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Building2 className="h-5 w-5" />
                      <span>기관정보</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('lectures')}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                        activeTab === 'lectures'
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <BookOpen className="h-5 w-5" />
                      <span>강의관리</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('approval')}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                        activeTab === 'approval'
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>강의승인현황</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                        activeTab === 'reviews'
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>리뷰조회</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* ========== 우측 콘텐츠 영역 ========== */}
            <div className="lg:col-span-3">
              {/* ========== 기관정보 탭 ========== */}
              {activeTab === 'info' && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold">기관정보</h2>
                      {!isEditMode && (
                        <Button onClick={() => setIsEditMode(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          정보 수정
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>기관명</Label>
                        <Input value={orgData.name} disabled={!isEditMode} className="mt-2" />
                      </div>

                      <div>
                        <Label>이메일</Label>
                        <Input value={orgData.email} disabled className="mt-2" />
                      </div>

                      <div>
                        <Label>연락처</Label>
                        <Input value={orgData.contact} disabled={!isEditMode} className="mt-2" />
                      </div>

                      <div>
                        <Label>담당자명</Label>
                        <Input value={orgData.manager} disabled={!isEditMode} className="mt-2" />
                      </div>

                      <div>
                        <Label>승인 상태</Label>
                        <div className="mt-2">
                          <span className="inline-block rounded-full bg-green-100 text-green-700 px-4 py-2 text-sm font-medium">
                            {orgData.approvalStatus}
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label>등록일</Label>
                        <Input value={orgData.joinDate} disabled className="mt-2" />
                      </div>

                      {isEditMode && (
                        <div className="flex gap-2 pt-4">
                          <Button onClick={() => setIsEditMode(false)}>저장</Button>
                          <Button variant="outline" onClick={() => setIsEditMode(false)}>
                            취소
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ========== 강의관리 탭 ========== */}
              {activeTab === 'lectures' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">강의관리</h2>
                    <Link href="/org/lectures/new">
                      <Button>새 강의 등록</Button>
                    </Link>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {orgLectures.map((lecture) => (
                          <Card key={lecture.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold mb-2">{lecture.title}</h3>
                                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                                    <span>{lecture.category}</span>
                                    <span>•</span>
                                    <span>{lecture.target}</span>
                                    <span>•</span>
                                    <span>{lecture.method}</span>
                                    <span>•</span>
                                    <span>{lecture.startDate}</span>
                                  </div>
                                  <span
                                    className={`text-xs px-3 py-1 rounded-full ${
                                      lecture.status === '승인'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}
                                  >
                                    {lecture.status}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    수정
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ========== 강의승인현황 탭 ========== */}
              {activeTab === 'approval' && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">강의승인현황</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card className="bg-yellow-50">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-muted-foreground mb-1">검토중</p>
                          <p className="text-3xl font-bold text-yellow-600">1</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-50">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-muted-foreground mb-1">승인됨</p>
                          <p className="text-3xl font-bold text-green-600">1</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-red-50">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-muted-foreground mb-1">거절됨</p>
                          <p className="text-3xl font-bold text-red-600">0</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ========== 리뷰조회 탭 ========== */}
              {activeTab === 'reviews' && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">리뷰조회</h2>
                    <div className="space-y-4">
                      {orgReviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold">{review.lectureName}</h3>
                                <p className="text-sm text-muted-foreground">{review.author}</p>
                                <div className="flex items-center gap-1 mt-1">
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
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
