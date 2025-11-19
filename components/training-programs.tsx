'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

const programs = [
  {
    id: 1,
    title: '쇼핑몰 프로젝트 코딩',
    subtitle: '실무 중심 웹 개발',
    category: 'Frontend',
    price: '₩99,000',
    image: 'from-amber-500/20 to-orange-600/20',
  },
  {
    id: 2,
    title: 'JAVA, React 풀스택 개발자 + 디지털 신기술',
    subtitle: '풀스택 개발 마스터',
    category: 'Full Stack',
    price: '₩249,000',
    image: 'from-slate-500/20 to-slate-700/20',
  },
  {
    id: 3,
    title: 'After 부트캠프, 비즈니스 리더로 탑업',
    subtitle: '커리어 성장 프로그램',
    category: 'Career',
    price: '₩149,000',
    image: 'from-pink-500/20 to-rose-600/20',
  },
  {
    id: 4,
    title: '한국정보기술협회',
    subtitle: '사이코(CISCO) 보안 아카데미 4기',
    category: 'Security',
    price: '무료',
    image: 'from-cyan-500/20 to-blue-600/20',
  },
]

export default function TrainingPrograms() {
  return (
    <section className="py-16 md:py-24 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">확실한 기관 정보와 함께 신뢰도 높은 교육을 선택할 수 있어요.</h2>
            <p className="text-muted-foreground">다양한 교육 프로그램을 비교하고 찾아보세요</p>
          </div>
          <button className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            전체 보기 <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((program) => (
            <Card key={program.id} className="border-border hover:border-primary/50 transition-all cursor-pointer group overflow-hidden">
              <div className={`h-40 bg-gradient-to-br ${program.image}`}></div>
              <CardContent className="p-6">
                <p className="text-xs text-primary mb-2 font-semibold">{program.category}</p>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{program.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{program.subtitle}</p>
                <p className="text-lg font-bold text-primary">{program.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
