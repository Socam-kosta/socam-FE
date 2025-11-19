'use client'

import { ChevronDown } from 'lucide-react'

export default function FilterBar() {
  return (
    <section className="py-8 bg-background border-b border-border sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== FILTER BAR TITLE ========== */}
        <h3 className="text-lg font-semibold mb-4">필터</h3>

        {/* ========== FILTER BUTTONS ========== */}
        <div className="flex flex-wrap gap-3 overflow-x-auto pb-2">
          {[
            { label: '추천', icon: '⭐' },
            { label: '찜', icon: '❤️' },
            { label: '검색', icon: '🔍' },
            { label: '카테고리', icon: '📂' },
            { label: '온/오프라인', icon: '📍' },
            { label: '지역', icon: '🗺️' },
            { label: '비용', icon: '💰' },
            { label: '기간', icon: '⏱️' },
            { label: '참여 시간', icon: '🕐' },
          ].map((filter, idx) => (
            <button
              key={idx}
              className="px-4 py-2 bg-card hover:bg-primary/10 border border-border hover:border-primary rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <span>{filter.icon}</span>
              {filter.label}
              <ChevronDown size={16} className="opacity-50" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
