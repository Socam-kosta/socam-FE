// ========== 기관 회원가입 페이지 ==========
// 역할: 비회원만
// 기능: 운영기관 계정 생성 및 승인 대기

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import { registerOrg, checkOrgEmail } from "@/lib/api/org-signup";

export default function OrgSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    orgName: "",
    contact: "",
  });
  const [certificate, setCertificate] = useState<File | null>(null);
  const [agreed, setAgreed] = useState({
    terms: false,
    privacy: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailCheckStatus, setEmailCheckStatus] = useState<{
    checked: boolean;
    available: boolean;
    message: string;
  }>({
    checked: false,
    available: false,
    message: "",
  });
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // ========== 파일 업로드 처리 ==========
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertificate(e.target.files[0]);
    }
  };

  // ========== 이메일 중복 확인 ==========
  const handleCheckEmail = async () => {
    if (!formData.email) {
      alert("이메일을 입력해주세요");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailCheckStatus({
        checked: true,
        available: false,
        message: "올바른 이메일 형식을 입력해주세요",
      });
      return;
    }

    setIsCheckingEmail(true);
    setEmailError("");
    setEmailCheckStatus({ checked: false, available: false, message: "" });

    try {
      const result = await checkOrgEmail(formData.email);
      setEmailCheckStatus({
        checked: true,
        available: result.available,
        message: result.available
          ? "사용 가능한 이메일입니다."
          : "이미 사용 중인 이메일입니다.",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "이메일 확인에 실패했습니다.";
      setEmailCheckStatus({
        checked: true,
        available: false,
        message: errorMessage,
      });
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // ========== 회원가입 처리 ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreed.terms || !agreed.privacy) {
      alert("필수 약관에 동의해주세요");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }

    if (!certificate) {
      alert("재직증명서를 첨부해주세요");
      return;
    }

    // 이메일 중복 확인 체크
    if (!emailCheckStatus.checked || !emailCheckStatus.available) {
      alert("이메일 중복 확인을 해주세요");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setEmailError("");

    try {
      // 백엔드 API 호출
      await registerOrg(
        formData.email,
        formData.password,
        formData.orgName,
        formData.contact,
        certificate
      );

      alert("기관 가입이 신청되었습니다. 관리자 검토 후 연락드리겠습니다");
      router.push("/login");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "회원가입에 실패했습니다.";
      setError(errorMessage);

      // 이메일 중복 에러 체크
      if (
        errorMessage.includes("이메일") ||
        errorMessage.includes("email") ||
        errorMessage.includes("중복") ||
        errorMessage.includes("duplicate") ||
        errorMessage.includes("already")
      ) {
        setEmailError("이미 사용 중인 이메일입니다.");
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <main className="bg-background py-12">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">기관 회원가입</CardTitle>
              <CardDescription>
                강의를 등록하고 관리할 수 있습니다 (관리자 승인 필요)
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* ========== 회원가입 폼 ========== */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ========== 기관 이메일 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="email">기관 이메일 *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="org@company.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        // 이메일 변경 시 중복 확인 상태 초기화
                        setEmailError("");
                        setEmailCheckStatus({
                          checked: false,
                          available: false,
                          message: "",
                        });
                      }}
                      required
                      className={`flex-1 ${
                        emailError ||
                        (emailCheckStatus.checked &&
                          !emailCheckStatus.available)
                          ? "border-destructive"
                          : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCheckEmail}
                      disabled={isCheckingEmail || !formData.email}
                    >
                      {isCheckingEmail ? "확인 중..." : "중복확인"}
                    </Button>
                  </div>
                  {/* ========== 이메일 중복 확인 결과 ========== */}
                  {emailCheckStatus.checked && (
                    <p
                      className={`text-sm ${
                        emailCheckStatus.available
                          ? "text-green-600"
                          : "text-destructive"
                      }`}
                    >
                      {emailCheckStatus.message}
                    </p>
                  )}
                  {/* ========== 이메일 에러 메시지 (회원가입 실패 시) ========== */}
                  {emailError && (
                    <p className="text-sm text-destructive">{emailError}</p>
                  )}
                </div>

                {/* ========== 패스워드 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="password">패스워드 *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="8자 이상, 영문+숫자+특수문자"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>

                {/* ========== 패스워드 확인 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="passwordConfirm">패스워드 확인 *</Label>
                  <Input
                    id="passwordConfirm"
                    type="password"
                    placeholder="패스워드를 다시 입력하세요"
                    value={formData.passwordConfirm}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passwordConfirm: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* ========== 기관명 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="orgName">기관명 *</Label>
                  <Input
                    id="orgName"
                    type="text"
                    placeholder="ABC학원"
                    value={formData.orgName}
                    onChange={(e) =>
                      setFormData({ ...formData, orgName: e.target.value })
                    }
                    required
                  />
                </div>

                {/* ========== 연락처 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="contact">연락처 *</Label>
                  <Input
                    id="contact"
                    type="tel"
                    placeholder="02-1234-5678"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    required
                  />
                </div>

                {/* ========== 재직증명서 업로드 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="certificate">
                    재직증명서 * (PDF, JPG, PNG만 가능, 최대 10MB)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="certificate"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        document.getElementById("certificate")?.click()
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {certificate ? certificate.name : "파일 선택"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    기업 재직증명서를 첨부해주세요. 승인 대기 기간은 3-5일입니다
                  </p>
                </div>

                {/* ========== 약관 동의 ========== */}
                <div className="space-y-3 rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreed.terms}
                      onCheckedChange={(checked) =>
                        setAgreed({ ...agreed, terms: checked as boolean })
                      }
                    />
                    <Label htmlFor="terms" className="font-normal">
                      SOCAM 이용약관에 동의합니다 (필수)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="privacy"
                      checked={agreed.privacy}
                      onCheckedChange={(checked) =>
                        setAgreed({ ...agreed, privacy: checked as boolean })
                      }
                    />
                    <Label htmlFor="privacy" className="font-normal">
                      개인정보처리방침에 동의합니다 (필수)
                    </Label>
                  </div>
                </div>

                {/* ========== 에러 메시지 ========== */}
                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {/* ========== 가입 신청 버튼 ========== */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "처리 중..." : "가입 신청"}
                </Button>
              </form>

              {/* ========== 하단 링크 ========== */}
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  이미 계정이 있으신가요?{" "}
                </span>
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  로그인하기
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
