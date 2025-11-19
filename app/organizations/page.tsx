// ========== 교육기관 목록 페이지 ==========
// 역할: 모든 사용자
// 기능: 교육기관 조회

'use client'

import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, BookOpen, Star } from 'lucide-react'
import Link from 'next/link'

// ========== 임시 기관 데이터 ==========
const organizations = [
  {
    id: 1,
    name: 'ABC학원',
    lectureCount: 45,
    rating: 4.8,
    description: '실무 중심의 IT 교육 전문 기관',
  },
  {
    id: 2,
    name: 'XYZ교육센터',
    lectureCount: 32,
    rating: 4.7,
    description: '정부지원 교육 프로그램 운영',
  },
  {
    id: 3,
    name: '테크아카데미',
    lectureCount: 28,
    rating: 4.9,
    description: '최신 기술 트렌드 교육',
  },
]

export default function OrganizationsPage() {
  return (
    <>
      <Header />
      
      <main className="bg-background min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========== 페이지 헤더 ========== */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">교육기관</h1>
            <p className="text-muted-foreground">검증된 교육기관들을 만나보세요</p>
          </div>

          {/* ========== 기관 그리드 ========== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <Card key={org.id} className="hover:border-primary transition-all">
                <CardContent className="p-6">
                  {/* ========== 기관 아이콘 ========== */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{org.name}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{org.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* ========== 기관 설명 ========== */}
                  <p className="text-sm text-muted-foreground mb-4">
                    {org.description}
                  </p>

                  {/* ========== 강의 수 ========== */}
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{org.lectureCount}개 강의</span>
                  </div>

                  {/* ========== 강의 보기 버튼 ========== */}
                  <Link href={`/lectures?org=${org.id}`}>
                    <Button variant="outline" className="w-full">
                      강의 보기
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
