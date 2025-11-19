// ========== 광고 배너 캐러셀 ==========
// 위치: 카테고리 네비게이션 바로 아래
// 기능: 5개의 광고 배너를 2초마다 자동 전환, 수동 전환 가능
// 반응형: 모바일/태블릿/데스크톱 대응

'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

// ========== 광고 배너 목업 데이터 ==========
// TODO: 실제 DB 연동 시 API로 교체
const adBanners = [
  {
    id: 1,
    title: 'React 풀스택 개발자 양성 과정',
    description: '8주 완성 프로젝트 중심 교육',
    imageUrl: '/react-fullstack-course.jpg',
    linkUrl: '/lectures/1',
    backgroundColor: 'bg-blue-50',
  },
  {
    id: 2,
    title: 'AI/머신러닝 부트캠프',
    description: 'Python 기초부터 딥러닝까지',
    imageUrl: '/ai-machine-learning-bootcamp.jpg',
    linkUrl: '/lectures/2',
    backgroundColor: 'bg-purple-50',
  },
  {
    id: 3,
    title: '클라우드 AWS 실무 과정',
    description: '현직 개발자가 알려주는 실전 노하우',
    imageUrl: '/aws-cloud-course.jpg',
    linkUrl: '/lectures/3',
    backgroundColor: 'bg-orange-50',
  },
  {
    id: 4,
    title: 'Spring Boot 백엔드 마스터',
    description: '대규모 서비스 설계부터 배포까지',
    imageUrl: '/spring-boot-backend.jpg',
    linkUrl: '/lectures/4',
    backgroundColor: 'bg-green-50',
  },
  {
    id: 5,
    title: 'UX/UI 디자인 실무',
    description: 'Figma로 배우는 프로덕트 디자인',
    imageUrl: '/ux-ui-design-figma.jpg',
    linkUrl: '/lectures/5',
    backgroundColor: 'bg-pink-50',
  },
]

export default function AdBannerCarousel() {
  // ========== 현재 활성화된 배너 인덱스 ==========
  const [currentIndex, setCurrentIndex] = useState(0)

  // ========== 자동 전환: 2초마다 다음 배너로 이동 ==========
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % adBanners.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // ========== 이전 배너로 이동 ==========
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + adBanners.length) % adBanners.length)
  }

  // ========== 다음 배너로 이동 ==========
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % adBanners.length)
  }

  // ========== 특정 배너로 직접 이동 ==========
  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    // ========== 캐러셀 컨테이너 ==========
    <section className="relative w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ========== 배너 슬라이드 영역 ========== */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* ========== 배너 리스트 (transform으로 슬라이드 효과) ========== */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {adBanners.map((banner) => (
              <div
                key={banner.id}
                className="min-w-full relative"
              >
                {/* ========== 배너 링크 영역 ========== */}
                <a
                  href={banner.linkUrl}
                  className={`block relative h-64 md:h-80 lg:h-96 ${banner.backgroundColor} 
                            rounded-2xl overflow-hidden group cursor-pointer`}
                >
                  {/* ========== 배너 이미지 ========== */}
                  <div className="relative w-full h-full">
                    <Image
                      src={banner.imageUrl || "/placeholder.svg"}
                      alt={banner.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* ========== 배너 텍스트 오버레이 ========== */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
                                  flex items-end p-8">
                      <div className="text-white">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                          {banner.title}
                        </h3>
                        <p className="text-sm md:text-base lg:text-lg opacity-90">
                          {banner.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>

          {/* ========== 좌측 화살표 버튼 ========== */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 
                     bg-white/80 hover:bg-white shadow-lg
                     hidden md:flex"
            onClick={handlePrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          {/* ========== 우측 화살표 버튼 ========== */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 
                     bg-white/80 hover:bg-white shadow-lg
                     hidden md:flex"
            onClick={handleNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* ========== 하단 인디케이터 점 (5개) ========== */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 
                        flex items-center gap-2">
            {adBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300
                          ${index === currentIndex 
                            ? 'bg-white w-8' 
                            : 'bg-white/50 hover:bg-white/80'}`}
                aria-label={`배너 ${index + 1}로 이동`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
