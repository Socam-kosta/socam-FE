'use client'

export default function FeaturedInstitutions() {
  const institutions = [
    {
      id: 1,
      name: 'TechAcademy',
      logo: '/techacademy---.jpg',
      description: '실무 개발자 중심의 교육',
      courseCount: 45,
      students: '12K+',
    },
    {
      id: 2,
      name: 'DataSchool',
      logo: '/dataschool---.jpg',
      description: '데이터 과학 전문 교육',
      courseCount: 28,
      students: '8K+',
    },
    {
      id: 3,
      name: 'AILab',
      logo: '/ailab---.jpg',
      description: 'AI & ML 전문 기관',
      courseCount: 35,
      students: '9K+',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== SECTION TITLE ========== */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">주요 교육기관</h2>
          <p className="text-muted-foreground">신뢰할 수 있는 교육 기관들을 만나보세요</p>
        </div>

        {/* ========== INSTITUTIONS GRID ========== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {institutions.map((institution) => (
            <div
              key={institution.id}
              className="bg-background border border-border rounded-lg p-8 hover:border-primary hover:shadow-lg transition-all text-center"
            >
              {/* ========== INSTITUTION LOGO ========== */}
              <div className="mb-6 h-20 flex items-center justify-center">
                <img
                  src={institution.logo || "/placeholder.svg"}
                  alt={institution.name}
                  className="max-h-full max-w-full"
                />
              </div>

              {/* ========== INSTITUTION INFO ========== */}
              <h3 className="text-xl font-bold mb-2">{institution.name}</h3>
              <p className="text-muted-foreground mb-6">{institution.description}</p>

              {/* ========== STATS ========== */}
              <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-t border-b border-border">
                <div>
                  <p className="text-2xl font-bold text-primary">{institution.courseCount}</p>
                  <p className="text-xs text-muted-foreground">강의</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{institution.students}</p>
                  <p className="text-xs text-muted-foreground">수강생</p>
                </div>
              </div>

              {/* ========== CTA BUTTON ========== */}
              <button className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-all">
                기관 보기
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
