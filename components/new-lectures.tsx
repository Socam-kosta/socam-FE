// ========== 신규 강의 섹션 컴포넌트 ==========
// 최신 등록된 강의 그리드

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Heart, Calendar } from 'lucide-react'
import Link from 'next/link'

// ========== 임시 데이터 ==========
const newLectures = [
  {
    id: 5,
    title: 'Next.js 14 실전 프로젝트',
    instructor: '강태영',
    rating: 4.5,
    reviewCount: 45,
    target: '재직자',
    startDate: '2025-03-01',
    endDate: '2025-04-30',
    image: '/nextjs-project.jpg',
  },
  {
    id: 6,
    title: 'TypeScript 완벽 가이드',
    instructor: '송민지',
    rating: 4.7,
    reviewCount: 67,
    target: '취업자',
    startDate: '2025-03-05',
    endDate: '2025-05-05',
    image: '/typescript-guide.jpg',
  },
  {
    id: 7,
    title: 'Docker & Kubernetes',
    instructor: '윤서준',
    rating: 4.6,
    reviewCount: 52,
    target: '재직자',
    startDate: '2025-03-10',
    endDate: '2025-05-10',
    image: '/docker-kubernetes.png',
  },
  {
    id: 8,
    title: 'AI 챗봇 개발',
    instructor: '한예진',
    rating: 4.8,
    reviewCount: 89,
    target: '취업자',
    startDate: '2025-03-15',
    endDate: '2025-05-15',
    image: '/ai-chatbot.png',
  },
]

export default function NewLectures() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== 섹션 제목 ========== */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">신규 강의</h2>
          <p className="text-muted-foreground">최근에 등록된 강의들</p>
        </div>

        {/* ========== 강의 그리드 ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newLectures.map((lecture) => (
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

                  {/* ========== 대상 배지 ========== */}
                  <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {lecture.target}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* ========== 더보기 버튼 ========== */}
        <div className="mt-8 text-center">
          <Link href="/lectures">
            <Button variant="outline" size="lg">
              전체 강의 보기
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
