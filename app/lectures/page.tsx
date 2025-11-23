// ========== 강의 목록 페이지 ==========
// 역할: 모든 사용자
// 기능: 강의 검색, 필터, 정렬

"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Heart, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getAllApprovedLectures,
  getLectureDetail,
  type LectureResponseDto,
  type LectureDetailDto,
} from "@/lib/api/lecture";
import { getLectureAverageRating } from "@/lib/api/review";
import { addWishlist, removeWishlist, getWishlist } from "@/lib/api/wishlist";

// ========== 강의 데이터 타입 (평점 정보 포함) ==========
interface LectureWithRating extends LectureResponseDto {
  rating: number;
  reviewCount: number;
  isWishlisted?: boolean;
  description?: string;
  eligibility?: string;
}

// ========== 필터 옵션 ==========
const METHOD_OPTIONS = ["온라인", "오프라인"];
const TARGET_OPTIONS = ["재직자", "취준생"];
// 카테고리는 DB에서 동적으로 가져올 수도 있지만, 일단 하드코딩
const CATEGORY_OPTIONS = [
  "프론트엔드",
  "백엔드",
  "AI",
  "클라우드",
  "모바일",
  "풀스택",
  "보안",
  "DevOps",
];

// URL 쿼리 파라미터의 카테고리 ID를 DB 카테고리 값으로 매핑
const CATEGORY_ID_TO_DB_VALUE: Record<string, string> = {
  frontend: "프론트엔드",
  backend: "백엔드",
  fullstack: "풀스택",
  mobile: "모바일",
  "data-ai": "AI",
  cloud: "클라우드",
  security: "보안",
  devops: "DevOps",
  planning: "기획/마케팅", // 필터 옵션에는 없지만 URL로 올 수 있음
};

export default function LecturesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allLectures, setAllLectures] = useState<LectureWithRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [filters, setFilters] = useState({
    method: [] as string[],
    category: [] as string[],
    target: [] as string[],
  });

  // ========== URL 쿼리 파라미터에서 카테고리 및 검색어 읽기 ==========
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    
    // 검색어 설정
    // Next.js의 useSearchParams는 이미 자동으로 디코딩된 값을 반환합니다
    if (searchParam) {
      setSearchQuery(searchParam);
      console.log("[검색 페이지] URL에서 읽은 검색어:", searchParam);
    } else {
      setSearchQuery("");
    }
    
    // 카테고리 필터 설정
    if (categoryParam) {
      const dbCategoryValue = CATEGORY_ID_TO_DB_VALUE[categoryParam];
      if (dbCategoryValue && CATEGORY_OPTIONS.includes(dbCategoryValue)) {
        // URL에서 카테고리가 있으면 필터에 자동으로 설정 (기존 필터 초기화)
        setFilters((prev) => ({
          ...prev,
          category: [dbCategoryValue],
        }));
      }
    } else {
      // URL에 카테고리가 없으면 필터 초기화
      setFilters((prev) => ({
        ...prev,
        category: [],
      }));
    }
  }, [searchParams]);

  // ========== 로그인 상태 확인 ==========
  const getCurrentUserEmail = (): string | null => {
    if (typeof window === "undefined") return null;
    const userType = localStorage.getItem("userType")?.toLowerCase();
    if (userType === "user") {
      return localStorage.getItem("userEmail");
    }
    return null;
  };

  // ========== 강의 목록 및 평점 로드 ==========
  useEffect(() => {
    const loadLectures = async () => {
      try {
        setIsLoading(true);
        const lectures = await getAllApprovedLectures();
        const userEmail = getCurrentUserEmail();
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

        // 찜 목록을 한 번만 가져오기 (로그인한 사용자인 경우)
        let wishlistIds: Set<number> = new Set();
        if (userEmail && token) {
          try {
            const wishlist = await getWishlist(userEmail);
            wishlistIds = new Set(wishlist.map((item) => item.lecture.id));
          } catch (error) {
            // 인증 오류인 경우 조용히 처리
            wishlistIds = new Set();
          }
        }

        // 각 강의의 평점 정보, 찜 상태, 상세 정보 가져오기
        // 검색을 위해 description과 eligibility도 함께 가져옴
        const lecturesWithRating = await Promise.all(
          lectures.map(async (lecture) => {
            try {
              const [ratingInfo, detail] = await Promise.all([
                getLectureAverageRating(lecture.id),
                getLectureDetail(lecture.id).catch(() => null), // 상세 정보는 실패해도 계속 진행
              ]);
              
              const isWishlisted = wishlistIds.has(lecture.id);

              return {
                ...lecture,
                rating: ratingInfo.average,
                reviewCount: ratingInfo.count,
                isWishlisted,
                description: detail?.description || lecture.description,
                eligibility: detail?.eligibility,
              };
            } catch (error) {
              console.error(`강의 ${lecture.id} 정보 조회 실패:`, error);
              return {
                ...lecture,
                rating: 0,
                reviewCount: 0,
                isWishlisted: false,
              };
            }
          })
        );

        setAllLectures(lecturesWithRating);
      } catch (error) {
        console.error("강의 목록 로드 실패:", error);
        setAllLectures([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLectures();
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

    try {
      const lecture = allLectures.find((l) => l.id === lectureId);
      if (!lecture) return;

      if (lecture.isWishlisted) {
        // 찜 취소
        await removeWishlist(userEmail, lectureId);
        setAllLectures((prev) =>
          prev.map((l) =>
            l.id === lectureId ? { ...l, isWishlisted: false } : l
          )
        );
      } else {
        // 찜하기
        await addWishlist(userEmail, lectureId);
        setAllLectures((prev) =>
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
      alert(errorMessage);
    }
  };

  // ========== 필터 토글 함수 ==========
  const toggleFilter = (
    type: "method" | "category" | "target",
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }));
  };

  // ========== 필터링 및 검색 적용 ==========
  const filteredLectures = useMemo(() => {
    let filtered = [...allLectures];

    // 검색 필터 (제목, 설명, 강사명, 자격요건)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((lecture) => {
        // 제목 검색
        if (lecture.title?.toLowerCase().includes(query)) return true;
        // 강사명 검색
        if (lecture.instructor?.toLowerCase().includes(query)) return true;
        // 설명 검색
        if (lecture.description?.toLowerCase().includes(query)) return true;
        // 자격요건 검색
        if (lecture.eligibility?.toLowerCase().includes(query)) return true;
        return false;
      });
    }

    // 필터 적용
    if (filters.method.length > 0) {
      filtered = filtered.filter(
        (lecture) => lecture.method && filters.method.includes(lecture.method)
      );
    }

    if (filters.category.length > 0) {
      filtered = filtered.filter(
        (lecture) =>
          lecture.category && filters.category.includes(lecture.category)
      );
    }

    if (filters.target.length > 0) {
      filtered = filtered.filter(
        (lecture) => lecture.target && filters.target.includes(lecture.target)
      );
    }

    // 정렬
    switch (sortBy) {
      case "latest":
        // 최신순 (id 기준, 큰 값이 최신)
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case "rating":
        // 별점순
        filtered.sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return b.reviewCount - a.reviewCount;
        });
        break;
      case "popular":
      default:
        // 인기순 (리뷰 수 기준)
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return filtered;
  }, [allLectures, searchQuery, filters, sortBy]);

  return (
    <>
      <Header />
      
      <main className="bg-background min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========== 페이지 헤더 ========== */}
          <div className="mb-8">
            {searchQuery ? (
              <>
                <h1 className="text-3xl font-bold mb-2">
                  검색 결과: &quot;{searchQuery}&quot;
                </h1>
                <p className="text-muted-foreground">
                  {isLoading
                    ? "로딩 중..."
                    : `${filteredLectures.length}개의 강의를 찾았습니다`}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-2">전체 강의</h1>
                <p className="text-muted-foreground">
                  {isLoading
                    ? "로딩 중..."
                    : `${filteredLectures.length}개의 강의를 탐색하세요`}
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* ========== 필터 사이드바 ========== */}
            <aside className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6 space-y-6">
                  {/* ========== 강의 방식 필터 ========== */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      강의 방식
                    </Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="online"
                          checked={filters.method.includes("온라인")}
                          onCheckedChange={() =>
                            toggleFilter("method", "온라인")
                          }
                        />
                        <Label htmlFor="online" className="font-normal">
                          온라인
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="offline"
                          checked={filters.method.includes("오프라인")}
                          onCheckedChange={() =>
                            toggleFilter("method", "오프라인")
                          }
                        />
                        <Label htmlFor="offline" className="font-normal">
                          오프라인
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* ========== 카테고리 필터 ========== */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      카테고리
                    </Label>
                    <div className="space-y-2">
                      {CATEGORY_OPTIONS.map((cat) => (
                        <div key={cat} className="flex items-center space-x-2">
                          <Checkbox
                            id={cat}
                            checked={filters.category.includes(cat)}
                            onCheckedChange={() =>
                              toggleFilter("category", cat)
                            }
                          />
                          <Label htmlFor={cat} className="font-normal">
                            {cat}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ========== 대상 필터 ========== */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      대상
                    </Label>
                    <div className="space-y-2">
                      {TARGET_OPTIONS.map((target) => (
                        <div
                          key={target}
                          className="flex items-center space-x-2"
                        >
                        <Checkbox
                            id={target}
                            checked={filters.target.includes(target)}
                            onCheckedChange={() =>
                              toggleFilter("target", target)
                            }
                        />
                          <Label htmlFor={target} className="font-normal">
                            {target}
                          </Label>
                      </div>
                      ))}
                    </div>
                  </div>

                  {/* ========== 필터 초기화 ========== */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      setFilters({ method: [], category: [], target: [] })
                    }
                  >
                    필터 초기화
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* ========== 강의 목록 ========== */}
            <div className="lg:col-span-3">
              {/* ========== 검색 및 정렬 바 ========== */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Input
                  type="search"
                  placeholder="강의명 또는 강사명 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">인기순</SelectItem>
                    <SelectItem value="latest">최신순</SelectItem>
                    <SelectItem value="rating">별점순</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ========== 강의 그리드 ========== */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-video bg-muted animate-pulse" />
                      <CardContent className="p-4 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                        <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredLectures.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    {searchQuery ||
                    filters.method.length > 0 ||
                    filters.category.length > 0 ||
                    filters.target.length > 0
                      ? "검색 결과가 없습니다."
                      : "등록된 강의가 없습니다."}
                  </p>
                </div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredLectures.map((lecture) => (
                  <Link key={lecture.id} href={`/lectures/${lecture.id}`}>
                    <Card className="group overflow-hidden hover:border-primary transition-all h-full">
                      {/* ========== 강의 이미지 ========== */}
                      <div className="relative aspect-video overflow-hidden">
                        <img
                            src={lecture.imageUrl || "/placeholder.svg"}
                          alt={lecture.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
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
                          {lecture.instructor && (
                            <p className="mb-2 text-sm text-muted-foreground">
                              {lecture.instructor}
                            </p>
                          )}

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

                        {/* ========== 배지들 ========== */}
                          <div className="flex gap-2 flex-wrap">
                            {lecture.target && (
                          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {lecture.target}
                          </div>
                            )}
                            {lecture.method && (
                          <div className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                            {lecture.method}
                          </div>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
