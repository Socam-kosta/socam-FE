// ========== 기관 회원가입 페이지 ==========
// 역할: 비회원만
// 기능: 운영기관 계정 생성 및 승인 대기

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
import { Upload } from 'lucide-react'

export default function OrgSignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    orgName: '',
    contact: '',
    managerName: '',
  })
  const [certificate, setCertificate] = useState<File | null>(null)
  const [agreed, setAgreed] = useState({
    terms: false,
    privacy: false,
  })

  // ========== 파일 업로드 처리 ==========
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertificate(e.target.files[0])
    }
  }

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

    if (!certificate) {
      alert('재직증명서를 첨부해주세요')
      return
    }

    // TODO: 실제 API 호출
    console.log('[v0] Org signup:', formData, certificate, agreed)
    alert('기관 가입이 신청되었습니다. 관리자 검토 후 연락드리겠습니다')
    router.push('/login')
  }

  return (
    <>
      <Header />
      
      <main className="bg-background py-12">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">기관 회원가입</CardTitle>
              <CardDescription>강의를 등록하고 관리할 수 있습니다 (관리자 승인 필요)</CardDescription>
            </CardHeader>

            <CardContent>
              {/* ========== 회원가입 폼 ========== */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ========== 기관 이메일 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="email">기관 이메일 *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="org@company.com"
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

                {/* ========== 기관명 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="orgName">기관명 *</Label>
                  <Input
                    id="orgName"
                    type="text"
                    placeholder="ABC학원"
                    value={formData.orgName}
                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                    required
                  />
                </div>

                {/* ========== 연락처 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="contact">연락처 *</Label>
                  <Input
                    id="contact"
                    type="tel"
                    placeholder="02-1234-5678"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    required
                  />
                </div>

                {/* ========== 담당자명 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="managerName">담당자명 *</Label>
                  <Input
                    id="managerName"
                    type="text"
                    placeholder="홍길동"
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    required
                  />
                </div>

                {/* ========== 재직증명서 업로드 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="certificate">재직증명서 * (PDF, JPG, PNG만 가능, 최대 10MB)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="certificate"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById('certificate')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {certificate ? certificate.name : '파일 선택'}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    기업 재직증명서를 첨부해주세요. 승인 대기 기간은 3-5일입니다
                  </p>
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
                </div>

                {/* ========== 가입 신청 버튼 ========== */}
                <Button type="submit" className="w-full" size="lg">
                  가입 신청
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
