// ========== 리뷰 API ==========

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL = baseUrl 
  ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`)
  : "http://localhost:8080/api";

// ========== 인증 헤더 가져오기 ==========
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

// ========== 리뷰 응답 DTO ==========
export interface ReviewResponseDto {
  reviewId?: number;
  email: string;
  lectureId?: string; // 강의 ID
  starRating: number;
  contents: string;
  filepath?: string;
  status?: string; // PENDING, APPROVED, REJECTED
  createdAt: string; // YYYY-MM-DDTHH:mm:ss
  updatedAt?: string;
}

/**
 * 강의별 리뷰 조회
 * @param lectureId 강의 ID (문자열로 전달)
 */
export async function getReviewsByLecture(
  lectureId: string | number
): Promise<ReviewResponseDto[]> {
  const response = await fetch(`${API_BASE_URL}/review/lecture/${lectureId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `리뷰 조회 실패: ${response.status}`
    );
  }

  return response.json();
}

/**
 * 강의의 평균 평점 계산
 */
export async function getLectureAverageRating(
  lectureId: string | number
): Promise<{ average: number; count: number }> {
  try {
    const reviews = await getReviewsByLecture(lectureId);

    // APPROVED 상태의 리뷰만 필터링 (백엔드에서 이미 필터링되어 있을 수도 있음)
    const approvedReviews = reviews; // 백엔드에서 이미 필터링된 것으로 가정

    if (approvedReviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = approvedReviews.reduce(
      (acc, review) => acc + review.starRating,
      0
    );
    const average = sum / approvedReviews.length;

    return {
      average: Math.round(average * 10) / 10, // 소수점 첫째자리까지
      count: approvedReviews.length,
    };
  } catch (error) {
    console.error(`강의 ${lectureId}의 평점 계산 실패:`, error);
    return { average: 0, count: 0 };
  }
}

/**
 * 내 리뷰 목록 조회
 */
export async function getMyReviews(
  email: string
): Promise<ReviewResponseDto[]> {
  const response = await fetch(`${API_BASE_URL}/review/user/${email}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `내 리뷰 조회 실패: ${response.status}`
    );
  }

  return response.json();
}

/**
 * 리뷰 등록 (수료증 파일 포함)
 */
export async function addReview(
  email: string,
  lectureId: string | number,
  starRating: number,
  contents: string,
  certificateFile: File
): Promise<string> {
  // 인증 헤더 가져오기
  const token = getValidToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  // FormData 생성
  const formData = new FormData();
  formData.append("email", email);
  formData.append("lectureId", String(lectureId));
  formData.append("starRating", String(starRating));
  formData.append("contents", contents);
  formData.append("certificateFile", certificateFile);

  const response = await fetch(`${API_BASE_URL}/review/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // multipart/form-data는 Content-Type을 설정하지 않음 (브라우저가 자동으로 설정)
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `리뷰 등록 실패: ${response.status}`
    );
  }

  return response.text();
}

/**
 * 리뷰 삭제
 */
export async function deleteReview(
  reviewId: number,
  email: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/review/delete/${reviewId}?email=${encodeURIComponent(email)}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `리뷰 삭제 실패: ${response.status}`
    );
  }
}
