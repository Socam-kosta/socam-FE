'use client'

import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const courses = [
  {
    id: 1,
    title: 'Node.js 백엔드 프로젝트',
    category: 'Backend',
    date: '10/30 개강 - 무료',
    duration: 'sprint',
    instructor: '에코잔 해킹',
    level: 'Intermediate',
    color: 'from-blue-500/20 to-blue-600/20',
  },
  {
    id: 2,
    title: '클라우드 풀스택 개발자 취업캠프',
    category: 'Fullstack',
    date: '11/20 개강 - 무료',
    duration: 'sprint',
    instructor: '에코잔 해킹',
    level: 'Intermediate',
    color: 'from-purple-500/20 to-pink-600/20',
  },
]

export default function FeaturedCourses() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">인기 있는 강의</h2>
            <p className="text-muted-foreground">지금 배우고 있는 인기 강의들을 살펴보세요</p>
          </div>
          <button className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            전체 보기 <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="border-border hover:border-primary/50 transition-all cursor-pointer group overflow-hidden">
              <div className={`h-32 bg-gradient-to-br ${course.color} relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-primary">{course.category}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{course.title}</h3>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">New</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{course.date}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{course.instructor}</span>
                  <span>{course.level}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
