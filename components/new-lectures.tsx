// ========== 신규 강의 섹션 컴포넌트 ==========
// 최신 등록된 강의 그리드

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getAllApprovedLectures,
  type LectureResponseDto,
} from "@/lib/api/lecture";
import { getLectureAverageRating } from "@/lib/api/review";
import { addWishlist, removeWishlist, getWishlist } from "@/lib/api/wishlist";
import { getValidToken } from "@/lib/auth-utils";

// ========== 강의 데이터 타입 (평점 및 찜 상태 포함) ==========
interface LectureWithRating extends LectureResponseDto {
  rating: number;
  reviewCount: number;
  isWishlisted?: boolean;
}

export default function NewLectures() {
  const router = useRouter();
  const [lectures, setLectures] = useState<LectureWithRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ========== 로그인 상태 확인 ==========
  const getCurrentUserEmail = (): string | null => {
    if (typeof window === "undefined") return null;
    const userType = localStorage.getItem("userType")?.toLowerCase();
    if (userType === "user") {
      return localStorage.getItem("userEmail");
    }
    return null;
  };

  // ========== 강의 데이터 및 평점 로드 ==========
  useEffect(() => {
    const loadNewLectures = async () => {
      try {
        setIsLoading(true);
        const allLectures = await getAllApprovedLectures();
        const userEmail = getCurrentUserEmail();
        
        // 토큰이 없으면 찜 상태를 확인하지 않음
        const token = typeof window !== "undefined" ? getValidToken() : null;
        if (!token) {
          // 토큰이 없으면 모든 강의의 찜 상태를 false로 설정
          const sortedLectures = [...allLectures]
            .sort((a, b) => b.id - a.id)
            .slice(0, 8);
          
          const lecturesWithRating = await Promise.all(
            sortedLectures.map(async (lecture) => {
              const ratingInfo = await getLectureAverageRating(lecture.id);
              return {
                ...lecture,
                rating: ratingInfo.average,
                reviewCount: ratingInfo.count,
                isWishlisted: false,
              };
            })
          );
          
          setLectures(lecturesWithRating);
          return;
        }

        // 최신순으로 정렬 (id가 큰 순서 = 최신)
        const sortedLectures = [...allLectures]
          .sort((a, b) => b.id - a.id)
          .slice(0, 8); // 최신 8개

        // 찜 목록을 한 번만 가져오기 (로그인한 사용자인 경우)
        let wishlistIds: Set<number> = new Set();
        if (userEmail && token) {
          try {
            const wishlist = await getWishlist(userEmail);
            wishlistIds = new Set(wishlist.map((item) => item.lecture.id));
          } catch (error) {
            // 인증 오류인 경우 조용히 처리 (에러 로그 출력 안 함)
            wishlistIds = new Set();
          }
        }

        // 각 강의의 평점 정보 및 찜 상태 가져오기
        const lecturesWithRating = await Promise.all(
          sortedLectures.map(async (lecture) => {
            const ratingInfo = await getLectureAverageRating(lecture.id);
            const isWishlisted = wishlistIds.has(lecture.id);

            return {
              ...lecture,
              rating: ratingInfo.average,
              reviewCount: ratingInfo.count,
              isWishlisted,
            };
          })
        );

        setLectures(lecturesWithRating);
      } catch (error) {
        console.error("신규 강의 로드 실패:", error);
        setLectures([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNewLectures();
  }, []);

  // ========== 찜하기 토글 ==========
  const handleWishlistToggle = async (
    e: React.MouseEvent,
    lectureId: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const userEmail = getCurrentUserEmail();
    if (!userEmail) {
      alert("로그인이 필요합니다.");
      router.push("/login/student");
      return;
    }

    const token = getValidToken();
    if (!token) {
      alert("로그인이 필요합니다. 다시 로그인해주세요.");
      router.push("/login/student");
      return;
    }

    try {
      const lecture = lectures.find((l) => l.id === lectureId);
      if (!lecture) return;

      if (lecture.isWishlisted) {
        // 찜 취소
        await removeWishlist(userEmail, lectureId);
        setLectures((prev) =>
          prev.map((l) =>
            l.id === lectureId ? { ...l, isWishlisted: false } : l
          )
        );
      } else {
        // 찜하기
        await addWishlist(userEmail, lectureId);
        setLectures((prev) =>
          prev.map((l) =>
            l.id === lectureId ? { ...l, isWishlisted: true } : l
          )
        );
      }
    } catch (error) {
      console.error("찜하기 처리 실패:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "찜하기 처리 중 오류가 발생했습니다.";

      if (errorMessage.includes("인증") || errorMessage.includes("권한")) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        router.push("/login/student");
      } else {
        alert(errorMessage);
      }
    }
  };

  // ========== 로딩 중 ==========
  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">신규 강의</h2>
            <p className="text-muted-foreground">최근에 등록된 강의들</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-full">
                <div className="aspect-video bg-muted animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ========== 강의가 없을 때 ==========
  if (lectures.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== 섹션 제목 ========== */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">신규 강의</h2>
          <p className="text-muted-foreground">최근에 등록된 강의들</p>
        </div>

        {/* ========== 강의 그리드 ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lectures.map((lecture) => (
            <Link key={lecture.id} href={`/lectures/${lecture.id}`}>
              <Card className="group overflow-hidden hover:border-primary transition-all h-full">
                {/* ========== 강의 이미지 ========== */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={lecture.imageUrl || "/placeholder.svg"}
                    alt={lecture.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  {/* ========== 찜 아이콘 ========== */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute right-2 top-2 bg-background/80 hover:bg-background ${
                      lecture.isWishlisted ? "text-red-500" : ""
                    }`}
                    onClick={(e) => handleWishlistToggle(e, lecture.id)}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        lecture.isWishlisted ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                </div>

                <CardContent className="p-4">
                  {/* ========== 강의명 ========== */}
                  <h3 className="mb-2 font-semibold line-clamp-1">
                    {lecture.title}
                  </h3>

                  {/* ========== 강사명 ========== */}
                  <p className="mb-2 text-sm text-muted-foreground">
                    {lecture.instructor ||
                      lecture.organization ||
                      "강사 정보 없음"}
                  </p>

                  {/* ========== 별점 ========== */}
                  <div className="mb-2 flex items-center gap-1">
                    <Star
                      className={`h-4 w-4 ${
                        lecture.reviewCount > 0
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                    <span className="font-semibold">
                      {lecture.reviewCount > 0
                        ? lecture.rating.toFixed(1)
                        : "0.0"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({lecture.reviewCount})
                    </span>
                  </div>

                  {/* ========== 강의 기간 ========== */}
                  {lecture.startDate && lecture.endDate && (
                    <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs">
                        {lecture.startDate} ~ {lecture.endDate}
                      </span>
                    </div>
                  )}

                  {/* ========== 대상 배지 ========== */}
                  {lecture.target && (
                    <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {lecture.target}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* ========== 더보기 버튼 ========== */}
        <div className="mt-8 text-center">
          <Link href="/lectures">
            <Button variant="outline" size="lg">
              전체 강의 보기
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
