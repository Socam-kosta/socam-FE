'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function RecommendedBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const banners = [
    {
      id: 1,
      title: '이 달의 추천 강의',
      subtitle: '실무 개발자가 직접 가르치는 React 심화 과정',
      image: '/react------.jpg',
      highlight: '신규',
    },
    {
      id: 2,
      title: '인기 훈련 프로그램',
      subtitle: '6개월 집중 부트캠프 - 취업률 95%',
      image: '/-------.jpg',
      highlight: '인기',
    },
    {
      id: 3,
      title: '주목할 기관',
      subtitle: '국내 최고의 IT 교육 기관들',
      image: '/-------.jpg',
      highlight: '추천',
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== BANNER CAROUSEL ========== */}
        <div className="relative">
          <div className="bg-card border border-border rounded-lg overflow-hidden h-64 md:h-72 relative">
            {/* Banner Content */}
            {banners.map((banner, idx) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  idx === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={banner.image || "/placeholder.svg"}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8">
                  <div className="inline-block w-fit mb-3">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      {banner.highlight}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{banner.title}</h3>
                  <p className="text-lg text-white/80 max-w-2xl">{banner.subtitle}</p>
                </div>
              </div>
            ))}

            {/* Navigation Buttons */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-all"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-all"
            >
              <ChevronRight size={24} className="text-white" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
