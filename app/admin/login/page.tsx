// ========== 관리자 로그인 페이지 ==========
// 역할: 비회원만
// 기능: 관리자 인증
// 주의: 이 페이지는 일반 사용자에게 노출되지 않습니다. URL을 직접 입력해야 접근 가능합니다.

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { loginAdmin } from "@/lib/api/admin-login";
import { Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ========== 이미 로그인된 경우 리다이렉트 ==========
  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminToken = sessionStorage.getItem("adminAccessToken");
      if (adminToken) {
        // 이미 로그인되어 있으면 대시보드로 이동
        router.push("/admin");
      }
    }
  }, [router]);

  // ========== 로그인 처리 ==========
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!adminEmail || !password) {
      setError("이메일과 비밀번호를 입력해주세요");
      return;
    }

    setIsLoading(true);

    try {
      await loginAdmin(adminEmail, password);

      // 자동 로그인 처리
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      // 관리자 대시보드로 이동
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background py-12">
        <div className="container mx-auto px-4">
          {/* ========== 로그인 카드 ========== */}
          <Card className="mx-auto max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl">관리자 로그인</CardTitle>
              <CardDescription>관리자 전용 페이지입니다</CardDescription>
            </CardHeader>

            <CardContent>
              {/* ========== 로그인 폼 ========== */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* ========== 이메일 입력 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">관리자 이메일</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="admin@example.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* ========== 패스워드 입력 ========== */}
                <div className="space-y-2">
                  <Label htmlFor="password">패스워드</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* ========== 자동 로그인 체크박스 ========== */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    이 기기에서 자동 로그인
                  </Label>
                </div>

                {/* ========== 에러 메시지 ========== */}
                {error && <p className="text-sm text-destructive">{error}</p>}

                {/* ========== 로그인 버튼 ========== */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>
              </form>

              {/* ========== 일반 로그인 링크 ========== */}
              <div className="mt-6 text-center text-sm">
                <a
                  href="/login"
                  className="text-muted-foreground hover:text-primary hover:underline"
                >
                  일반 로그인으로 돌아가기
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
