// ========== 카테고리 섹션 컴포넌트 ==========
// 8개 카테고리 버튼 표시

'use client'

import Link from 'next/link'

export default function CategorySection() {
  const categories = [
    { id: 'frontend', label: '프론트엔드', icon: '🎨' },
    { id: 'backend', label: '백엔드', icon: '⚙️' },
    { id: 'fullstack', label: '풀스택', icon: '🔧' },
    { id: 'mobile', label: '모바일', icon: '📱' },
    { id: 'ai', label: 'AI/데이터', icon: '🤖' },
    { id: 'cloud', label: '클라우드', icon: '☁️' },
    { id: 'security', label: '보안', icon: '🔒' },
    { id: 'devops', label: 'DevOps', icon: '🚀' },
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== 섹션 제목 ========== */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">관심 분야를 선택하세요</h2>
          <p className="text-muted-foreground">다양한 IT 분야의 강의를 탐색해보세요</p>
        </div>

        {/* ========== 카테고리 그리드 ========== */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/lectures?category=${category.id}`}
              className="group p-6 bg-card hover:bg-card/80 border border-border hover:border-primary rounded-lg transition-all hover:shadow-lg hover:scale-105"
            >
              <div className="text-4xl mb-3 text-center">{category.icon}</div>
              <h3 className="font-semibold text-center text-sm text-foreground group-hover:text-primary transition-colors">
                {category.label}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
