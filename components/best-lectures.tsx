// ========== 베스트 강의 섹션 컴포넌트 ==========
// 평점순 상위 강의 표시

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Heart } from 'lucide-react'
import Link from 'next/link'

// ========== 임시 데이터 (나중에 API로 교체) ==========
const bestLectures = [
  {
    id: 1,
    title: 'React 완벽 마스터',
    instructor: '김철수',
    rating: 4.9,
    reviewCount: 234,
    target: '재직자',
    image: '/react-course.png',
  },
  {
    id: 2,
    title: 'Python 데이터 분석',
    instructor: '이영희',
    rating: 4.8,
    reviewCount: 189,
    target: '취업자',
    image: '/python-data-analysis.png',
  },
  {
    id: 3,
    title: 'AWS 클라우드 실전',
    instructor: '박민수',
    rating: 4.7,
    reviewCount: 156,
    target: '재직자',
    image: '/aws-cloud-landscape.png',
  },
  {
    id: 4,
    title: 'Node.js 백엔드 개발',
    instructor: '최지훈',
    rating: 4.9,
    reviewCount: 201,
    target: '재직자',
    image: '/nodejs-backend.png',
  },
]

export default function BestLectures() {
  return (
    <section className="py-16 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== 섹션 제목 ========== */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">베스트 강의</h2>
          <p className="text-muted-foreground">가장 만족도 높은 강의들</p>
        </div>

        {/* ========== 강의 그리드 ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestLectures.map((lecture) => (
            <Link key={lecture.id} href={`/lectures/${lecture.id}`}>
              <Card className="group overflow-hidden hover:border-primary transition-all h-full">
                {/* ========== 강의 이미지 ========== */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={lecture.image || "/placeholder.svg"}
                    alt={lecture.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  {/* ========== 찜 아이콘 (회원만 활성화) ========== */}
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

                  {/* ========== 별점 및 리뷰 수 ========== */}
                  <div className="mb-2 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{lecture.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({lecture.reviewCount})
                    </span>
                  </div>

                  {/* ========== 대상 배지 ========== */}
                  <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {lecture.target}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
