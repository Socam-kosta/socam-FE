// ========== 공지사항 상세 페이지 ==========
// 역할: 모든 사용자
// 기능: 공지사항 상세 조회, 이전/다음 공지사항 네비게이션

"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Calendar, ChevronLeft, ChevronRight, List } from "lucide-react";
import {
  getPublicNoticeDetail,
  getPublicNotices,
  incrementNoticeViewCount,
  type NoticeResponseDto,
} from "@/lib/api/notice";

export default function NoticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const noticeId = params?.id ? Number(params.id) : null;

  const [notice, setNotice] = useState<NoticeResponseDto | null>(null);
  const [allNotices, setAllNotices] = useState<NoticeResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [prevNotice, setPrevNotice] = useState<NoticeResponseDto | null>(null);
  const [nextNotice, setNextNotice] = useState<NoticeResponseDto | null>(null);

  // 조회수 증가가 이미 실행되었는지 추적 (같은 세션에서 중복 방지)
  const hasIncrementedView = useRef<Set<number>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      if (!noticeId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // 공지사항 상세 조회 및 전체 목록 조회를 병렬로 처리
        const [detail, list] = await Promise.all([
          getPublicNoticeDetail(noticeId),
          getPublicNotices(),
        ]);

        // 조회수 증가는 한 번만 실행 (같은 noticeId에 대해)
        if (!hasIncrementedView.current.has(noticeId)) {
          hasIncrementedView.current.add(noticeId);
          // 조회수 증가 (비동기, 실패해도 계속 진행)
          incrementNoticeViewCount(noticeId).then(() => {
            // 조회수 증가 후 최신 정보 다시 가져오기
            getPublicNoticeDetail(noticeId).then((updatedDetail) => {
              if (updatedDetail) {
                setNotice(updatedDetail);
              }
            });
          });
        }

        if (!detail) {
          // 공지사항이 없으면 목록으로 리다이렉트
          router.push("/notices");
          return;
        }

        setNotice(detail);

        // 최신순 정렬
        const sorted = list.sort((a, b) => {
          const dateA = new Date(a.regDate).getTime();
          const dateB = new Date(b.regDate).getTime();
          return dateB - dateA;
        });
        setAllNotices(sorted);

        // 현재 공지사항의 인덱스 찾기
        const currentIndex = sorted.findIndex((n) => n.noticeId === noticeId);

        // 이전 공지사항 (더 최신)
        if (currentIndex > 0) {
          setPrevNotice(sorted[currentIndex - 1]);
        } else {
          setPrevNotice(null);
        }

        // 다음 공지사항 (더 오래됨)
        if (currentIndex < sorted.length - 1) {
          setNextNotice(sorted[currentIndex + 1]);
        } else {
          setNextNotice(null);
        }
      } catch (error) {
        console.error("공지사항 로드 실패:", error);
        router.push("/notices");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // cleanup: noticeId가 변경될 때 이전 noticeId를 추적에서 제거하지 않음 (같은 페이지 재방문 방지)
    return () => {
      // cleanup 함수는 필요 없지만, noticeId 변경 시 새로운 공지사항에 대해 조회수 증가 가능하도록 함
    };
  }, [noticeId, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="bg-background min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p className="text-muted-foreground">공지사항을 불러오는 중...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!notice) {
    return null;
  }

  return (
    <>
      <Header />

      <main className="bg-background min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========== 공지사항 상세 ========== */}
          <Card>
            <CardContent className="p-8">
              {/* ========== 헤더 ========== */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    공지
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-4">{notice.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateTime(notice.regDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{notice.viewCount || 0}</span>
                  </div>
                </div>
              </div>

              {/* ========== 구분선 ========== */}
              <div className="border-t border-border mb-6"></div>

              {/* ========== 내용 ========== */}
              <div className="prose max-w-none mb-8">
                <div className="whitespace-pre-wrap text-foreground">
                  {notice.contents}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ========== 네비게이션 버튼 ========== */}
          <div className="flex items-stretch justify-between mt-8 gap-4">
            {/* ========== 왼쪽: 이전/다음 공지사항 버튼 ========== */}
            <div className="flex items-stretch gap-4 flex-1">
              {/* 이전 공지사항 */}
              {prevNotice ? (
                <Button
                  variant="outline"
                  className="flex-1 justify-start h-auto py-3 px-4"
                  onClick={() => router.push(`/notices/${prevNotice.noticeId}`)}
                >
                  <ChevronLeft className="h-4 w-4 mr-3 flex-shrink-0" />
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground mb-1">
                      이전 공지사항
                    </div>
                    <div className="font-medium truncate text-sm">
                      {prevNotice.title}
                    </div>
                  </div>
                </Button>
              ) : (
                <div className="flex-1"></div>
              )}

              {/* 다음 공지사항 */}
              {nextNotice ? (
                <Button
                  variant="outline"
                  className="flex-1 justify-end h-auto py-3 px-4"
                  onClick={() => router.push(`/notices/${nextNotice.noticeId}`)}
                >
                  <div className="text-right flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground mb-1">
                      다음 공지사항
                    </div>
                    <div className="font-medium truncate text-sm">
                      {nextNotice.title}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-3 flex-shrink-0" />
                </Button>
              ) : (
                <div className="flex-1"></div>
              )}
            </div>

            {/* ========== 오른쪽: 목록 버튼 ========== */}
            <Button
              variant="outline"
              onClick={() => router.push("/notices")}
              className="h-auto py-3 px-4 min-w-[120px]"
            >
              <List className="h-4 w-4 mr-2" />
              목록
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
