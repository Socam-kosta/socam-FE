// ========== 플랫폼 정보 섹션 컴포넌트 ==========
// SOCAM을 선택하는 이유 3가지

'use client'

import { GraduationCap, Users, Briefcase } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: GraduationCap,
    title: '정부지원',
    description: '국정교과과정 기반 정부지원 교육',
  },
  {
    icon: Users,
    title: '경험 많은 강사진',
    description: '현직 개발자, 기술리더들의 실무 교육',
  },
  {
    icon: Briefcase,
    title: '취업연계',
    description: '수료 후 취업기회 및 경력개발 지원',
  },
]

export default function PlatformInfo() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== 섹션 제목 ========== */}
        <h2 className="mb-12 text-center text-3xl font-bold">SOCAM을 선택하는 이유</h2>

        {/* ========== 정보 카드 그리드 ========== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="text-center border-border hover:border-primary transition-all">
                <CardContent className="p-6">
                  {/* ========== 아이콘 ========== */}
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>

                  {/* ========== 제목 ========== */}
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>

                  {/* ========== 설명 ========== */}
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
