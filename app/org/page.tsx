// ========== 기관 마이페이지 ==========
// 역할: 운영기관만
// 기능: 기관정보, 강의관리, 강의승인현황, 리뷰조회

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  BookOpen,
  CheckCircle,
  MessageSquare,
  Edit,
  Trash2,
  Star, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import {
  getOrgInfo,
  getMyLectures,
  updateOrgInfo,
  deleteLecture,
  OrgInfo,
  LectureResponseDto,
  OrgUpdateInfoReqDto, deleteOrg,
} from "@/lib/api/org";
import { useRouter } from "next/navigation";

export default function OrgPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  // URL 쿼리 파라미터에서 탭 상태 읽기
  const getInitialTab = (): "info" | "lectures" | "approval" | "reviews" | "withdrawal" => {
    if (tabParam === "lectures") return "lectures";
    if (tabParam === "approval") return "approval";
    if (tabParam === "reviews") return "reviews";
    if (tabParam === "withdrawal") return "withdrawal";
    return "info";
  };

  const [activeTab, setActiveTab] = useState<
      "info" | "lectures" | "approval" | "reviews" | "withdrawal"
  >(getInitialTab());
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    orgName: string;
    contact: string;
    password: string;
  }>({
    orgName: "",
    contact: "",
    password: "",
  });

  // ========== 데이터 상태 ==========
  const [orgData, setOrgData] = useState<OrgInfo | null>(null);
  const [lectures, setLectures] = useState<LectureResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ========== 승인 현황 통계 ==========
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // URL 쿼리 파라미터 변경 시 탭 업데이트
  useEffect(() => {
    const tab = getInitialTab();
    setActiveTab(tab);
  }, [tabParam]);

  // ========== 기관 정보 로드 ==========
  useEffect(() => {
    const fetchOrgInfo = async () => {
      try {
        setIsLoading(true);
        const data = await getOrgInfo();
        setOrgData(data);
        // 수정 폼 데이터 초기화
        setEditFormData({
          orgName: data.orgName,
          contact: data.contact,
          password: "",
        });
      } catch (err) {
        setError(
            err instanceof Error
                ? err.message
                : "기관 정보를 불러오는데 실패했습니다."
        );
        // 인증 오류 시 로그인 페이지로 리다이렉트
        if (err instanceof Error && err.message.includes("로그인이 필요")) {
          router.push("/login/org");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrgInfo();
  }, [router]);

  // ========== 기관 정보 수정 ==========
  const handleSaveOrgInfo = async () => {
    if (!orgData) return;

    try {
      setIsLoading(true);
      setError("");

      const updateData: OrgUpdateInfoReqDto = {
        orgName: editFormData.orgName,
        contact: editFormData.contact,
      };

      // 비밀번호가 입력된 경우에만 포함
      if (editFormData.password.trim()) {
        updateData.password = editFormData.password;
      }

      const updatedData = await updateOrgInfo(orgData.email, updateData);
      setOrgData(updatedData);
      setIsEditMode(false);
      // 성공 메시지 (선택사항)
      alert("기관 정보가 수정되었습니다.");
    } catch (err) {
      setError(
          err instanceof Error ? err.message : "기관 정보 수정에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ========== 강의 삭제 ==========
  const handleDeleteLecture = async (lectureId: number) => {
    if (!confirm("정말 이 강의를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteLecture(lectureId);
      // 강의 목록 새로고침
      const [pending, approved, rejected] = await Promise.all([
        getMyLectures("PENDING"),
        getMyLectures("APPROVED"),
        getMyLectures("REJECTED"),
      ]);

      setStats({
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length,
      });

      if (activeTab === "lectures") {
        setLectures([...approved, ...pending, ...rejected]);
      } else if (activeTab === "approval") {
        setLectures(pending);
      }

      alert("강의가 삭제되었습니다.");
    } catch (err) {
      alert(
          err instanceof Error ? err.message : "강의 삭제에 실패했습니다."
      );
    }
  };

  // ========== 강의 목록 로드 ==========
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        // 모든 상태의 강의를 가져와서 통계 계산
        const [pending, approved, rejected] = await Promise.all([
          getMyLectures("PENDING"),
          getMyLectures("APPROVED"),
          getMyLectures("REJECTED"),
        ]);

        // 통계 업데이트
        setStats({
          pending: pending.length,
          approved: approved.length,
          rejected: rejected.length,
        });

        // 현재 탭에 따라 강의 목록 설정
        if (activeTab === "lectures") {
          // 강의관리 탭: 모든 강의 표시
          setLectures([...approved, ...pending, ...rejected]);
        } else if (activeTab === "approval") {
          // 승인현황 탭: 승인 대기 강의만 표시
          setLectures(pending);
        }
      } catch (err) {
        console.error("강의 목록 로드 실패:", err);
      }
    };

    if (activeTab === "lectures" || activeTab === "approval") {
      fetchLectures();
    }
  }, [activeTab]);

  // ========== 기관 탈퇴  ==========
  const [withdrawalConfirmed, setWithdrawalConfirmed] = useState(false);

  const handleWithdrawal = async () => {
    if (!orgData) return;

    if (!withdrawalConfirmed) {
      alert("기관 계정 삭제 동의가 필요합니다.");
      return;
    }

    if (!confirm("정말로 기관 계정을 삭제하시겠습니까? (복구 불가)")) return;

    try {
      await deleteOrg(orgData.email);

      alert("기관 계정이 삭제되었습니다.");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userType");

      router.push("/");
    } catch (err) {
      alert("기관 탈퇴 실패");
    }
  };


  return (
      <>
        <Header />

        <main className="bg-background min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* ========== 페이지 헤더 ========== */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">기관 관리</h1>
              <p className="text-muted-foreground">
                기관 정보와 강의를 관리하세요
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* ========== 좌측 사이드바 ========== */}
              <aside className="lg:col-span-1">
                <Card>
                  <CardContent className="p-4">
                    <nav className="space-y-2">
                      <button
                          onClick={() => setActiveTab("info")}
                          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                              activeTab === "info"
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                          }`}
                      >
                        <Building2 className="h-5 w-5" />
                        <span>기관정보</span>
                      </button>
                      <button
                          onClick={() => setActiveTab("lectures")}
                          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                              activeTab === "lectures"
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                          }`}
                      >
                        <BookOpen className="h-5 w-5" />
                        <span>강의관리</span>
                      </button>
                      <button
                          onClick={() => setActiveTab("approval")}
                          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                              activeTab === "approval"
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                          }`}
                      >
                        <CheckCircle className="h-5 w-5" />
                        <span>강의승인현황</span>
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
                        <span>리뷰조회</span>
                      </button>
                        <button
                            onClick={() => setActiveTab("withdrawal")}
                            className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                            ${activeTab === "withdrawal"
                                    ? "bg-red-600 text-white"
                                    : "hover:bg-red-50"
                            }`}
                        >
                            <AlertTriangle
                                className={`h-5 w-5 ${
                                    activeTab === "withdrawal" ? "text-white" : "text-red-600"
                                }`}
                            />
                            <span
                                className={`font-semibold ${
                                    activeTab === "withdrawal" ? "text-white" : "text-red-600"
                                }`}
                            >
                            기관 탈퇴
                            </span>
                        </button>
                    </nav>
                  </CardContent>
                </Card>
              </aside>

              {/* ========== 우측 콘텐츠 영역 ========== */}
              <div className="lg:col-span-3">
                {/* ========== 기관정보 탭 ========== */}
                {activeTab === "info" && (
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-semibold">기관정보</h2>
                          {!isEditMode && (
                              <Button onClick={() => setIsEditMode(true)}>
                                <Edit className="h-4 w-4 mr-2" />
                                정보 수정
                              </Button>
                          )}
                        </div>

                        {isLoading ? (
                            <div className="text-center py-8">로딩 중...</div>
                        ) : error ? (
                            <div className="text-center py-8 text-destructive">
                              {error}
                            </div>
                        ) : orgData ? (
                            <div className="space-y-4">
                              <div>
                                <Label>기관명</Label>
                                <Input
                                    value={
                                      isEditMode ? editFormData.orgName : orgData.orgName
                                    }
                                    onChange={(e) =>
                                        setEditFormData((prev) => ({
                                          ...prev,
                                          orgName: e.target.value,
                                        }))
                                    }
                                    disabled={!isEditMode}
                                    className="mt-2"
                                />
                              </div>

                              <div>
                                <Label>이메일</Label>
                                <Input
                                    value={orgData.email}
                                    disabled
                                    className="mt-2"
                                />
                              </div>

                              <div>
                                <Label>연락처</Label>
                                <Input
                                    value={
                                      isEditMode
                                          ? editFormData.contact
                                          : orgData.contact
                                    }
                                    onChange={(e) =>
                                        setEditFormData((prev) => ({
                                          ...prev,
                                          contact: e.target.value,
                                        }))
                                    }
                                    disabled={!isEditMode}
                                    className="mt-2"
                                />
                              </div>

                              {isEditMode && (
                                  <div>
                                    <Label>비밀번호 (변경 시에만 입력)</Label>
                                    <Input
                                        type="password"
                                        value={editFormData.password}
                                        onChange={(e) =>
                                            setEditFormData((prev) => ({
                                              ...prev,
                                              password: e.target.value,
                                            }))
                                        }
                                        placeholder="변경할 비밀번호를 입력하세요"
                                        className="mt-2"
                                    />
                                  </div>
                              )}

                              <div>
                                <Label>승인 상태</Label>
                                <div className="mt-2">
                            <span
                                className={`inline-block rounded-full px-4 py-2 text-sm font-medium ${
                                    orgData.status === "APPROVED"
                                        ? "bg-green-100 text-green-700"
                                        : orgData.status === "PENDING"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                }`}
                            >
                              {orgData.status === "APPROVED"
                                  ? "승인됨"
                                  : orgData.status === "PENDING"
                                      ? "승인 대기"
                                      : "거절됨"}
                            </span>
                                </div>
                              </div>

                              {isEditMode && (
                                  <div className="flex gap-2 pt-4">
                                    <Button
                                        onClick={handleSaveOrgInfo}
                                        disabled={isLoading}
                                    >
                                      저장
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                          setIsEditMode(false);
                                          // 폼 데이터 초기화
                                          if (orgData) {
                                            setEditFormData({
                                              orgName: orgData.orgName,
                                              contact: orgData.contact,
                                              password: "",
                                            });
                                          }
                                        }}
                                        disabled={isLoading}
                                    >
                                      취소
                                    </Button>
                                  </div>
                              )}
                            </div>
                        ) : null}
                      </CardContent>
                    </Card>
                )}

                {/* ========== 강의관리 탭 ========== */}
                {activeTab === "lectures" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">강의관리</h2>
                        <Link href="/org/lectures/new">
                          <Button>새 강의 등록</Button>
                        </Link>
                      </div>

                      <Card>
                        <CardContent className="p-6">
                          {isLoading ? (
                              <div className="text-center py-8">로딩 중...</div>
                          ) : lectures.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground">
                                등록된 강의가 없습니다.
                              </div>
                          ) : (
                              <div className="space-y-4">
                                {lectures.map((lecture) => (
                                    <Card key={lecture.id}>
                                      <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <h3 className="font-semibold mb-2">
                                              {lecture.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                                              {lecture.category && (
                                                  <span>{lecture.category}</span>
                                              )}
                                              {lecture.target && (
                                                  <>
                                                    {lecture.category && <span>•</span>}
                                                    <span>{lecture.target}</span>
                                                  </>
                                              )}
                                              {lecture.method && (
                                                  <>
                                                    {(lecture.category ||
                                                        lecture.target) && <span>•</span>}
                                                    <span>{lecture.method}</span>
                                                  </>
                                              )}
                                              {lecture.startDate && (
                                                  <>
                                                    {(lecture.category ||
                                                        lecture.target ||
                                                        lecture.method) && <span>•</span>}
                                                    <span>{lecture.startDate}</span>
                                                  </>
                                              )}
                                            </div>
                                            {lecture.status && (
                                                <span
                                                    className={`text-xs px-3 py-1 rounded-full ${
                                                        lecture.status === "APPROVED"
                                                            ? "bg-green-100 text-green-700"
                                                            : lecture.status === "PENDING"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                        {lecture.status === "APPROVED"
                                            ? "승인"
                                            : lecture.status === "PENDING"
                                                ? "검토중"
                                                : "거절"}
                                      </span>
                                            )}
                                          </div>
                                          <div className="flex gap-2">
                                            {/* 승인 대기 중인 강의는 수정 불가 */}
                                            {lecture.status !== "PENDING" ? (
                                                <Link href={`/org/lectures/${lecture.id}/edit`}>
                                                  <Button variant="outline" size="sm">
                                                    수정
                                                  </Button>
                                                </Link>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled
                                                    title="승인 대기 중인 강의는 수정할 수 없습니다"
                                                >
                                                  수정
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteLecture(lecture.id)}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                ))}
                              </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                )}

                {/* ========== 강의승인현황 탭 ========== */}
                {activeTab === "approval" && (
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-2xl font-semibold mb-6">
                          강의승인현황
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <Card className="bg-yellow-50">
                            <CardContent className="p-4 text-center">
                              <p className="text-sm text-muted-foreground mb-1">
                                검토중
                              </p>
                              <p className="text-3xl font-bold text-yellow-600">
                                {isLoading ? "..." : stats.pending}
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="bg-green-50">
                            <CardContent className="p-4 text-center">
                              <p className="text-sm text-muted-foreground mb-1">
                                승인됨
                              </p>
                              <p className="text-3xl font-bold text-green-600">
                                {isLoading ? "..." : stats.approved}
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="bg-red-50">
                            <CardContent className="p-4 text-center">
                              <p className="text-sm text-muted-foreground mb-1">
                                거절됨
                              </p>
                              <p className="text-3xl font-bold text-red-600">
                                {isLoading ? "..." : stats.rejected}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                        {lectures.length > 0 && (
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">
                                승인 대기 강의
                              </h3>
                              {lectures.map((lecture) => (
                                  <Card key={lecture.id}>
                                    <CardContent className="p-4">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <h4 className="font-semibold mb-2">
                                            {lecture.title}
                                          </h4>
                                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                            {lecture.category && (
                                                <span>{lecture.category}</span>
                                            )}
                                            {lecture.startDate && (
                                                <>
                                                  {lecture.category && <span>•</span>}
                                                  <span>{lecture.startDate}</span>
                                                </>
                                            )}
                                          </div>
                                        </div>
                                        <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                                  검토중
                                </span>
                                      </div>
                                    </CardContent>
                                  </Card>
                              ))}
                            </div>
                        )}
                      </CardContent>
                    </Card>
                )}

                {/* ========== 리뷰조회 탭 ========== */}
                {activeTab === "reviews" && (
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-2xl font-semibold mb-6">리뷰조회</h2>
                        <div className="text-center py-8 text-muted-foreground">
                          리뷰 조회 기능은 준비 중입니다.
                        </div>
                      </CardContent>
                    </Card>
                )}
                {/* ========== 기관탈퇴 탭 ========== */}
                {activeTab === "withdrawal" && (
                    <Card>
                      <CardContent className="p-6 space-y-6">
                        <h2 className="text-2xl font-semibold mb-4">기관 계정 탈퇴</h2>

                        <div className="rounded-lg bg-destructive/10 p-4">
                          <div className="flex gap-3">
                            <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                            <div>
                              <h3 className="font-semibold text-destructive mb-2">
                                기관 계정을 삭제하면 모든 데이터가 영구 삭제됩니다.
                              </h3>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• 기관 정보</li>
                                <li>• 등록 강의 전체</li>
                                <li>• 승인 상태 기록</li>
                                <li>• 복구 불가</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                              type="checkbox"
                              id="withdrawal-confirm"
                              checked={withdrawalConfirmed}
                              onChange={(e) => setWithdrawalConfirmed(e.target.checked)}
                          />
                          <Label htmlFor="withdrawal-confirm">
                            기관 계정 삭제에 동의합니다
                          </Label>
                        </div>

                        <div className="flex gap-3">
                          <Button variant="destructive" onClick={handleWithdrawal}>
                            기관 탈퇴하기
                          </Button>
                          <Button
                              variant="outline"
                              onClick={() => setWithdrawalConfirmed(false)}
                          >
                            취소
                          </Button>
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