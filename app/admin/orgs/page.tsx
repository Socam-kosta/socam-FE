// ========== 기관 승인 관리 페이지 ==========
// 역할: 관리자만
// 기능: 기관 가입 승인/거절

'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2, CheckCircle, XCircle, FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// ========== 임시 기관 데이터 ==========
const pendingOrgs = [
  {
    id: 1,
    name: 'ABC학원',
    email: 'abc@company.com',
    contact: '02-1234-5678',
    manager: '홍길동',
    applicationDate: '2025-02-15',
    certificate: '/certificate.pdf',
  },
  {
    id: 2,
    name: 'XYZ교육센터',
    email: 'xyz@edu.com',
    contact: '02-9876-5432',
    manager: '김영희',
    applicationDate: '2025-02-18',
    certificate: '/certificate.pdf',
  },
]

export default function AdminOrgsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [selectedOrg, setSelectedOrg] = useState<typeof pendingOrgs[0] | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  // ========== 승인 처리 ==========
  const handleApprove = (orgId: number) => {
    console.log('[v0] Org approved:', orgId)
    alert('기관이 승인되었습니다')
  }

  // ========== 거절 처리 ==========
  const handleReject = (orgId: number, reason: string) => {
    console.log('[v0] Org rejected:', orgId, reason)
    alert('기관 승인이 거절되었습니다')
    setRejectReason('')
  }

  return (
    <>
      <Header />
      
      <main className="bg-background min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========== 페이지 헤더 ========== */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">기관 승인 관리</h1>
            <p className="text-muted-foreground">기관 가입 신청을 검토하세요</p>
          </div>

          {/* ========== 탭 네비게이션 ========== */}
          <div className="border-b border-border mb-8">
            <div className="flex gap-8">
              <button
                className={`pb-4 font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('pending')}
              >
                승인 대기
              </button>
              <button
                className={`pb-4 font-medium transition-colors ${
                  activeTab === 'approved'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('approved')}
              >
                승인됨
              </button>
              <button
                className={`pb-4 font-medium transition-colors ${
                  activeTab === 'rejected'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('rejected')}
              >
                거절됨
              </button>
            </div>
          </div>

          {/* ========== 승인 대기 기관 목록 ========== */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingOrgs.map((org) => (
                <Card key={org.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{org.name}</h3>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">이메일: </span>
                              <span>{org.email}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">연락처: </span>
                              <span>{org.contact}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">담당자: </span>
                              <span>{org.manager}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">신청일: </span>
                              <span>{org.applicationDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {/* ========== 상세보기 버튼 (재직증명서 보기) ========== */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => setSelectedOrg(org)}>
                              <FileText className="h-4 w-4 mr-2" />
                              상세
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{org.name} 상세 정보</DialogTitle>
                              <DialogDescription>기관 정보 및 재직증명서 확인</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>기관명</Label>
                                <Input value={org.name} disabled />
                              </div>
                              <div>
                                <Label>이메일</Label>
                                <Input value={org.email} disabled />
                              </div>
                              <div>
                                <Label>재직증명서</Label>
                                <Button variant="outline" className="w-full mt-2">
                                  재직증명서 보기
                                </Button>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button
                                  className="flex-1"
                                  onClick={() => handleApprove(org.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  승인
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="destructive" className="flex-1">
                                      <XCircle className="h-4 w-4 mr-2" />
                                      거절
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>기관 승인 거절</DialogTitle>
                                      <DialogDescription>거절 사유를 입력하세요</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <Textarea
                                        placeholder="거절 사유를 입력하세요"
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        rows={4}
                                      />
                                      <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => handleReject(org.id, rejectReason)}
                                      >
                                        거절 확인
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* ========== 승인됨/거절됨 탭 (빈 상태) ========== */}
          {(activeTab === 'approved' || activeTab === 'rejected') && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  {activeTab === 'approved' ? '승인된' : '거절된'} 기관이 없습니다
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
