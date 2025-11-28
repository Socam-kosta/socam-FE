// ========== 학생 마이페이지 ==========
// 역할: 학생(회원)만
// 기능: 내 정보, 내 리뷰, 찜 목록, 회원 탈퇴

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  MessageSquare,
  Heart,
  AlertTriangle,
  Star,
  Trash2,
  Edit,
} from "lucide-react";
import Link from "next/link";
import {
  getMyInfo,
  updateUserInfo,
  deleteUser,
  type UserInfo,
} from "@/lib/api/user";
import { getValidToken } from "@/lib/auth-utils";
import { getMyReviews, deleteReview, type ReviewResponseDto } from "@/lib/api/review";
import { getWishlist, type WishlistItem } from "@/lib/api/wishlist";
import { getLectureDetail } from "@/lib/api/lecture";

export default function MyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "profile" | "reviews" | "wishlist" | "withdrawal"
  >("profile");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ========== 사용자 정보 ==========
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [formData, setFormData] = useState({
    nickname: "",
    name: "",
  });

  // ========== 리뷰 목록 ==========
  const [userReviews, setUserReviews] = useState<
    (ReviewResponseDto & { lectureTitle?: string })[]
  >([]);

  // ========== 찜 목록 ==========
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // ========== 회원 탈퇴 ==========
  const [withdrawalPassword, setWithdrawalPassword] = useState("");
  const [withdrawalConfirmed, setWithdrawalConfirmed] = useState(false);

  // ========== 현재 사용자 이메일 가져오기 ==========
  const getCurrentUserEmail = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("userEmail");
  };

  // ========== 데이터 로드 ==========
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const email = getCurrentUserEmail();

        if (!email) {
          alert("로그인이 필요합니다.");
          router.push("/login/student");
          return;
        }

        // 사용자 정보 로드
        const userInfo = await getMyInfo();
        setUserData(userInfo);
        setFormData({
          nickname: userInfo.nickname || "",
          name: userInfo.name || "",
        });

        // 리뷰 목록 로드
        try {
          const reviews = await getMyReviews(email);
          // 각 리뷰의 강의 제목 가져오기
          const reviewsWithTitles = await Promise.all(
            reviews.map(async (review) => {
              if (review.lectureId) {
                try {
                  const lecture = await getLectureDetail(
                    Number(review.lectureId)
                  );
                  return { ...review, lectureTitle: lecture.title };
                } catch (error) {
                  console.error(
                    `강의 ${review.lectureId} 정보 조회 실패:`,
                    error
                  );
                  return { ...review, lectureTitle: "강의 정보 없음" };
                }
              }
              return { ...review, lectureTitle: "강의 정보 없음" };
            })
          );
          setUserReviews(reviewsWithTitles);
        } catch (error) {
          console.error("리뷰 목록 로드 실패:", error);
          setUserReviews([]);
        }

        // 찜 목록 로드
        try {
          const wishlistData = await getWishlist(email);
          setWishlist(wishlistData);
        } catch (error) {
          console.error("찜 목록 로드 실패:", error);
          setWishlist([]);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("데이터를 불러오는데 실패했습니다.");
        router.push("/login/student");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  // ========== 정보 수정 처리 ==========
  const handleSaveProfile = async () => {
    if (!userData) return;

    try {
      await updateUserInfo(userData.email, {
        nickname: formData.nickname,
        // name은 수정 불가
      });

      // 사용자 정보 다시 로드
      const updatedUserInfo = await getMyInfo();
      setUserData(updatedUserInfo);

      alert("정보가 수정되었습니다");
      setIsEditMode(false);
    } catch (error) {
      console.error("정보 수정 실패:", error);
      alert(
        error instanceof Error ? error.message : "정보 수정에 실패했습니다."
      );
    }
  };

  // ========== 리뷰 삭제 처리 ==========
  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("정말 이 리뷰를 삭제하시겠습니까?")) return;

    const email = getCurrentUserEmail();
    if (!email) return;

    try {
      await deleteReview(reviewId, email);

      // 리뷰 목록에서 제거
      setUserReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
      alert("리뷰가 삭제되었습니다.");
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      alert(
        error instanceof Error ? error.message : "리뷰 삭제에 실패했습니다."
      );
    }
  };

  // ========== 회원 탈퇴 처리 ==========
  const handleWithdrawal = async () => {
    if (!withdrawalConfirmed) {
      alert("계정 삭제 확인에 체크해주세요.");
      return;
    }

    if (!userData) return;

    if (
      !confirm("정말 회원 탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      return;
    }

    try {
      await deleteUser(userData.email);
      alert("회원 탈퇴가 완료되었습니다.");

      // 로그아웃 처리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userType");

      router.push("/");
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      alert(
        error instanceof Error ? error.message : "회원 탈퇴에 실패했습니다."
      );
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="bg-background min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">로딩 중...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <>
      <Header />

      <main className="bg-background min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========== 페이지 헤더 ========== */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">마이페이지</h1>
            <p className="text-muted-foreground">내 정보를 관리하세요</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* ========== 좌측 사이드바 (탭 메뉴) ========== */}
            <aside className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                        activeTab === "profile"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <User className="h-5 w-5" />
                      <span>내 정보</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                        activeTab === "reviews"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>내 리뷰</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("wishlist")}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                        activeTab === "wishlist"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Heart className="h-5 w-5" />
                      <span>찜 목록</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("withdrawal")}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                        activeTab === "withdrawal"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <AlertTriangle className="h-5 w-5" />
                      <span>회원 탈퇴</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* ========== 우측 콘텐츠 영역 ========== */}
            <div className="lg:col-span-3">
              {/* ========== 내 정보 탭 ========== */}
              {activeTab === "profile" && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold">내 정보</h2>
                      {!isEditMode && (
                        <Button onClick={() => setIsEditMode(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          정보 수정
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* ========== 이메일 (수정 불가) ========== */}
                      <div>
                        <Label>이메일</Label>
                        <Input
                          value={userData.email}
                          disabled
                          className="mt-2"
                        />
                      </div>

                      {/* ========== 이름 (수정 불가) ========== */}
                      <div>
                        <Label>이름</Label>
                        <Input
                          value={formData.name}
                          disabled
                          className="mt-2"
                        />
                      </div>

                      {/* ========== 닉네임 ========== */}
                      <div>
                        <Label>닉네임</Label>
                        <Input
                          value={formData.nickname}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nickname: e.target.value,
                            })
                          }
                          disabled={!isEditMode}
                          className="mt-2"
                        />
                      </div>

                      {/* ========== 가입일 ========== */}
                      {userData.createdAt && (
                        <div>
                          <Label>가입일</Label>
                          <Input
                            value={new Date(
                              userData.createdAt
                            ).toLocaleDateString("ko-KR")}
                            disabled
                            className="mt-2"
                          />
                        </div>
                      )}

                      {/* ========== 수정 모드 버튼 ========== */}
                      {isEditMode && (
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleSaveProfile}>저장</Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditMode(false)}
                          >
                            취소
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ========== 내 리뷰 탭 ========== */}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-semibold mb-6">내 리뷰</h2>
                      <div className="space-y-4">
                        {userReviews.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            작성한 리뷰가 없습니다.
                          </p>
                        ) : (
                          userReviews.map((review, index) => (
                            <Card
                              key={
                                review.reviewId ||
                                `${review.email}-${
                                  review.createdAt || index
                                }-${index}`
                              }
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-semibold">
                                      {review.lectureTitle || "강의 정보 없음"}
                                    </h3>
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
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-xs px-3 py-1 rounded-full ${
                                        review.status === "APPROVED"
                                          ? "bg-green-100 text-green-700"
                                          : review.status === "PENDING"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {review.status === "APPROVED"
                                        ? "승인완료"
                                        : review.status === "PENDING"
                                        ? "승인대기"
                                        : "반려"}
                                    </span>
                                    {review.reviewId && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleDeleteReview(review.reviewId!)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {review.contents}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString("ko-KR")}
                                </p>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ========== 찜 목록 탭 ========== */}
              {activeTab === "wishlist" && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">찜 목록</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlist.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8 col-span-2">
                          찜한 강의가 없습니다.
                        </p>
                      ) : (
                        wishlist.map((item) => (
                          <Link
                            key={item.id}
                            href={`/lectures/${item.lecture.id}`}
                          >
                            <Card className="hover:border-primary transition-all">
                              <CardContent className="p-4">
                                <div className="flex gap-4">
                                  <img
                                    src={
                                      item.lecture.imageUrl ||
                                      "/placeholder.svg"
                                    }
                                    alt={item.lecture.title}
                                    className="w-24 h-24 object-cover rounded"
                                  />
                                  <div className="flex-1">
                                    <h3 className="font-semibold mb-1 line-clamp-1">
                                      {item.lecture.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {item.lecture.instructor ||
                                        item.lecture.organization}
                                    </p>
                                    {item.lecture.startDate &&
                                      item.lecture.endDate && (
                                        <p className="text-xs text-muted-foreground mb-2">
                                          {item.lecture.startDate} ~{" "}
                                          {item.lecture.endDate}
                                        </p>
                                      )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ========== 회원 탈퇴 탭 ========== */}
              {activeTab === "withdrawal" && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">회원 탈퇴</h2>
                    <div className="space-y-6">
                      {/* ========== 경고 메시지 ========== */}
                      <div className="rounded-lg bg-destructive/10 p-4">
                        <div className="flex gap-3">
                          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-destructive mb-2">
                              계정을 삭제하면 모든 데이터가 영구 삭제됩니다
                            </h3>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              <li>• 프로필 정보</li>
                              <li>• 작성한 리뷰</li>
                              <li>• 찜 목록</li>
                              <li>• 복구 불가능</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* ========== 탈퇴 폼 ========== */}
                      <div>
                        <Label htmlFor="confirm">계정 삭제 확인</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Checkbox
                            id="confirm"
                            checked={withdrawalConfirmed}
                            onCheckedChange={(checked) =>
                              setWithdrawalConfirmed(checked === true)
                            }
                          />
                          <Label htmlFor="confirm" className="font-normal">
                            계정 삭제를 원합니다
                          </Label>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          onClick={handleWithdrawal}
                        >
                          탈퇴하기
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setWithdrawalConfirmed(false);
                            setWithdrawalPassword("");
                          }}
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
