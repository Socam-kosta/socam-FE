// ========== 강의 목록 페이지 ==========
// 역할: 모든 사용자
// 기능: 강의 검색, 필터, 정렬

'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Star, Heart, Calendar } from 'lucide-react'
import Link from 'next/link'

// ========== 임시 강의 데이터 ==========
const allLectures = [
  {
    id: 1,
    title: 'React 완벽 마스터',
    instructor: '김철수',
    rating: 4.9,
    reviewCount: 234,
    target: '재직자',
    method: '온라인',
    category: 'frontend',
    startDate: '2025-03-01',
    endDate: '2025-04-30',
    image: '/react-course.png',
  },
  {
    id: 2,
    title: 'Python 데이터 분석',
    instructor: '이영희',
    rating: 4.8,
    reviewCount: 189,
    target: '취업자',
    method: '오프라인',
    category: 'ai',
    startDate: '2025-03-05',
    endDate: '2025-05-05',
    image: '/python-data-analysis.png',
  },
  {
    id: 3,
    title: 'AWS 클라우드 실전',
    instructor: '박민수',
    rating: 4.7,
    reviewCount: 156,
    target: '재직자',
    method: '온라인',
    category: 'cloud',
    startDate: '2025-03-10',
    endDate: '2025-05-10',
    image: '/aws-cloud-landscape.png',
  },
  {
    id: 4,
    title: 'Node.js 백엔드 개발',
    instructor: '최지훈',
    rating: 4.9,
    reviewCount: 201,
    target: '재직자',
    method: '온라인',
    category: 'backend',
    startDate: '2025-03-15',
    endDate: '2025-05-15',
    image: '/nodejs-backend.png',
  },
]

export default function LecturesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [filters, setFilters] = useState({
    method: [] as string[],
    category: [] as string[],
    target: [] as string[],
  })

  // ========== 필터 토글 함수 ==========
  const toggleFilter = (type: 'method' | 'category' | 'target', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }))
  }

  return (
    <>
      <Header />
      
      <main className="bg-background min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========== 페이지 헤더 ========== */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">전체 강의</h1>
            <p className="text-muted-foreground">{allLectures.length}개의 강의를 탐색하세요</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* ========== 필터 사이드바 ========== */}
            <aside className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6 space-y-6">
                  {/* ========== 강의 방식 필터 ========== */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">강의 방식</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="online"
                          checked={filters.method.includes('온라인')}
                          onCheckedChange={() => toggleFilter('method', '온라인')}
                        />
                        <Label htmlFor="online" className="font-normal">온라인</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="offline"
                          checked={filters.method.includes('오프라인')}
                          onCheckedChange={() => toggleFilter('method', '오프라인')}
                        />
                        <Label htmlFor="offline" className="font-normal">오프라인</Label>
                      </div>
                    </div>
                  </div>

                  {/* ========== 카테고리 필터 ========== */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">카테고리</Label>
                    <div className="space-y-2">
                      {['frontend', 'backend', 'ai', 'cloud'].map(cat => (
                        <div key={cat} className="flex items-center space-x-2">
                          <Checkbox
                            id={cat}
                            checked={filters.category.includes(cat)}
                            onCheckedChange={() => toggleFilter('category', cat)}
                          />
                          <Label htmlFor={cat} className="font-normal capitalize">{cat}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ========== 대상 필터 ========== */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">대상</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="employed"
                          checked={filters.target.includes('재직자')}
                          onCheckedChange={() => toggleFilter('target', '재직자')}
                        />
                        <Label htmlFor="employed" className="font-normal">재직자</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="jobseeker"
                          checked={filters.target.includes('취업자')}
                          onCheckedChange={() => toggleFilter('target', '취업자')}
                        />
                        <Label htmlFor="jobseeker" className="font-normal">취업자</Label>
                      </div>
                    </div>
                  </div>

                  {/* ========== 필터 초기화 ========== */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setFilters({ method: [], category: [], target: [] })}
                  >
                    필터 초기화
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* ========== 강의 목록 ========== */}
            <div className="lg:col-span-3">
              {/* ========== 검색 및 정렬 바 ========== */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Input
                  type="search"
                  placeholder="강의명 또는 강사명 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">인기순</SelectItem>
                    <SelectItem value="latest">최신순</SelectItem>
                    <SelectItem value="rating">별점순</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ========== 강의 그리드 ========== */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {allLectures.map((lecture) => (
                  <Link key={lecture.id} href={`/lectures/${lecture.id}`}>
                    <Card className="group overflow-hidden hover:border-primary transition-all h-full">
                      {/* ========== 강의 이미지 ========== */}
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={lecture.image || "/placeholder.svg"}
                          alt={lecture.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        {/* ========== 찜 아이콘 ========== */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 bg-background/80 hover:bg-background"
                        >
                          <Heart className="h-5 w-5" />
                        </Button>
                      </div>

                      <CardContent className="p-4">
                        {/* ========== 강의명 ========== */}
                        <h3 className="mb-2 font-semibold line-clamp-1">{lecture.title}</h3>

                        {/* ========== 강사명 ========== */}
                        <p className="mb-2 text-sm text-muted-foreground">{lecture.instructor}</p>

                        {/* ========== 별점 ========== */}
                        <div className="mb-2 flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{lecture.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({lecture.reviewCount})
                          </span>
                        </div>

                        {/* ========== 강의 기간 ========== */}
                        <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="text-xs">{lecture.startDate} ~ {lecture.endDate}</span>
                        </div>

                        {/* ========== 배지들 ========== */}
                        <div className="flex gap-2">
                          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {lecture.target}
                          </div>
                          <div className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                            {lecture.method}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
