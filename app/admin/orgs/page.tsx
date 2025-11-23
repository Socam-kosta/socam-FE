// ========== 기관 승인 관리 페이지 ==========
// 역할: 관리자만
// 기능: 기관 가입 승인/거절

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { getOrgList, updateOrgStatus, type OrgListItem } from '@/lib/api/admin'

export default function AdminOrgsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [orgs, setOrgs] = useState<OrgListItem[]>([])
  const [selectedOrg, setSelectedOrg] = useState<OrgListItem | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // ========== 기관 목록 로드 ==========
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        setIsLoading(true)
        const data = await getOrgList()
        console.log('기관 목록 데이터:', data)
        console.log('기관 목록 개수:', data.length)
        console.log('상태별 분류:', {
          PENDING: data.filter((org) => org.status === 'PENDING').length,
          APPROVED: data.filter((org) => org.status === 'APPROVED').length,
          REJECTED: data.filter((org) => org.status === 'REJECTED').length,
        })
        setOrgs(data)
      } catch (error) {
        console.error('기관 목록 로드 실패:', error)
        alert('기관 목록을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrgs()
  }, [])

  // ========== 탭별 필터링 ==========
  const filteredOrgs = orgs.filter((org) => {
    if (activeTab === 'pending') return org.status === 'PENDING'
    if (activeTab === 'approved') return org.status === 'APPROVED'
    if (activeTab === 'rejected') return org.status === 'REJECTED'
    return false
  })

  // 디버깅: 필터링 결과 확인
  useEffect(() => {
    console.log('현재 탭:', activeTab)
    console.log('전체 기관 수:', orgs.length)
    console.log('필터링된 기관 수:', filteredOrgs.length)
    console.log('필터링된 기관:', filteredOrgs)
  }, [activeTab, orgs, filteredOrgs])

  // ========== 승인 처리 ==========
  const handleApprove = async (email: string) => {
    if (!confirm('이 기관을 승인하시겠습니까?')) return

    try {
      setIsProcessing(true)
      await updateOrgStatus(email, 'APPROVED')
      alert('기관이 승인되었습니다')
      // 목록 새로고침
      const data = await getOrgList()
      setOrgs(data)
    } catch (error) {
      console.error('기관 승인 실패:', error)
      alert(error instanceof Error ? error.message : '기관 승인에 실패했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  // ========== 거절 처리 ==========
  const handleReject = async (email: string, reason: string) => {
    if (!reason.trim()) {
      alert('거절 사유를 입력해주세요')
      return
    }

    if (!confirm('이 기관을 거절하시겠습니까?')) return

    try {
      setIsProcessing(true)
      await updateOrgStatus(email, 'REJECTED', reason)
      alert('기관 승인이 거절되었습니다')
      setRejectReason('')
      // 목록 새로고침
      const data = await getOrgList()
      setOrgs(data)
    } catch (error) {
      console.error('기관 거절 실패:', error)
      alert(error instanceof Error ? error.message : '기관 거절에 실패했습니다.')
    } finally {
      setIsProcessing(false)
    }
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

          {/* ========== 기관 목록 ========== */}
          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">로딩 중...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrgs.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">
                      {activeTab === 'pending' && '승인 대기 중인 기관이 없습니다'}
                      {activeTab === 'approved' && '승인된 기관이 없습니다'}
                      {activeTab === 'rejected' && '거절된 기관이 없습니다'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredOrgs.map((org) => (
                  <Card key={org.email}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4 flex-1">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
                            <Building2 className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{org.orgName}</h3>
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
                                <span className="text-muted-foreground">상태: </span>
                                <span
                                  className={
                                    org.status === 'APPROVED'
                                      ? 'text-green-600'
                                      : org.status === 'REJECTED'
                                      ? 'text-red-600'
                                      : 'text-yellow-600'
                                  }
                                >
                                  {org.status === 'APPROVED'
                                    ? '승인됨'
                                    : org.status === 'REJECTED'
                                    ? '거절됨'
                                    : '대기 중'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {activeTab === 'pending' && (
                          <div className="flex gap-2 ml-4">
                            {/* ========== 상세보기 버튼 (재직증명서 보기) ========== */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  onClick={() => setSelectedOrg(org)}
                                  disabled={isProcessing}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  상세
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{org.orgName} 상세 정보</DialogTitle>
                                  <DialogDescription>
                                    기관 정보 및 재직증명서 확인
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>기관명</Label>
                                    <Input value={org.orgName} disabled />
                                  </div>
                                  <div>
                                    <Label>이메일</Label>
                                    <Input value={org.email} disabled />
                                  </div>
                                  <div>
                                    <Label>연락처</Label>
                                    <Input value={org.contact} disabled />
                                  </div>
                                  <div>
                                    <Label>재직증명서</Label>
                                    <Button
                                      variant="outline"
                                      className="w-full mt-2"
                                      onClick={() => window.open(org.certificatePath, '_blank')}
                                    >
                                      재직증명서 보기
                                    </Button>
                                  </div>
                                  <div className="flex gap-2 pt-4">
                                    <Button
                                      className="flex-1"
                                      onClick={() => handleApprove(org.email)}
                                      disabled={isProcessing}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      승인
                                    </Button>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="destructive"
                                          className="flex-1"
                                          disabled={isProcessing}
                                        >
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
                                            onClick={() => handleReject(org.email, rejectReason)}
                                            disabled={isProcessing}
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
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}
