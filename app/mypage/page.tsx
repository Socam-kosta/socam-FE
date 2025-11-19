// ========== 학생 마이페이지 ==========
// 역할: 학생(회원)만
// 기능: 내 정보, 내 리뷰, 찜 목록, 회원 탈퇴

'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { User, MessageSquare, Heart, AlertTriangle, Star, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'

// ========== 임시 사용자 데이터 ==========
const userData = {
  email: 'user@example.com',
  name: '김철수',
  nickname: '철수_개발자',
  phone: '010-1234-5678',
  joinDate: '2024-01-15',
}

// ========== 임시 리뷰 데이터 ==========
const userReviews = [
  {
    id: 1,
    lectureName: 'React 완벽 마스터',
    rating: 5,
    content: '정말 좋은 강의입니다. 실무에 바로 적용할 수 있는 내용들이 많았습니다.',
    date: '2025-02-15',
    status: '승인완료',
  },
  {
    id: 2,
    lectureName: 'Python 데이터 분석',
    rating: 4,
    content: '강사님의 설명이 명확하고 이해하기 쉬웠습니다.',
    date: '2025-02-10',
    status: '승인대기',
  },
]

// ========== 임시 찜 목록 ==========
const wishlist = [
  {
    id: 3,
    title: 'AWS 클라우드 실전',
    instructor: '박민수',
    rating: 4.7,
    image: '/aws-cloud-landscape.png',
  },
  {
    id: 4,
    title: 'Node.js 백엔드 개발',
    instructor: '최지훈',
    rating: 4.9,
    image: '/nodejs-backend.png',
  },
]

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'reviews' | 'wishlist' | 'withdrawal'>('profile')
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    nickname: userData.nickname,
    phone: userData.phone,
  })

  // ========== 정보 수정 처리 ==========
  const handleSaveProfile = () => {
    console.log('[v0] Profile updated:', formData)
    alert('정보가 수정되었습니다')
    setIsEditMode(false)
  }

  return (
    <>
      <Header />
      
      <main className="bg-background min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========== 페이지 헤더 ========== */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">마이페이지</h1>
            <p className="text-muted-foreground">내 정보를 관리하세요</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* ========== 좌측 사이드바 (탭 메뉴) ========== */}
            <aside className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                        activeTab === 'profile'
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <User className="h-5 w-5" />
                      <span>내 정보</span>
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
                      <span>내 리뷰</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('wishlist')}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                        activeTab === 'wishlist'
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Heart className="h-5 w-5" />
                      <span>찜 목록</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('withdrawal')}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                        activeTab === 'withdrawal'
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <AlertTriangle className="h-5 w-5" />
                      <span>회원 탈퇴</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* ========== 우측 콘텐츠 영역 ========== */}
            <div className="lg:col-span-3">
              {/* ========== 내 정보 탭 ========== */}
              {activeTab === 'profile' && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold">내 정보</h2>
                      {!isEditMode && (
                        <Button onClick={() => setIsEditMode(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          정보 수정
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* ========== 이메일 (수정 불가) ========== */}
                      <div>
                        <Label>이메일</Label>
                        <Input value={userData.email} disabled className="mt-2" />
                      </div>

                      {/* ========== 이름 (수정 불가) ========== */}
                      <div>
                        <Label>이름</Label>
                        <Input value={userData.name} disabled className="mt-2" />
                      </div>

                      {/* ========== 닉네임 ========== */}
                      <div>
                        <Label>닉네임</Label>
                        <Input
                          value={formData.nickname}
                          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                          disabled={!isEditMode}
                          className="mt-2"
                        />
                      </div>

                      {/* ========== 전화번호 ========== */}
                      <div>
                        <Label>전화번호</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!isEditMode}
                          className="mt-2"
                        />
                      </div>

                      {/* ========== 가입일 ========== */}
                      <div>
                        <Label>가입일</Label>
                        <Input value={userData.joinDate} disabled className="mt-2" />
                      </div>

                      {/* ========== 수정 모드 버튼 ========== */}
                      {isEditMode && (
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleSaveProfile}>저장</Button>
                          <Button variant="outline" onClick={() => setIsEditMode(false)}>
                            취소
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ========== 내 리뷰 탭 ========== */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-semibold mb-6">내 리뷰</h2>
                      <div className="space-y-4">
                        {userReviews.map((review) => (
                          <Card key={review.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold">{review.lectureName}</h3>
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
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs px-3 py-1 rounded-full ${
                                      review.status === '승인완료'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}
                                  >
                                    {review.status}
                                  </span>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{review.content}</p>
                              <p className="text-xs text-muted-foreground">{review.date}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ========== 찜 목록 탭 ========== */}
              {activeTab === 'wishlist' && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">찜 목록</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlist.map((lecture) => (
                        <Link key={lecture.id} href={`/lectures/${lecture.id}`}>
                          <Card className="hover:border-primary transition-all">
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <img
                                  src={lecture.image || "/placeholder.svg"}
                                  alt={lecture.title}
                                  className="w-24 h-24 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <h3 className="font-semibold mb-1 line-clamp-1">{lecture.title}</h3>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {lecture.instructor}
                                  </p>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-semibold">{lecture.rating}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ========== 회원 탈퇴 탭 ========== */}
              {activeTab === 'withdrawal' && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">회원 탈퇴</h2>
                    <div className="space-y-6">
                      {/* ========== 경고 메시지 ========== */}
                      <div className="rounded-lg bg-destructive/10 p-4">
                        <div className="flex gap-3">
                          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-destructive mb-2">
                              계정을 삭제하면 모든 데이터가 영구 삭제됩니다
                            </h3>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              <li>• 프로필 정보</li>
                              <li>• 작성한 리뷰</li>
                              <li>• 찜 목록</li>
                              <li>• 복구 불가능</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* ========== 탈퇴 폼 ========== */}
                      <div>
                        <Label htmlFor="password">패스워드 확인</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="패스워드를 입력하세요"
                          className="mt-2"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="confirm" />
                        <Label htmlFor="confirm" className="font-normal">
                          계정 삭제를 원합니다
                        </Label>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="destructive">탈퇴하기</Button>
                        <Button variant="outline">취소</Button>
                      </div>
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
