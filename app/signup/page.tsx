// ========== 회원가입 선택 페이지 ==========
// 역할: 비회원만
// 기능: 학생 또는 기관 가입 선택

'use client'

import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Building2 } from 'lucide-react'

export default function SignupPage() {
  return (
    <>
      <Header />
      
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background py-12">
        <div className="container mx-auto px-4">
          {/* ========== 페이지 제목 ========== */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">회원가입</h1>
            <p className="mt-2 text-muted-foreground">가입 유형을 선택해주세요</p>
          </div>

          {/* ========== 가입 유형 선택 카드 ========== */}
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
            {/* ========== 학생 가입 카드 ========== */}
            <Link href="/signup/student">
              <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-lg h-full">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle>학생으로 가입</CardTitle>
                  <CardDescription>
                    강의를 탐색하고 수강 후 리뷰를 작성할 수 있습니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    학생 가입하기
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* ========== 기관 가입 카드 ========== */}
            <Link href="/signup/org">
              <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-lg h-full">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10 transition-colors group-hover:bg-secondary/20">
                    <Building2 className="h-10 w-10 text-secondary" />
                  </div>
                  <CardTitle>기관으로 가입</CardTitle>
                  <CardDescription>
                    강의를 등록하고 관리할 수 있습니다 (승인 필요)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    기관 가입하기
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* ========== 로그인 링크 ========== */}
          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
            <Link href="/login" className="font-medium text-primary hover:underline">
              로그인하기
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
