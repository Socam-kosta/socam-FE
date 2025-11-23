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
  getReviewList,
  getNoticeList,
} from "@/lib/api/admin";

interface Stats {
  totalOrgs: number;
  pendingOrgs: number;
  totalLectures: number;
  pendingLectures: number;
  totalReviews: number;
  pendingReviews: number;
  totalNotices: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalOrgs: 0,
    pendingOrgs: 0,
    totalLectures: 0,
    pendingLectures: 0,
    totalReviews: 0,
    pendingReviews: 0,
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
        // 디버깅: API 호출 전 확인
        console.log("통계 데이터 로드 시작...");

        const [orgs, lectures, reviews, notices] = await Promise.all([
          getOrgList(),
          getPendingLectures(),
          getReviewList(),
          getNoticeList().catch(() => []), // 공지사항 API 실패 시 빈 배열
        ]);

        const pendingOrgs = orgs.filter(
          (org) => org.status === "PENDING"
        ).length;
        const approvedOrgs = orgs.filter(
          (org) => org.status === "APPROVED"
        ).length;
        const pendingReviews = reviews.filter(
          (review) => review.status === "PENDING"
        ).length;

        setStats({
          totalOrgs: orgs.length,
          pendingOrgs,
          totalLectures: lectures.length,
          pendingLectures: lectures.length,
          totalReviews: reviews.length,
          pendingReviews,
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
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <Link href="/admin/orgs">
                    <Button variant="ghost" size="sm">
                      관리
                    </Button>
                  </Link>
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {isLoading ? "..." : `${stats.totalOrgs}개`}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">등록 기관</p>
                <p className="text-xs text-yellow-600">
                  승인 대기: {isLoading ? "..." : `${stats.pendingOrgs}개`}
                </p>
              </CardContent>
            </Card>

            {/* 강의 통계 */}
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <Link href="/admin/lectures">
                    <Button variant="ghost" size="sm">
                      관리
                    </Button>
                  </Link>
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {isLoading ? "..." : `${stats.totalLectures}개`}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">전체 강의</p>
                <p className="text-xs text-yellow-600">
                  승인 대기: {isLoading ? "..." : `${stats.pendingLectures}개`}
                </p>
              </CardContent>
            </Card>

            {/* 리뷰 통계 */}
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <Link href="/admin/reviews">
                    <Button variant="ghost" size="sm">
                      관리
                    </Button>
                  </Link>
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {isLoading ? "..." : `${stats.totalReviews}개`}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">전체 리뷰</p>
                <p className="text-xs text-yellow-600">
                  승인 대기: {isLoading ? "..." : `${stats.pendingReviews}개`}
                </p>
              </CardContent>
            </Card>

            {/* 공지사항 통계 */}
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <Bell className="h-6 w-6 text-orange-600" />
                  </div>
                  <Link href="/admin/notices">
                    <Button variant="ghost" size="sm">
                      관리
                    </Button>
                  </Link>
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {isLoading ? "..." : `${stats.totalNotices}개`}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">공지사항</p>
                <Link href="/admin/notices/new">
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    작성하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* ========== 승인 대기 현황 섹션 ========== */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">승인 대기 현황</h2>
              <div className="space-y-4">
                {/* 기관 승인 대기 */}
                <Link href="/admin/orgs?status=pending">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">기관 승인 대기</h3>
                        <p className="text-sm text-muted-foreground">
                          신규 기관 가입 요청
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {isLoading ? "..." : stats.pendingOrgs}
                    </div>
                  </div>
                </Link>

                {/* 강의 승인 대기 */}
                <Link href="/admin/lectures?status=pending">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <BookOpen className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">강의 승인 대기</h3>
                        <p className="text-sm text-muted-foreground">
                          신규 강의 등록 요청
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {isLoading ? "..." : stats.pendingLectures}
                    </div>
                  </div>
                </Link>

                {/* 리뷰 승인 대기 */}
                <Link href="/admin/reviews?status=pending">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">리뷰 승인 대기</h3>
                        <p className="text-sm text-muted-foreground">
                          검토가 필요한 리뷰
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
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
