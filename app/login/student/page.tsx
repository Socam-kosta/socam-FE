// ========== 학생 로그인 페이지 ==========
// 역할: 비회원만
// 기능: 학생 사용자 인증

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { loginUser } from '@/lib/api/user-login'

export default function StudentLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // ========== 로그인 처리 ==========
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요')
      return
    }

    setIsLoading(true)

    try {
      await loginUser(email, password)
      
      // 자동 로그인 처리
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberMe')
      }
      
      // 메인 페이지로 이동
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background py-12">
        <div className="container mx-auto px-4">
          {/* ========== 로그인 카드 ========== */}
          <Card className="mx-auto max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">학생 로그인</CardTitle>
              <CardDescription>SOCAM에 접속하세요</CardDescription>
            </CardHeader>

            <CardContent>
              {/* ========== 로그인 폼 ========== */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* ========== 이메일 입력 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="email">이메일 주소</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* ========== 패스워드 입력 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="password">패스워드</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* ========== 자동 로그인 체크박스 ========== */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    이 기기에서 자동 로그인
                  </Label>
                </div>

                {/* ========== 에러 메시지 ========== */}
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                {/* ========== 로그인 버튼 ========== */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? '로그인 중...' : '로그인'}
                </Button>
              </form>

              {/* ========== 하단 링크 ========== */}
              <div className="mt-6 space-y-4 text-center text-sm">
                <div className="flex justify-center gap-4 text-muted-foreground">
                  <Link href="#" className="hover:text-primary">
                    아이디 찾기
                  </Link>
                  <span>|</span>
                  <Link href="/user-reset-pw/request" className="hover:text-primary">
                    비밀번호 찾기
                  </Link>
                </div>

                <div>
                  <span className="text-muted-foreground">계정이 없으신가요? </span>
                  <Link href="/signup" className="font-medium text-primary hover:underline">
                    회원가입하기
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  )
}

