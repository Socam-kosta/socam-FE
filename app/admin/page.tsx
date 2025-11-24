// ========== 관리자 대시보드 ==========
// 역할: 관리자만
// 기능: 플랫폼 전체 통계 및 승인 대기 현황

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, BookOpen, MessageSquare, Bell } from "lucide-react";
import Link from "next/link";
import {
  getOrgList,
  getPendingLectures,
  getLecturesByStatus,
  getReviewList,
  getNoticeList,
  type OrgListItem,
  type LectureListItem,
} from "@/lib/api/admin";

interface Stats {
  totalOrgs: number;
  pendingOrgs: number;
  approvedOrgs: number;
  rejectedOrgs: number;
  totalLectures: number;
  pendingLectures: number;
  approvedLectures: number;
  rejectedLectures: number;
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  totalNotices: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalOrgs: 0,
    pendingOrgs: 0,
    approvedOrgs: 0,
    rejectedOrgs: 0,
    totalLectures: 0,
    pendingLectures: 0,
    approvedLectures: 0,
    rejectedLectures: 0,
    totalReviews: 0,
    pendingReviews: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    totalNotices: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // ========== 어드민 인증 체크 ==========
  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminToken = sessionStorage.getItem("adminAccessToken");
      if (!adminToken) {
        // 인증되지 않았으면 로그인 페이지로 리다이렉트
        router.push("/admin/login");
      }
    }
  }, [router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // 모든 데이터를 병렬로 가져오기
        const [orgs, pendingLectures, approvedLectures, rejectedLectures, reviews, notices] = await Promise.all([
          getOrgList(),
          getPendingLectures(),
          getLecturesByStatus("APPROVED").catch(() => []),
          getLecturesByStatus("REJECTED").catch(() => []),
          getReviewList(),
          getNoticeList().catch(() => []),
        ]);

        const pendingOrgs = orgs.filter((org) => org.status === "PENDING").length;
        const approvedOrgs = orgs.filter((org) => org.status === "APPROVED").length;
        const rejectedOrgs = orgs.filter((org) => org.status === "REJECTED").length;
        
        const pendingReviews = reviews.filter((review) => review.status === "PENDING").length;
        const approvedReviews = reviews.filter((review) => review.status === "APPROVED").length;
        const rejectedReviews = reviews.filter((review) => review.status === "REJECTED").length;

        const totalLectures = pendingLectures.length + approvedLectures.length + rejectedLectures.length;

        setStats({
          totalOrgs: orgs.length,
          pendingOrgs,
          approvedOrgs,
          rejectedOrgs,
          totalLectures,
          pendingLectures: pendingLectures.length,
          approvedLectures: approvedLectures.length,
          rejectedLectures: rejectedLectures.length,
          totalReviews: reviews.length,
          pendingReviews,
          approvedReviews,
          rejectedReviews,
          totalNotices: notices.length,
        });
      } catch (error) {
        console.error("통계 데이터 로드 실패:", error);
        // 사용자에게 더 명확한 에러 메시지 표시
        if (error instanceof Error) {
          // 로그인 필요 에러는 로그인 페이지로 리다이렉트
          if (error.message.includes("로그인이 필요합니다")) {
            console.warn("로그인이 필요합니다. 관리자로 로그인해주세요.");
            router.push("/admin/login");
          } else {
            alert(error.message);
          }
        } else {
          alert(
            "데이터를 불러오는데 실패했습니다. 백엔드 서버가 실행 중인지 확인해주세요."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);
  return (
    <>
      <Header />

      <main className="bg-background min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========== 페이지 헤더 ========== */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">관리자 대시보드</h1>
            <p className="text-muted-foreground">SOCAM 플랫폼 현황</p>
          </div>

          {/* ========== 주요 통계 카드 (4개) ========== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 기관 통계 */}
            <Card className="hover:shadow-lg transition-all border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <Link href="/admin/orgs">
                    <Button variant="ghost" size="sm" className="text-xs">
                      관리
                    </Button>
                  </Link>
                </div>
                <h3 className="text-3xl font-bold mb-2 text-gray-900">
                  {isLoading ? "..." : stats.totalOrgs}
                </h3>
                <p className="text-sm font-medium text-gray-700 mb-3">등록 기관</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">승인 대기</span>
                    <span className="font-semibold text-yellow-600">{stats.pendingOrgs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">승인됨</span>
                    <span className="font-semibold text-green-600">{stats.approvedOrgs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">거절됨</span>
                    <span className="font-semibold text-red-600">{stats.rejectedOrgs}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 강의 통계 */}
            <Card className="hover:shadow-lg transition-all border-l-4 border-l-green-500 bg-gradient-to-br from-white to-green-50/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <Link href="/admin/lectures">
                    <Button variant="ghost" size="sm" className="text-xs">
                      관리
                    </Button>
                  </Link>
                </div>
                <h3 className="text-3xl font-bold mb-2 text-gray-900">
                  {isLoading ? "..." : stats.totalLectures}
                </h3>
                <p className="text-sm font-medium text-gray-700 mb-3">전체 강의</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">승인 대기</span>
                    <span className="font-semibold text-yellow-600">{stats.pendingLectures}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">승인됨</span>
                    <span className="font-semibold text-green-600">{stats.approvedLectures}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">거절됨</span>
                    <span className="font-semibold text-red-600">{stats.rejectedLectures}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 리뷰 통계 */}
            <Card className="hover:shadow-lg transition-all border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <Link href="/admin/reviews">
                    <Button variant="ghost" size="sm" className="text-xs">
                      관리
                    </Button>
                  </Link>
                </div>
                <h3 className="text-3xl font-bold mb-2 text-gray-900">
                  {isLoading ? "..." : stats.totalReviews}
                </h3>
                <p className="text-sm font-medium text-gray-700 mb-3">전체 리뷰</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">승인 대기</span>
                    <span className="font-semibold text-yellow-600">{stats.pendingReviews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">승인됨</span>
                    <span className="font-semibold text-green-600">{stats.approvedReviews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">거절됨</span>
                    <span className="font-semibold text-red-600">{stats.rejectedReviews}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 공지사항 통계 */}
            <Card className="hover:shadow-lg transition-all border-l-4 border-l-orange-500 bg-gradient-to-br from-white to-orange-50/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                    <Bell className="h-6 w-6 text-orange-600" />
                  </div>
                  <Link href="/admin/notices">
                    <Button variant="ghost" size="sm" className="text-xs">
                      관리
                    </Button>
                  </Link>
                </div>
                <h3 className="text-3xl font-bold mb-2 text-gray-900">
                  {isLoading ? "..." : stats.totalNotices}
                </h3>
                <p className="text-sm font-medium text-gray-700 mb-3">공지사항</p>
                <Link href="/admin/notices/new">
                  <Button variant="outline" size="sm" className="w-full bg-white hover:bg-gray-50">
                    작성하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* ========== 승인 대기 현황 섹션 ========== */}
          <Card className="bg-gradient-to-br from-gray-50 to-white border border-gray-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">승인 대기 현황</h2>
              <div className="space-y-3">
                {/* 기관 승인 대기 */}
                <Link href="/admin/orgs?status=pending">
                  <div className="flex items-center justify-between p-5 rounded-lg border border-gray-200 bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">기관 승인 대기</h3>
                        <p className="text-sm text-gray-500">
                          신규 기관 가입 요청
                        </p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      {isLoading ? "..." : stats.pendingOrgs}
                    </div>
                  </div>
                </Link>

                {/* 강의 승인 대기 */}
                <Link href="/admin/lectures?status=pending">
                  <div className="flex items-center justify-between p-5 rounded-lg border border-gray-200 bg-white hover:border-green-400 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                        <BookOpen className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">강의 승인 대기</h3>
                        <p className="text-sm text-gray-500">
                          신규 강의 등록 요청
                        </p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {isLoading ? "..." : stats.pendingLectures}
                    </div>
                  </div>
                </Link>

                {/* 리뷰 승인 대기 */}
                <Link href="/admin/reviews?status=pending">
                  <div className="flex items-center justify-between p-5 rounded-lg border border-gray-200 bg-white hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                        <MessageSquare className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">리뷰 승인 대기</h3>
                        <p className="text-sm text-gray-500">
                          검토가 필요한 리뷰
                        </p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-purple-600">
                      {isLoading ? "..." : stats.pendingReviews}
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
