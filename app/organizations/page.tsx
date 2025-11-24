// ========== 교육기관 목록 페이지 ==========
// 역할: 모든 사용자
// 기능: 교육기관 조회

'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { getApprovedOrganizations, getOrgLectureCount } from '@/lib/api/organization'
import { getAllApprovedLectures } from '@/lib/api/lecture'

interface Organization {
  email: string
  orgName: string
  contact: string
  status: string
  lectureCount?: number
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setIsLoading(true)
        const orgs = await getApprovedOrganizations()
        
        // 각 기관의 강의 수 계산
        const orgsWithLectureCount = await Promise.all(
          orgs.map(async (org) => {
            const lectureCount = await getOrgLectureCount(org.orgName)
            return { ...org, lectureCount }
          })
        )

        setOrganizations(orgsWithLectureCount)
      } catch (error) {
        console.error('기관 목록 로드 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganizations()
  }, [])

  return (
    <>
      <Header />
      
      <main className="bg-background min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========== 페이지 헤더 ========== */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">교육기관</h1>
            <p className="text-muted-foreground">검증된 교육기관들을 만나보세요</p>
          </div>

          {/* ========== 로딩 상태 ========== */}
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">기관 목록을 불러오는 중...</p>
            </div>
          )}

          {/* ========== 기관이 없을 때 ========== */}
          {!isLoading && organizations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">등록된 교육기관이 없습니다.</p>
            </div>
          )}

          {/* ========== 기관 그리드 ========== */}
          {!isLoading && organizations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <Card key={org.email} className="hover:border-primary transition-all">
                  <CardContent className="p-6">
                    {/* ========== 기관 아이콘 ========== */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{org.orgName}</h3>
                        {org.contact && (
                          <p className="text-xs text-muted-foreground">{org.contact}</p>
                        )}
                      </div>
                    </div>

                    {/* ========== 강의 수 ========== */}
                    <div className="flex items-center gap-2 text-sm mb-4">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{org.lectureCount || 0}개 강의</span>
                    </div>

                    {/* ========== 강의 보기 버튼 ========== */}
                    <Link href={`/lectures?org=${encodeURIComponent(org.orgName)}`}>
                      <Button variant="outline" className="w-full">
                        강의 보기
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
