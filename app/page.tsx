// ========== 메인 페이지 ==========
// 역할: 모든 사용자 (비회원/학생/기관/관리자)
// 기능: 플랫폼 소개, 베스트/신규 강의, 카테고리 소개

'use client'

import Header from '@/components/header'
import CategoryNavigation from '@/components/category-navigation'
import AdBannerCarousel from '@/components/ad-banner-carousel'
import Hero from '@/components/hero'
import CategorySection from '@/components/category-section'
import BestLectures from '@/components/best-lectures'
import NewLectures from '@/components/new-lectures'
import LatestNotices from '@/components/latest-notices'
import PlatformInfo from '@/components/platform-info'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* ========== 헤더 ========== */}
      <Header />

      {/* ========== 카테고리 네비게이션 바 (2번째 헤더) ========== */}
      <CategoryNavigation />

      {/* ========== 광고 배너 캐러셀 ========== */}
      <AdBannerCarousel />

      {/* ========== 히어로 배너 ========== */}
      <Hero />

      {/* ========== 카테고리 섹션 ========== */}
      <CategorySection />

      {/* ========== 베스트 강의 (평점순) ========== */}
      <BestLectures />

      {/* ========== 신규 강의 (최신순) ========== */}
      <NewLectures />

      {/* ========== 최신 공지사항 ========== */}
      <LatestNotices />

      {/* ========== 플랫폼 정보 섹션 ========== */}
      <PlatformInfo />

      {/* ========== 푸터 ========== */}
      <Footer />
    </main>
  )
}
