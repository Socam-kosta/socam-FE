// ========== 푸터 컴포넌트 ==========
// 모든 페이지 공통

'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== 푸터 링크 섹션 ========== */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* ========== 바로가기 ========== */}
            <div>
              <h4 className="font-semibold mb-4">바로가기</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/lectures" className="hover:text-foreground transition-colors">강의</Link></li>
                <li><Link href="/organizations" className="hover:text-foreground transition-colors">교육기관</Link></li>
                <li><Link href="/notices" className="hover:text-foreground transition-colors">공지사항</Link></li>
              </ul>
            </div>

            {/* ========== 회사 정보 ========== */}
            <div>
              <h4 className="font-semibold mb-4">SOCAM</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>소프트웨어캠퍼스</li>
                <li>정부지원 IT 교육 플랫폼</li>
              </ul>
            </div>

            {/* ========== 고객지원 ========== */}
            <div>
              <h4 className="font-semibold mb-4">고객지원</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/notices" className="hover:text-foreground transition-colors">문의사항</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* ========== 연락처 ========== */}
            <div>
              <h4 className="font-semibold mb-4">연락처</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>고객센터: 1588-0000</li>
                <li>이메일: info@socam.kr</li>
                <li>평일 09:00 - 18:00</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========== 법적 고지 및 저작권 섹션 ========== */}
        <div className="border-t border-border py-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center text-sm text-muted-foreground">
            <p>Copyright 2025 SOCAM. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-foreground transition-colors">개인정보처리방침</Link>
              <span className="text-border">/</span>
              <Link href="#" className="hover:text-foreground transition-colors">서비스약관</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
