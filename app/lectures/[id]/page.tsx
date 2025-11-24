// ========== 강의 상세 페이지 ==========
// 역할: 모든 사용자
// 기능: 강의 정보 조회, 리뷰 작성/조회, 커리큘럼, 강사 소개

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Star,
  Heart,
  Calendar,
  MapPin,
  Clock,
  User,
  CheckCircle2,
  Building2,
  CreditCard,
  GraduationCap,
  Briefcase,
  FileText,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { getLectureDetail, type LectureDetailDto } from "@/lib/api/lecture";
import {
  getReviewsByLecture,
  getLectureAverageRating,
  addReview,
  type ReviewResponseDto,
} from "@/lib/api/review";
import { addWishlist, removeWishlist, getWishlist } from "@/lib/api/wishlist";
import { getValidToken } from "@/lib/auth-utils";

export default function LectureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lectureId = params?.id ? Number(params.id) : null;

  const [lectureData, setLectureData] = useState<LectureDetailDto | null>(null);
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [ratingInfo, setRatingInfo] = useState<{
    average: number;
    count: number;
  }>({ average: 0, count: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  // ========== 로그인 상태 확인 ==========
  const getCurrentUserEmail = (): string | null => {
    if (typeof window === "undefined") return null;
    const userType = localStorage.getItem("userType")?.toLowerCase();
    if (userType === "user") {
      return localStorage.getItem("userEmail");
    }
    return null;
  };
  const [activeTab, setActiveTab] = useState<
    "intro" | "ncs" | "eligibility" | "curriculum" | "reviews" | "instructor"
  >("intro");
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    content: "",
    certificateFile: null as File | null,
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // ========== 강의 상세 데이터 로드 ==========
  useEffect(() => {
    if (!lectureId) return;

    const loadLectureDetail = async () => {
      try {
        setIsLoading(true);
        const [detail, ratingData] = await Promise.all([
          getLectureDetail(lectureId),
          getLectureAverageRating(lectureId),
        ]);

        setLectureData(detail);
        setRatingInfo(ratingData);

        // 리뷰 목록 로드
        try {
          const reviewsData = await getReviewsByLecture(lectureId);
          setReviews(reviewsData);
        } catch (error) {
          console.error("리뷰 목록 로드 실패:", error);
          setReviews([]);
        }

        // 찜 상태 확인 (로그인한 사용자인 경우만)
        const userEmail = getCurrentUserEmail();
        const token =
          typeof window !== "undefined"
            ? getValidToken()
            : null;

        console.log("[강의 상세] 찜 상태 확인 시작:", {
          userEmail,
          token: token ? "있음" : "없음",
          lectureId,
        });

        if (userEmail && token) {
          try {
            const wishlist = await getWishlist(userEmail);
            console.log("[강의 상세] 찜 목록 조회 성공:", wishlist);
            const isWishlisted = wishlist.some(
              (item) => item.lecture.id === lectureId
            );
            console.log("[강의 상세] 찜 상태:", isWishlisted);
            setIsLiked(isWishlisted);
          } catch (error) {
            console.error("[강의 상세] 찜 상태 확인 실패:", error);
            // 인증 오류인 경우 찜 상태를 false로 설정
            setIsLiked(false);
          }
        } else {
          console.log("[강의 상세] 로그인하지 않음 - 찜 상태 false");
          // 토큰이 없거나 로그인하지 않은 경우
          setIsLiked(false);
        }

        // 리뷰 폼 초기화
        setReviewForm({
          rating: 5,
          content: "",
          certificateFile: null,
        });
      } catch (error) {
        console.error("강의 상세 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLectureDetail();
  }, [lectureId]);

  // ========== 리뷰 작성 처리 ==========
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lectureId) {
      alert("강의 정보를 불러올 수 없습니다.");
      return;
    }

    const userEmail = getCurrentUserEmail();
    if (!userEmail) {
      alert("로그인이 필요합니다.");
      router.push("/login/student");
      return;
    }

    // 유효성 검사
    if (!reviewForm.content.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    if (reviewForm.content.length < 50) {
      alert("리뷰 내용은 최소 50자 이상 입력해주세요.");
      return;
    }

    if (reviewForm.content.length > 500) {
      alert("리뷰 내용은 최대 500자까지 입력 가능합니다.");
      return;
    }

    if (!reviewForm.certificateFile) {
      alert("수료증 파일을 첨부해주세요.");
      return;
    }

    // 파일 확장자 검사
    const fileName = reviewForm.certificateFile.name.toLowerCase();
    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
    const hasValidExtension = allowedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!hasValidExtension) {
      alert("수료증 파일은 PDF, JPG, JPEG, PNG 형식만 가능합니다.");
      return;
    }

    try {
      setIsSubmittingReview(true);
      await addReview(
        userEmail,
        lectureId,
        reviewForm.rating,
        reviewForm.content,
        reviewForm.certificateFile
      );

      alert("리뷰가 등록되었습니다. 관리자 검토 후 게시됩니다.");

      // 폼 초기화
      setReviewForm({
        rating: 5,
        content: "",
        certificateFile: null,
      });

      // 리뷰 목록 새로고침
      try {
        const reviewsData = await getReviewsByLecture(lectureId);
        setReviews(reviewsData);
        const ratingData = await getLectureAverageRating(lectureId);
        setRatingInfo(ratingData);
      } catch (error) {
        console.error("리뷰 목록 새로고침 실패:", error);
      }
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "리뷰 등록에 실패했습니다.";
      alert(errorMessage);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // ========== 찜하기 토글 ==========
  const handleWishlistToggle = async () => {
    if (!lectureId) return;

    const userEmail = getCurrentUserEmail();
    if (!userEmail) {
      alert("로그인이 필요합니다.");
      router.push("/login/student");
      return;
    }

    // 토큰 확인
    const token = getValidToken();
    if (!token) {
      alert("로그인이 필요합니다. 다시 로그인해주세요.");
      router.push("/login/student");
      return;
    }

    try {
      if (isLiked) {
        // 찜 취소
        await removeWishlist(userEmail, lectureId);
        setIsLiked(false);
      } else {
        // 찜하기
        await addWishlist(userEmail, lectureId);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("찜하기 처리 실패:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "찜하기 처리 중 오류가 발생했습니다.";

      // 인증 오류인 경우 로그인 페이지로 이동
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
      <>
        <Header />
        <main className="bg-background min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">강의 정보를 불러오는 중...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ========== 강의 데이터가 없을 때 ==========
  if (!lectureData) {
    return (
      <>
        <Header />
        <main className="bg-background min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-semibold mb-2">
              강의를 찾을 수 없습니다
            </p>
            <Link href="/lectures">
              <Button>강의 목록으로 돌아가기</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ========== 커리큘럼 파싱 (TEXT 필드에서 줄바꿈으로 구분) ==========
  const parseCurriculum = (curriculumText?: string) => {
    if (!curriculumText) return [];

    // 줄바꿈으로 구분하여 주차별로 파싱
    const lines = curriculumText.split("\n").filter((line) => line.trim());
    return lines.map((line, index) => ({
      week: index + 1,
      title: line.trim(),
      topics: [], // 상세 주제는 파싱하지 않음
    }));
  };

  const curriculum = parseCurriculum(lectureData.curriculum);

  // ========== 지원 절차 파싱 ==========
  const parseApplicationProcess = (processText?: string) => {
    if (!processText) return [];

    const lines = processText.split("\n").filter((line) => line.trim());
    return lines.map((line, index) => ({
      step: index + 1,
      name: line.trim(),
      description: "",
    }));
  };

  const applicationProcess = parseApplicationProcess(
    lectureData.applicationProcess
  );

  return (
    <>
      <Header />

      <main className="bg-background min-h-screen">
        {/* ========== Hero Section (강의명, 기관명, 평점, 태그) ========== */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3">{lectureData.title}</h1>
                {lectureData.organization && (
                  <Link
                    href="/organizations/1"
                    className="text-lg text-primary hover:underline mb-4 inline-block"
                  >
                    <Building2 className="inline h-5 w-5 mr-1" />
                    {lectureData.organization}
                  </Link>
                )}

                {/* ========== 별점 및 리뷰 수 ========== */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(ratingInfo.average)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-lg">
                      {ratingInfo.count > 0
                        ? ratingInfo.average.toFixed(1)
                        : "0.0"}
                    </span>
                    <span className="text-muted-foreground">
                      ({ratingInfo.count}개 리뷰)
                    </span>
                  </div>
                </div>

                {/* ========== 태그 배지 ========== */}
                <div className="flex flex-wrap gap-2">
                  {lectureData.category && (
                    <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                      {lectureData.category}
                    </div>
                  )}
                  {lectureData.target && (
                    <div className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
                      {lectureData.target}
                    </div>
                  )}
                  {lectureData.method && (
                    <div className="inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700">
                      {lectureData.method}
                    </div>
                  )}
                </div>
              </div>

              {/* ========== 찜하기 버튼 ========== */}
              <Button
                variant={isLiked ? "default" : "outline"}
                size="lg"
                onClick={handleWishlistToggle}
                className="ml-4"
              >
                <Heart
                  className={`h-5 w-5 mr-2 ${isLiked ? "fill-current" : ""}`}
                />
                {isLiked ? "찜 완료" : "찜하기"}
              </Button>
            </div>
          </div>
        </div>

        {/* ========== Main Banner Image ========== */}
        {lectureData.imageUrl && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-8">
            <div className="relative aspect-[21/9] rounded-xl overflow-hidden shadow-2xl">
              <img
                src={lectureData.imageUrl}
                alt={lectureData.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "/placeholder.svg?height=600&width=1400";
                }}
              />
            </div>
          </div>
        )}

        {/* ========== Left Section + Right Sidebar ========== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ========== 좌측: 탭 콘텐츠 영역 ========== */}
            <div className="lg:col-span-2">
              {/* ========== 탭 네비게이션 ========== */}
              <div className="border-b border-border mb-6 sticky top-0 bg-background z-10">
                <div className="flex gap-4 overflow-x-auto">
                  {[
                    { id: "intro", label: "강의소개" },
                    { id: "ncs", label: "NCS" },
                    { id: "eligibility", label: "지원정보" },
                    { id: "curriculum", label: "커리큘럼" },
                    { id: "reviews", label: `후기 (${ratingInfo.count})` },
                    { id: "instructor", label: "강사소개" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? "text-primary border-b-2 border-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setActiveTab(tab.id as any)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ========== 탭: 강의 소개 ========== */}
              {activeTab === "intro" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>강의 소개</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {lectureData.description ? (
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {lectureData.description}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">
                          강의 소개가 없습니다.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {lectureData.eligibility && (
                    <Card>
                      <CardHeader>
                        <CardTitle>수강 대상</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {lectureData.eligibility}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* ========== 탭: NCS 정보 ========== */}
              {activeTab === "ncs" && (
                <Card>
                  <CardHeader>
                    <CardTitle>NCS 훈련 핵심 과목</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {lectureData.category ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              1
                            </span>
                          </div>
                          <span className="font-medium">
                            {lectureData.category}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        NCS 정보가 없습니다.
                      </p>
                    )}
                    <p className="mt-6 text-sm text-muted-foreground">
                      * NCS(National Competency Standards):
                      국가직무능력표준으로, 산업현장에서 직무를 수행하기 위해
                      요구되는 지식, 기술, 태도 등의 내용을 국가가
                      산업부문별·수준별로 체계화한 것입니다.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* ========== 탭: 지원 정보 ========== */}
              {activeTab === "eligibility" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>지원 자격</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {lectureData.eligibility ? (
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {lectureData.eligibility}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">
                          지원 자격 정보가 없습니다.
                        </p>
                      )}
                      {lectureData.needCard !== undefined && (
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">내일배움카드</p>
                            <p className="text-sm text-muted-foreground">
                              {lectureData.needCard
                                ? "필수 (HRD-Net에서 발급)"
                                : "불필요"}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {lectureData.applicationProcess && (
                    <Card>
                      <CardHeader>
                        <CardTitle>지원 절차</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {applicationProcess.length > 0 ? (
                          <div className="space-y-4">
                            {applicationProcess.map((step, index) => (
                              <div key={step.step} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                                    {step.step}
                                  </div>
                                  {index < applicationProcess.length - 1 && (
                                    <div className="w-0.5 h-12 bg-border my-1" />
                                  )}
                                </div>
                                <div className="flex-1 pb-8">
                                  <p className="font-semibold mb-1">
                                    {step.name}
                                  </p>
                                  {step.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {step.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {lectureData.applicationProcess}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* ========== 탭: 커리큘럼 ========== */}
              {activeTab === "curriculum" && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      커리큘럼{" "}
                      {curriculum.length > 0 && `(${curriculum.length}주)`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {lectureData.curriculum ? (
                      curriculum.length > 0 ? (
                        <div className="space-y-3">
                          {curriculum.map((week) => (
                            <div
                              key={week.week}
                              className="border border-border rounded-lg overflow-hidden"
                            >
                              <button
                                className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 transition-colors"
                                onClick={() =>
                                  setExpandedWeek(
                                    expandedWeek === week.week
                                      ? null
                                      : week.week
                                  )
                                }
                              >
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold text-primary">
                                    Week {week.week}
                                  </span>
                                  <span className="font-medium">
                                    {week.title}
                                  </span>
                                </div>
                                {expandedWeek === week.week ? (
                                  <ChevronUp className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5" />
                                )}
                              </button>
                              {expandedWeek === week.week &&
                                week.topics.length > 0 && (
                                  <div className="p-4 bg-background">
                                    <ul className="space-y-2">
                                      {week.topics.map((topic, idx) => (
                                        <li
                                          key={idx}
                                          className="flex items-center gap-2 text-sm"
                                        >
                                          <CheckCircle2 className="h-4 w-4 text-primary" />
                                          <span>{topic}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {lectureData.curriculum}
                        </p>
                      )
                    ) : (
                      <p className="text-muted-foreground">
                        커리큘럼 정보가 없습니다.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* ========== 탭: 후기 ========== */}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* ========== 리뷰 작성 폼 ========== */}
                  <Card>
                    <CardHeader>
                      <CardTitle>리뷰 작성</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleReviewSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label>강의명</Label>
                            <p className="text-muted-foreground">
                              {lectureData.title}
                            </p>
                          </div>
                          <div>
                            <Label>강사명</Label>
                            <p className="text-muted-foreground">
                              {lectureData.instructor || "정보 없음"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <Label>훈련과목</Label>
                            <p className="text-muted-foreground">
                              {lectureData.category || "정보 없음"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <Label className="mb-2 block">별점</Label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() =>
                                  setReviewForm({ ...reviewForm, rating: star })
                                }
                              >
                                <Star
                                  className={`h-7 w-7 cursor-pointer transition-colors ${
                                    star <= reviewForm.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300 hover:text-yellow-200"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="review-content" className="mb-2 block">
                            느낀점
                          </Label>
                          <Textarea
                            id="review-content"
                            placeholder="강의에 대한 솔직한 후기를 남겨주세요... (최소 50자, 최대 500자)"
                            value={reviewForm.content}
                            onChange={(e) =>
                              setReviewForm({
                                ...reviewForm,
                                content: e.target.value,
                              })
                            }
                            rows={5}
                            required
                            minLength={50}
                            maxLength={500}
                            className="mt-2"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            {reviewForm.content.length}/500자
                            {reviewForm.content.length < 50 && (
                              <span className="text-destructive ml-2">
                                (최소 50자 이상 입력해주세요)
                              </span>
                            )}
                          </p>
                        </div>

                        <div>
                          <Label
                            htmlFor="certificate-file"
                            className="mb-2 block"
                          >
                            수료증 파일 (필수)
                          </Label>
                          <Input
                            id="certificate-file"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setReviewForm({
                                ...reviewForm,
                                certificateFile: file,
                              });
                            }}
                            className="mt-2"
                            required
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            PDF, JPG, JPEG, PNG 형식만 가능합니다.
                            {reviewForm.certificateFile && (
                              <span className="ml-2 text-foreground">
                                선택된 파일: {reviewForm.certificateFile.name}
                              </span>
                            )}
                          </p>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmittingReview}
                        >
                          {isSubmittingReview ? "등록 중..." : "리뷰 작성"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* ========== 리뷰 목록 ========== */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">수강생 리뷰</h3>
                    {reviews.length > 0 ? (
                      reviews.map((review, index) => {
                        const reviewDate = new Date(review.createdAt);
                        const formattedDate = reviewDate.toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        );

                        return (
                          <Card key={index}>
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <p className="font-semibold text-lg">
                                    {review.email}
                                  </p>
                                  <div className="flex items-center gap-1 mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                          star <= review.starRating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                    <span className="ml-2 text-sm text-muted-foreground">
                                      {review.starRating}.0
                                    </span>
                                  </div>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {formattedDate}
                                </span>
                              </div>
                              <p className="text-muted-foreground leading-relaxed">
                                {review.contents}
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })
                    ) : (
                      <Card>
                        <CardContent className="p-6">
                          <p className="text-muted-foreground text-center">
                            아직 리뷰가 없습니다.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {/* ========== 탭: 강사 소개 ========== */}
              {activeTab === "instructor" && (
                <Card>
                  <CardContent className="p-6">
                    {lectureData.instructor ? (
                      <div>
                        <h2 className="text-2xl font-bold mb-4">
                          {lectureData.instructor}
                        </h2>
                        {lectureData.organization && (
                          <p className="text-muted-foreground mb-4">
                            {lectureData.organization}
                          </p>
                        )}
                        <p className="text-muted-foreground">
                          강사 소개 정보가 추가로 제공되지 않았습니다.
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        강사 정보가 없습니다.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* ========== 우측: 고정 사이드바 ========== */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                {/* ========== 수강료 정보 ========== */}
                {(lectureData.tuition !== undefined ||
                  lectureData.supportAvailable !== undefined) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">수강료 정보</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {lectureData.tuition != null && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">정가</span>
                          <span className="line-through text-muted-foreground">
                            {lectureData.tuition?.toLocaleString() ?? "0"}원
                          </span>
                        </div>
                      )}
                      {lectureData.supportAvailable && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            훈련지원금
                          </span>
                          <span className="text-red-600 font-semibold">
                            지원 가능
                          </span>
                        </div>
                      )}
                      {lectureData.tuition != null && (
                        <div className="border-t pt-3 flex justify-between items-center">
                          <span className="font-semibold">실 부담금</span>
                          <span className="text-2xl font-bold text-primary">
                            {lectureData.tuition?.toLocaleString() ?? "0"}원
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* ========== 훈련 일정 정보 ========== */}
                {(lectureData.startDate ||
                  lectureData.endDate ||
                  lectureData.region ||
                  lectureData.method) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">훈련 일정</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {(lectureData.startDate || lectureData.endDate) && (
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-muted-foreground">기간</p>
                            <p className="font-medium">
                              {lectureData.startDate || "미정"} ~{" "}
                              {lectureData.endDate || "미정"}
                            </p>
                          </div>
                        </div>
                      )}
                      {lectureData.region && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-muted-foreground">지역</p>
                            <p className="font-medium">{lectureData.region}</p>
                          </div>
                        </div>
                      )}
                      {lectureData.method && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-muted-foreground">수업방식</p>
                            <p className="font-medium">
                              {lectureData.method === "온라인"
                                ? "온라인"
                                : lectureData.method}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* ========== 지원 자격 요약 ========== */}
                {(lectureData.eligibility ||
                  lectureData.needCard !== undefined) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">지원 자격</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {lectureData.needCard !== undefined && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span>
                            {lectureData.needCard
                              ? "내일배움카드 필수"
                              : "내일배움카드 불필요"}
                          </span>
                        </div>
                      )}
                      {lectureData.eligibility && (
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                          <span className="text-xs leading-relaxed">
                            {lectureData.eligibility}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* ========== 채용 연계 정보 ========== */}
                {lectureData.employmentSupport && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">채용 연계</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {lectureData.employmentSupport}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* ========== 신청하기 버튼 (큰 버튼) ========== */}
                <Button size="lg" className="w-full text-lg py-6">
                  수강 신청하기
                </Button>
                <Button variant="outline" size="lg" className="w-full">
                  문의하기
                </Button>
              </div>
            </div>
          </div>

          {/* ========== 유사 강의 추천 ========== */}
          {/* TODO: 유사 강의 추천 기능은 추후 구현 */}
          {/* <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">유사한 강의</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              유사 강의 목록
            </div>
          </div> */}
        </div>
      </main>

      <Footer />
    </>
  );
}
