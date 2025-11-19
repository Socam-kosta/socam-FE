// ========== 헤더 컴포넌트 ==========
// 역할별 메뉴 표시: 비회원 / 학생 / 기관 / 관리자

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [userRole, setUserRole] = useState<'guest' | 'user' | 'org' | 'admin'>('guest')

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      {/* ========== 메인 헤더 바 ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ========== 좌측: 로고 + 네비게이션 메뉴 ========== */}
          <div className="flex items-center gap-8">
            {/* 로고 */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">SOCAM</span>
            </Link>

            {/* 데스크톱 네비게이션 메뉴 */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/lectures" className="text-sm font-medium hover:text-primary transition-colors">
                강의
              </Link>
              <Link href="/organizations" className="text-sm font-medium hover:text-primary transition-colors">
                교육기관
              </Link>
              <Link href="/notices" className="text-sm font-medium hover:text-primary transition-colors">
                공지사항
              </Link>
            </nav>
          </div>

          {/* ========== 검색 및 우측 액션 버튼 ========== */}
          <div className="hidden md:flex items-center gap-4">
            {/* ========== 검색 버튼 ========== */}
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>

            {/* ========== 역할별 사용자 메뉴 ========== */}
            {/* 비회원 */}
            {userRole === 'guest' && (
              <>
                <Link href="/login">
                  <Button variant="outline" className="text-sm">로그인</Button>
                </Link>
                <Link href="/signup">
                  <Button className="text-sm">회원가입</Button>
                </Link>
              </>
            )}

            {/* 학생 */}
            {userRole === 'user' && (
              <div className="flex items-center gap-2">
                <Link href="/mypage">
                  <Button variant="ghost" className="text-sm">마이페이지</Button>
                </Link>
                <Button variant="ghost" className="text-sm" onClick={() => setUserRole('guest')}>
                  로그아웃
                </Button>
              </div>
            )}

            {/* 기관 */}
            {userRole === 'org' && (
              <div className="flex items-center gap-2">
                <Link href="/org">
                  <Button variant="ghost" className="text-sm">기관관리</Button>
                </Link>
                <Button variant="ghost" className="text-sm" onClick={() => setUserRole('guest')}>
                  로그아웃
                </Button>
              </div>
            )}

            {/* 관리자 */}
            {userRole === 'admin' && (
              <div className="flex items-center gap-2">
                <Link href="/admin">
                  <Button variant="ghost" className="text-sm">관리자</Button>
                </Link>
                <Button variant="ghost" className="text-sm" onClick={() => setUserRole('guest')}>
                  로그아웃
                </Button>
              </div>
            )}
          </div>

          {/* ========== 모바일 메뉴 버튼 ========== */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ========== 모바일 네비게이션 메뉴 ========== */}
      {isOpen && (
        <nav className="md:hidden border-t border-border bg-card/50 pb-4 px-4 space-y-3">
          <Link href="/lectures" className="block text-sm hover:text-primary transition-colors py-2">강의</Link>
          <Link href="/organizations" className="block text-sm hover:text-primary transition-colors py-2">교육기관</Link>
          <Link href="/notices" className="block text-sm hover:text-primary transition-colors py-2">공지사항</Link>
          
          {/* ========== 모바일 인증 버튼 ========== */}
          {userRole === 'guest' && (
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full text-sm">로그인</Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button className="w-full text-sm">회원가입</Button>
              </Link>
            </div>
          )}

          {userRole === 'user' && (
            <>
              <Link href="/mypage">
                <Button variant="ghost" className="w-full justify-start">마이페이지</Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setUserRole('guest')}>
                로그아웃
              </Button>
            </>
          )}

          {userRole === 'org' && (
            <>
              <Link href="/org">
                <Button variant="ghost" className="w-full justify-start">기관관리</Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setUserRole('guest')}>
                로그아웃
              </Button>
            </>
          )}

          {userRole === 'admin' && (
            <>
              <Link href="/admin">
                <Button variant="ghost" className="w-full justify-start">관리자</Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setUserRole('guest')}>
                로그아웃
              </Button>
            </>
          )}
        </nav>
      )}
    </header>
  )
}
