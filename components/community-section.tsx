'use client'

import { ArrowRight } from 'lucide-react'

export default function CommunitySection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">다양한 교육비 지원을 모아봤어요.</h2>
            <p className="text-muted-foreground">정부 지원, 기업 연계, 장학금 등 다양한 지원 프로그램</p>
          </div>
          <button className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            전체 보기 <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: '국가 지원금', desc: '국비 지원 교육', icon: '💰' },
            { title: '기업 연계', desc: '기업 채용 연계', icon: '🏢' },
            { title: '장학금', desc: '우수자 장학금', icon: '🎓' },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
