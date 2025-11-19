'use client'

export default function ReviewsSection() {
  const reviews = [
    {
      id: 1,
      author: '김준호',
      course: 'React 심화 과정',
      rating: 5,
      text: '정말 실무에 도움이 되는 강의였습니다. 강사님의 설명이 이해하기 쉽고 예제도 풍부해서 좋았어요.',
      date: '2주 전',
    },
    {
      id: 2,
      author: '이지영',
      course: '데이터 분석 입문',
      rating: 5,
      text: '초보자도 쉽게 따라할 수 있는 수준의 강의입니다. 커리큘럼이 체계적이고 좋습니다.',
      date: '1개월 전',
    },
    {
      id: 3,
      author: '박민수',
      course: 'Node.js 백엔드 개발',
      rating: 4,
      text: '좋은 내용이지만 좀 더 심화 내용도 있으면 좋을 것 같아요. 그래도 추천합니다!',
      date: '3주 전',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== SECTION TITLE ========== */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">수강생 후기</h2>
          <p className="text-muted-foreground">실제 수강생들의 생생한 후기를 들어보세요</p>
        </div>

        {/* ========== REVIEWS GRID ========== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all"
            >
              {/* ========== STAR RATING ========== */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-500 text-lg">⭐</span>
                ))}
              </div>

              {/* ========== REVIEW TEXT ========== */}
              <p className="text-foreground mb-4 line-clamp-4">"{review.text}"</p>

              {/* ========== COURSE NAME ========== */}
              <p className="text-sm text-primary font-semibold mb-3">{review.course}</p>

              {/* ========== AUTHOR INFO ========== */}
              <div className="flex justify-between items-center border-t border-border pt-4">
                <div>
                  <p className="font-semibold text-sm">{review.author}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
