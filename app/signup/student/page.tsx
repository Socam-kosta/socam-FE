// ========== 학생 회원가입 페이지 ==========
// 역할: 비회원만
// 기능: 학생 계정 생성

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function StudentSignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    nickname: '',
    phone: '',
  })
  const [agreed, setAgreed] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  })

  // ========== 회원가입 처리 ==========
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreed.terms || !agreed.privacy) {
      alert('필수 약관에 동의해주세요')
      return
    }

    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다')
      return
    }

    // TODO: 실제 API 호출
    console.log('[v0] Student signup:', formData, agreed)
    alert('가입이 완료되었습니다')
    router.push('/login')
  }

  return (
    <>
      <Header />
      
      <main className="bg-background py-12">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">학생 회원가입</CardTitle>
              <CardDescription>SOCAM에서 강의를 탐색하고 리뷰를 작성하세요</CardDescription>
            </CardHeader>

            <CardContent>
              {/* ========== 회원가입 폼 ========== */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ========== 이메일 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="email">이메일 주소 *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="flex-1"
                    />
                    <Button type="button" variant="outline">
                      중복확인
                    </Button>
                  </div>
                </div>

                {/* ========== 패스워드 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="password">패스워드 *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="8자 이상, 영문+숫자+특수문자"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                {/* ========== 패스워드 확인 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="passwordConfirm">패스워드 확인 *</Label>
                  <Input
                    id="passwordConfirm"
                    type="password"
                    placeholder="패스워드를 다시 입력하세요"
                    value={formData.passwordConfirm}
                    onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                    required
                  />
                </div>

                {/* ========== 이름 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* ========== 닉네임 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="nickname">닉네임 *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="nickname"
                      type="text"
                      placeholder="커뮤니티에서 사용할 닉네임"
                      value={formData.nickname}
                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      required
                      className="flex-1"
                    />
                    <Button type="button" variant="outline">
                      중복확인
                    </Button>
                  </div>
                </div>

                {/* ========== 전화번호 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호 *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="010-1234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                {/* ========== 약관 동의 ========== */}
                <div className="space-y-3 rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreed.terms}
                      onCheckedChange={(checked) => setAgreed({ ...agreed, terms: checked as boolean })}
                    />
                    <Label htmlFor="terms" className="font-normal">
                      SOCAM 이용약관에 동의합니다 (필수)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="privacy"
                      checked={agreed.privacy}
                      onCheckedChange={(checked) => setAgreed({ ...agreed, privacy: checked as boolean })}
                    />
                    <Label htmlFor="privacy" className="font-normal">
                      개인정보처리방침에 동의합니다 (필수)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marketing"
                      checked={agreed.marketing}
                      onCheckedChange={(checked) => setAgreed({ ...agreed, marketing: checked as boolean })}
                    />
                    <Label htmlFor="marketing" className="font-normal">
                      마케팅 정보 수신에 동의합니다 (선택)
                    </Label>
                  </div>
                </div>

                {/* ========== 회원가입 버튼 ========== */}
                <Button type="submit" className="w-full" size="lg">
                  회원가입
                </Button>
              </form>

              {/* ========== 하단 링크 ========== */}
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
                <Link href="/login" className="font-medium text-primary hover:underline">
                  로그인하기
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  )
}
