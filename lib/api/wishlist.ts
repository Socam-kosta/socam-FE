// ========== 찜하기 API ==========

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

/**
 * 인증 헤더 가져오기
 */
import { getValidToken } from "@/lib/auth-utils";

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") {
    throw new Error("브라우저 환경에서만 사용 가능합니다.");
  }

  const token = getValidToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * 찜하기 추가
 */
export async function addWishlist(
  email: string,
  lectureId: number
): Promise<void> {
  const headers = getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}/wishlist/add?email=${encodeURIComponent(
      email
    )}&lectureId=${lectureId}`,
    {
      method: "POST",
      headers,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `찜하기 추가 실패: ${response.status}`
    );
  }
}

/**
 * 찜하기 삭제
 */
export async function removeWishlist(
  email: string,
  lectureId: number
): Promise<void> {
  const headers = getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}/wishlist/remove?email=${encodeURIComponent(
      email
    )}&lectureId=${lectureId}`,
    {
      method: "DELETE",
      headers,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `찜하기 삭제 실패: ${response.status}`
    );
  }
}

/**
 * 찜 목록 조회
 */
export interface WishlistItem {
  id: number;
  lecture: {
    id: number;
    title: string;
    instructor?: string;
    organization?: string;
    imageUrl?: string;
    startDate?: string; // YYYY-MM-DD
    endDate?: string; // YYYY-MM-DD
  };
}

export async function getWishlist(email: string): Promise<WishlistItem[]> {
  try {
    const headers = getAuthHeaders();

    // 디버깅: 토큰 확인
    const token = getValidToken();
    if (process.env.NODE_ENV === "development") {
      console.log("[Wishlist] 토큰 존재:", token ? "있음" : "없음");
      const authHeader = Array.isArray(headers)
        ? headers.find(([key]) => key.toLowerCase() === "authorization")?.[1]
        : (headers as Record<string, string>).Authorization;
      console.log(
        "[Wishlist] Authorization 헤더:",
        authHeader ? "있음" : "없음"
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/wishlist/list?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      // 401 에러인 경우 상세 정보 로깅
      if (response.status === 401) {
        if (process.env.NODE_ENV === "development") {
          console.error(
            "[Wishlist] 401 에러 - 토큰:",
            token ? token.substring(0, 20) + "..." : "없음"
          );
          console.error(
            "[Wishlist] 401 에러 - 요청 URL:",
            `${API_BASE_URL}/wishlist/list?email=${encodeURIComponent(email)}`
          );
        }
        throw new Error("인증 필요");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          errorData.error ||
          `찜 목록 조회 실패: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    // 토큰이 없거나 인증 오류인 경우 조용히 처리
    if (error instanceof Error && error.message.includes("로그인이 필요")) {
      throw error;
    }
    // 기타 에러는 그대로 throw (호출하는 쪽에서 처리)
    throw error;
  }
}

/**
 * 특정 강의가 찜 목록에 있는지 확인
 */
export async function isWishlisted(
  email: string,
  lectureId: number
): Promise<boolean> {
  try {
    const wishlist = await getWishlist(email);
    return wishlist.some((item) => item.lecture.id === lectureId);
  } catch (error) {
    console.error("찜 목록 확인 실패:", error);
    return false;
  }
}
