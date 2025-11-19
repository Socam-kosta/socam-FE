// ========== 히어로 배너 컴포넌트 ==========
// 메인 페이지 상단 배너

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* ========== 배경 장식 요소 (매우 subtle하게) ========== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-secondary/5 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* ========== 히어로 제목 및 부제목 ========== */}
          <div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-balance text-[#111111]">
              소프트웨어 캠퍼스에서
              <br />
              <span className="text-primary">
                당신의 IT 꿈을 실현하세요
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#666666] max-w-3xl mx-auto text-balance">
              정부지원 IT 교육 플랫폼
            </p>
          </div>

          {/* ========== CTA 버튼 ========== */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/lectures">
              <Button size="lg" className="px-8">
                강의 탐색하기
              </Button>
            </Link>
          </div>

          {/* ========== 통계 정보 ========== */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 pt-12">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">1,000+</p>
              <p className="text-sm text-muted-foreground mt-1">강의 및 프로그램</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">50K+</p>
              <p className="text-sm text-muted-foreground mt-1">수강생</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">4.8/5</p>
              <p className="text-sm text-muted-foreground mt-1">평균 평점</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
