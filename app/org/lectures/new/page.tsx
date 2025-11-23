// ========== 강의 등록 페이지 ==========
// 역할: 운영기관만
// 기능: 새 강의 등록 (승인 대기 상태로 등록)

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { registerLecture, OrgLectureRequestDto } from "@/lib/api/org";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";

export default function NewLecturePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ========== 폼 상태 ==========
  const [formData, setFormData] = useState<OrgLectureRequestDto>({
    title: "",
    instructor: "",
    category: "",
    method: "",
    target: "",
    startDate: "",
    endDate: "",
    description: "",
    region: "",
    needCard: false,
    tuition: undefined,
    supportAvailable: false,
    applicationProcess: "",
    eligibility: "",
    employmentSupport: "",
    curriculum: "",
  });

  // ========== 이미지 파일 선택 ==========
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ========== 이미지 제거 ==========
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // input 초기화
    const input = document.getElementById("imageFile") as HTMLInputElement;
    if (input) input.value = "";
  };

  // ========== 폼 입력 처리 ==========
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========== 폼 제출 ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 필수 필드 검증
    if (!formData.title.trim()) {
      setError("강의명을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 빈 문자열 필드 제거
      const cleanedData: OrgLectureRequestDto = { ...formData };
      Object.keys(cleanedData).forEach((key) => {
        const value = cleanedData[key as keyof OrgLectureRequestDto];
        if (value === "" || value === null || value === undefined) {
          delete cleanedData[key as keyof OrgLectureRequestDto];
        }
      });

      await registerLecture(cleanedData, imageFile || undefined);

      // 성공 시 강의 관리 페이지로 이동
      router.push("/org?tab=lectures");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "강의 등록에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="bg-background min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ========== 헤더 ========== */}
          <div className="mb-6">
            <Link href="/org?tab=lectures">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                돌아가기
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2">새 강의 등록</h1>
            <p className="text-muted-foreground">
              강의 정보를 입력하세요. 등록 후 관리자 승인을 기다려야 합니다.
            </p>
          </div>

          {/* ========== 등록 폼 ========== */}
          <Card>
            <CardHeader>
              <CardTitle>강의 정보</CardTitle>
              <CardDescription>
                필수 항목을 입력하고 제출해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ========== 기본 정보 ========== */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">기본 정보</h3>

                  {/* 강의명 (필수) */}
                  <div>
                    <Label htmlFor="title">
                      강의명 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="예: React 완벽 마스터"
                      required
                      disabled={isLoading}
                      className="mt-2"
                    />
                  </div>

                  {/* 강사명 */}
                  <div>
                    <Label htmlFor="instructor">강사명</Label>
                    <Input
                      id="instructor"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleChange}
                      placeholder="예: 김강사"
                      disabled={isLoading}
                      className="mt-2"
                    />
                  </div>

                  {/* 카테고리 */}
                  <div>
                    <Label htmlFor="category">카테고리</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="카테고리를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="프론트엔드">프론트엔드</SelectItem>
                        <SelectItem value="백엔드">백엔드</SelectItem>
                        <SelectItem value="풀스택">풀스택</SelectItem>
                        <SelectItem value="모바일">모바일</SelectItem>
                        <SelectItem value="AI/데이터">AI/데이터</SelectItem>
                        <SelectItem value="AI">AI</SelectItem>
                        <SelectItem value="데이터">데이터</SelectItem>
                        <SelectItem value="클라우드">클라우드</SelectItem>
                        <SelectItem value="보안">보안</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                        <SelectItem value="기획/마케팅">기획/마케팅</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 수업방식 */}
                  <div>
                    <Label htmlFor="method">수업방식</Label>
                    <Select
                      value={formData.method}
                      onValueChange={(value) =>
                        handleSelectChange("method", value)
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="수업방식을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="온라인">온라인</SelectItem>
                        <SelectItem value="오프라인">오프라인</SelectItem>
                        <SelectItem value="혼합">혼합</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 수강 대상 */}
                  <div>
                    <Label htmlFor="target">수강 대상</Label>
                    <Select
                      value={formData.target}
                      onValueChange={(value) =>
                        handleSelectChange("target", value)
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="수강 대상을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="재직자">재직자</SelectItem>
                        <SelectItem value="취준생">취준생</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 기간 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">시작일</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">종료일</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* 간단 설명 */}
                  <div>
                    <Label htmlFor="description">간단 설명</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="강의에 대한 간단한 설명을 입력하세요"
                      rows={3}
                      disabled={isLoading}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* ========== 추가 정보 ========== */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold">추가 정보</h3>

                  {/* 지역 */}
                  <div>
                    <Label htmlFor="region">지역</Label>
                    <Input
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      placeholder="예: 서울"
                      disabled={isLoading}
                      className="mt-2"
                    />
                  </div>

                  {/* 수강료 */}
                  <div>
                    <Label htmlFor="tuition">수강료 (원)</Label>
                    <Input
                      id="tuition"
                      name="tuition"
                      type="number"
                      value={formData.tuition || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          tuition: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        }))
                      }
                      placeholder="예: 500000"
                      disabled={isLoading}
                      className="mt-2"
                    />
                  </div>

                  {/* 체크박스 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="needCard"
                        checked={formData.needCard || false}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("needCard", checked as boolean)
                        }
                        disabled={isLoading}
                      />
                      <Label htmlFor="needCard" className="cursor-pointer">
                        내일배움카드 필요
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="supportAvailable"
                        checked={formData.supportAvailable || false}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            "supportAvailable",
                            checked as boolean
                          )
                        }
                        disabled={isLoading}
                      />
                      <Label htmlFor="supportAvailable" className="cursor-pointer">
                        훈련지원금 여부
                      </Label>
                    </div>
                  </div>

                  {/* 지원절차 */}
                  <div>
                    <Label htmlFor="applicationProcess">지원절차</Label>
                    <Textarea
                      id="applicationProcess"
                      name="applicationProcess"
                      value={formData.applicationProcess}
                      onChange={handleChange}
                      placeholder="온라인 지원 후 서류 제출"
                      rows={3}
                      disabled={isLoading}
                      className="mt-2"
                    />
                  </div>

                  {/* 자격요건 */}
                  <div>
                    <Label htmlFor="eligibility">자격요건</Label>
                    <Textarea
                      id="eligibility"
                      name="eligibility"
                      value={formData.eligibility}
                      onChange={handleChange}
                      placeholder="프로그래밍 기초 지식"
                      rows={3}
                      disabled={isLoading}
                      className="mt-2"
                    />
                  </div>

                  {/* 채용 연계 */}
                  <div>
                    <Label htmlFor="employmentSupport">채용 연계 여부</Label>
                    <Textarea
                      id="employmentSupport"
                      name="employmentSupport"
                      value={formData.employmentSupport}
                      onChange={handleChange}
                      placeholder="채용 연계 가능"
                      rows={3}
                      disabled={isLoading}
                      className="mt-2"
                    />
                  </div>

                  {/* 커리큘럼 */}
                  <div>
                    <Label htmlFor="curriculum">커리큘럼</Label>
                    <Textarea
                      id="curriculum"
                      name="curriculum"
                      value={formData.curriculum}
                      onChange={handleChange}
                      placeholder="1주차: Spring Boot 기초..."
                      rows={5}
                      disabled={isLoading}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* ========== 이미지 업로드 ========== */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold">강의 이미지</h3>

                  <div>
                    <Label htmlFor="imageFile">이미지 파일 (선택)</Label>
                    <div className="mt-2">
                      {imagePreview ? (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="미리보기"
                            className="h-48 w-48 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveImage}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <label
                          htmlFor="imageFile"
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">
                              클릭하여 이미지 업로드
                            </p>
                          </div>
                          <input
                            id="imageFile"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isLoading}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* ========== 에러 메시지 ========== */}
                {error && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                    {error}
                  </div>
                )}

                {/* ========== 제출 버튼 ========== */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "등록 중..." : "강의 등록"}
                  </Button>
                  <Link href="/org?tab=lectures" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      취소
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}

