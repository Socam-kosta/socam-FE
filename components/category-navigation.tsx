// ========== 카테고리 네비게이션 바 ==========
// 위치: 메인 헤더 바로 아래
// 기능: 강의 카테고리별 필터링 (전체, 프론트엔드, 백엔드 등)
// BootTent 스타일의 2번째 헤더

'use client'

import Link from 'next/link'
import { Code, Smartphone, Database, Cloud, Lock, Palette, Briefcase, Box, Layers } from 'lucide-react'

// ========== 카테고리 데이터 ==========
const categories = [
  { id: 'all', name: '전체', icon: Box, href: '/lectures' },
  { id: 'frontend', name: '프론트엔드', icon: Code, href: '/lectures?category=frontend' },
  { id: 'backend', name: '백엔드', icon: Database, href: '/lectures?category=backend' },
  { id: 'fullstack', name: '풀스택', icon: Code, href: '/lectures?category=fullstack' },
  { id: 'mobile', name: '모바일', icon: Smartphone, href: '/lectures?category=mobile' },
  { id: 'data-ai', name: 'AI/데이터', icon: Database, href: '/lectures?category=data-ai' },
  { id: 'cloud', name: '클라우드', icon: Cloud, href: '/lectures?category=cloud' },
  { id: 'security', name: '보안', icon: Lock, href: '/lectures?category=security' },
  { id: 'devops', name: 'DevOps', icon: Layers, href: '/lectures?category=devops' },
  { id: 'planning', name: '기획/마케팅', icon: Briefcase, href: '/lectures?category=planning' },
]

export default function CategoryNavigation() {
  return (
    // ========== 카테고리 네비게이션 컨테이너 ==========
    // Sticky 옵션: sticky top-16 (메인 헤더 높이만큼 top 설정)
    <nav className="bg-card border-b border-border sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4">
        {/* ========== 카테고리 버튼 리스트 (가로 스크롤 가능) ========== */}
        <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.id}
                href={category.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg 
                         text-sm font-medium whitespace-nowrap
                         hover:bg-accent hover:text-accent-foreground 
                         transition-all duration-200
                         group"
              >
                <Icon className="w-4 h-4 text-current transition-colors" />
                <span>{category.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
