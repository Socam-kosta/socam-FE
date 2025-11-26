// ========== 헤더 컴포넌트 ==========
// 역할별 메뉴 표시: 비회원 / 학생 / 기관 / 관리자

"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import {
  getValidToken,
  getValidAdminToken,
  clearAuthData,
  clearAdminAuthData,
} from "@/lib/auth-utils";
import SessionTimer from "@/components/session-timer";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<"guest" | "user" | "org" | "admin">(
    "guest"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // ========== 검색 모달 열기 ==========
  const openSearchModal = () => {
    setIsSearchModalOpen(true);
    // 모달이 열릴 때 현재 검색어를 모달 검색어로 복사
    setModalSearchQuery(searchQuery);
    // 모달이 열린 후 검색창에 포커스
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  // ========== 검색 실행 함수 ==========
  const handleSearch = (query?: string) => {
    // 모달에서 호출된 경우 모달 검색어 사용, 아니면 헤더 검색어 사용
    const searchTerm = query || searchQuery || modalSearchQuery;
    if (searchTerm.trim()) {
      const trimmedQuery = searchTerm.trim();
      // URLSearchParams를 사용하여 한글 검색어를 안전하게 전달
      const params = new URLSearchParams();
      params.set("search", trimmedQuery);
      const searchUrl = `/lectures?${params.toString()}`;
      console.log("[헤더 검색] 원본:", trimmedQuery, "URL:", searchUrl);
      router.push(searchUrl);
      setSearchQuery("");
      setModalSearchQuery("");
      setIsSearchModalOpen(false);
    }
  };

  // ========== 사용자 타입 확인 (URL 경로에 따라 다르게 처리) ==========
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAdminPage =
        pathname?.startsWith("/admin") && pathname !== "/admin/login";

      if (isAdminPage) {
        // 어드민 페이지: sessionStorage에서 확인 (새 창에서 공유 안 됨)
        // 토큰 만료 검증
        const adminToken = getValidAdminToken();
        if (adminToken) {
          const adminUserType = sessionStorage
            .getItem("adminUserType")
            ?.toLowerCase();
          if (adminUserType === "admin" || adminUserType === "ADMIN") {
            setUserRole("admin");
          } else {
            setUserRole("guest");
          }
        } else {
          // 토큰이 없거나 만료된 경우
          setUserRole("guest");
        }
      } else {
        // 일반 페이지: localStorage에서 확인 (새 창에서 공유됨)
        // 토큰 만료 검증
        const token = getValidToken();
        if (token) {
          const userType = localStorage.getItem("userType")?.toLowerCase();
          // DTO 기준: Role = "USER" | "ADMIN" | "ORG" (대문자)
          // localStorage에는 소문자로 저장하지만, 대소문자 모두 처리
          if (userType === "org" || userType === "ORG") {
            setUserRole("org");
          } else if (userType === "user" || userType === "USER") {
            setUserRole("user");
          } else {
            setUserRole("guest");
          }
        } else {
          // 토큰이 없거나 만료된 경우
          setUserRole("guest");
        }
      }
    }
  }, [pathname]);

  // ========== 로그아웃 처리 ==========
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      const isAdminPage =
        pathname?.startsWith("/admin") && pathname !== "/admin/login";

      if (isAdminPage) {
        // 어드민 로그아웃: sessionStorage 정리
        clearAdminAuthData();
        setUserRole("guest");
        // 관리자 페이지에서 로그아웃하면 로그인 페이지로 이동
        router.push("/admin/login");
      } else {
        // 일반 사용자 로그아웃: localStorage 정리
        clearAuthData();
        setUserRole("guest");
        // 페이지 새로고침하여 모든 컴포넌트 상태 초기화
        window.location.href = "/";
      }
    }
  };

  // ========== 관리자 페이지에서 로그인된 경우 간단한 헤더 표시 ==========
  // /admin/login은 제외 (로그인 페이지는 일반 헤더 사용)
  const isAdminPage =
    pathname?.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminLoggedIn = userRole === "admin" && isAdminPage;

  if (isAdminLoggedIn) {
    return (
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-16">
            <Button variant="ghost" className="text-sm" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      {/* ========== 메인 헤더 바 ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-6">
          {/* ========== 좌측: 로고 + 네비게이션 메뉴 ========== */}
          <div className="flex items-center gap-8 flex-shrink-0">
            {/* 로고 */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  S
                </span>
              </div>
              <span className="text-xl font-bold">SOCAM</span>
            </Link>

            {/* 데스크톱 네비게이션 메뉴 */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/lectures"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                강의
              </Link>
              <Link
                href="/organizations"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                교육기관
              </Link>
              <Link
                href="/notices"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                공지사항
              </Link>
            </nav>
          </div>

          {/* ========== 검색 바 (공지사항 옆부터 돋보기까지) ========== */}
          <div className="hidden md:flex items-center flex-1 px-4 relative">
            <Input
              type="text"
              placeholder="비전공자 시작 강의"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={openSearchModal}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  openSearchModal();
                }
              }}
              className="flex-1 cursor-pointer pr-10"
              readOnly
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={openSearchModal}
              className="absolute right-4 hover:bg-transparent cursor-pointer"
              title="검색"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>

          {/* ========== 우측 액션 버튼 ========== */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            {/* ========== 역할별 사용자 메뉴 ========== */}
            {/* 비회원 */}
            {userRole === "guest" && (
              <>
                <Link href="/login">
                  <Button variant="outline" className="text-sm hover:text-primary">
                    로그인
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="text-sm">회원가입</Button>
                </Link>
              </>
            )}

            {/* 학생 */}
            {userRole === "user" && (
              <div className="flex items-center gap-2">
                <SessionTimer
                  onSessionExpired={() => {
                    clearAuthData();
                    setUserRole("guest");
                    window.location.href = "/";
                  }}
                />
                <Link href="/mypage">
                  <Button variant="ghost" className="text-sm">
                    마이페이지
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="text-sm"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </div>
            )}

            {/* 기관 */}
            {userRole === "org" && (
              <div className="flex items-center gap-2">
                <SessionTimer
                  onSessionExpired={() => {
                    clearAuthData();
                    setUserRole("guest");
                    window.location.href = "/";
                  }}
                />
                <Link href="/org">
                  <Button variant="ghost" className="text-sm">
                    기관관리
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="text-sm"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </div>
            )}

            {/* 관리자 (일반 페이지에서만 표시) */}
            {userRole === "admin" && !isAdminPage && (
              <div className="flex items-center gap-2">
                <Link href="/admin">
                  <Button variant="ghost" className="text-sm">
                    관리자
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="text-sm"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </div>
            )}
          </div>

          {/* ========== 모바일 메뉴 버튼 ========== */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ========== 모바일 네비게이션 메뉴 ========== */}
      {isOpen && (
        <nav className="md:hidden border-t border-border bg-card/50 pb-4 px-4 space-y-3">
          <Link
            href="/lectures"
            className="block text-sm hover:text-primary transition-colors py-2"
          >
            강의
          </Link>
          <Link
            href="/organizations"
            className="block text-sm hover:text-primary transition-colors py-2"
          >
            교육기관
          </Link>
          <Link
            href="/notices"
            className="block text-sm hover:text-primary transition-colors py-2"
          >
            공지사항
          </Link>

          {/* ========== 모바일 인증 버튼 ========== */}
          {userRole === "guest" && (
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full text-sm">
                  로그인
                </Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button className="w-full text-sm">회원가입</Button>
              </Link>
            </div>
          )}

          {userRole === "user" && (
            <>
              <Link href="/mypage">
                <Button variant="ghost" className="w-full justify-start">
                  마이페이지
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </>
          )}

          {userRole === "org" && (
            <>
              <Link href="/org">
                <Button variant="ghost" className="w-full justify-start">
                  기관관리
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </>
          )}

          {userRole === "admin" && !isAdminPage && (
            <>
              <Link href="/admin">
                <Button variant="ghost" className="w-full justify-start">
                  관리자
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </>
          )}
        </nav>
      )}

      {/* ========== 검색 모달 ========== */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              강의 검색
            </DialogTitle>
            <DialogDescription className="text-center">
              제목, 설명, 자격요건에서 검색어를 찾습니다
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="비전공자 시작 강의"
                value={modalSearchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setModalSearchQuery(value);
                  console.log("[모달 검색] 입력값:", value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch(modalSearchQuery);
                  }
                }}
                className="pl-12 h-14 text-lg"
              />
            </div>
            <Button
              onClick={() => handleSearch(modalSearchQuery)}
              size="lg"
              className="h-14 px-8"
              disabled={!modalSearchQuery.trim()}
            >
              <Search className="h-5 w-5 mr-2" />
              검색
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
