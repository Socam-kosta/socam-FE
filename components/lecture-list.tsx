'use client'

import { Heart } from 'lucide-react'

export default function LectureList() {
  const lectures = [
    {
      id: 1,
      title: 'React 심화 마스터클래스',
      institution: 'TechAcademy',
      duration: '12주',
      mode: '온라인',
      rating: 4.9,
      reviews: 324,
      price: '₩299,000',
      image: '/react---.jpg',
      isFavorite: false,
    },
    {
      id: 2,
      title: '데이터 분석 입문 과정',
      institution: 'DataSchool',
      duration: '8주',
      mode: '온/오프라인',
      rating: 4.8,
      reviews: 256,
      price: '₩249,000',
      image: '/---------.jpg',
      isFavorite: false,
    },
    {
      id: 3,
      title: 'AI 머신러닝 기초',
      institution: 'AILab',
      duration: '10주',
      mode: '온라인',
      rating: 4.7,
      reviews: 189,
      price: '₩349,000',
      image: '/ai-----.jpg',
      isFavorite: false,
    },
    {
      id: 4,
      title: 'Node.js 백엔드 개발',
      institution: 'DevCamp',
      duration: '6주',
      mode: '오프라인',
      rating: 4.9,
      reviews: 412,
      price: '₩199,000',
      image: '/node-js----.jpg',
      isFavorite: false,
    },
    {
      id: 5,
      title: '클라우드 AWS 입문',
      institution: 'CloudMasters',
      duration: '4주',
      mode: '온라인',
      rating: 4.6,
      reviews: 178,
      price: '₩179,000',
      image: '/aws-----.jpg',
      isFavorite: false,
    },
    {
      id: 6,
      title: '모바일 Flutter 개발',
      institution: 'MobileSchool',
      duration: '9주',
      mode: '온라인',
      rating: 4.8,
      reviews: 234,
      price: '₩279,000',
      image: '/flutter-------.jpg',
      isFavorite: false,
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== SECTION TITLE ========== */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">강의 목록</h2>
          <p className="text-muted-foreground">우리의 추천 강의들을 확인하세요</p>
        </div>

        {/* ========== LECTURE CARDS GRID ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lectures.map((lecture) => (
            <div
              key={lecture.id}
              className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary hover:shadow-lg transition-all"
            >
              {/* ========== LECTURE IMAGE ========== */}
              <div className="relative overflow-hidden h-40">
                <img
                  src={lecture.image || "/placeholder.svg"}
                  alt={lecture.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* ========== WISHLIST BUTTON ========== */}
                <button className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-primary rounded-full transition-all backdrop-blur-sm">
                  <Heart size={18} className={lecture.isFavorite ? 'fill-primary text-primary' : 'text-white'} />
                </button>
              </div>

              {/* ========== LECTURE INFO ========== */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {lecture.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{lecture.institution}</p>

                {/* ========== LECTURE DETAILS ========== */}
                <div className="flex gap-2 text-xs text-muted-foreground mb-4 flex-wrap">
                  <span className="px-2 py-1 bg-muted rounded">📅 {lecture.duration}</span>
                  <span className="px-2 py-1 bg-muted rounded">📍 {lecture.mode}</span>
                </div>

                {/* ========== RATING & PRICE ========== */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold">{lecture.rating}</span>
                      <span className="text-xs text-muted-foreground">({lecture.reviews})</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-primary">{lecture.price}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ========== MORE LECTURES BUTTON ========== */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 border border-primary text-primary hover:bg-primary/10 rounded-full font-semibold transition-all">
            모든 강의 보기
          </button>
        </div>
      </div>
    </section>
  )
}
