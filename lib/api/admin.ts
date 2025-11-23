// ========== 관리자 API ==========

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// 디버깅: 환경 변수 로드 확인 (개발 환경에서만)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("API_BASE_URL:", API_BASE_URL);
  console.log(
    "NEXT_PUBLIC_API_BASE_URL:",
    process.env.NEXT_PUBLIC_API_BASE_URL
  );
}

// ========== 공통 헤더 ==========
function getAuthHeaders() {
  // 어드민 인증 토큰은 sessionStorage에서 가져옴
  const token = sessionStorage.getItem("adminAccessToken");

  // 디버깅: 토큰 확인
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log("Admin Access Token:", token ? "존재함" : "없음");
  }

  if (!token) {
    throw new Error("로그인이 필요합니다. 관리자로 로그인해주세요.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ========== 기관 관리 API ==========

export interface OrgListItem {
  email: string;
  orgName: string;
  contact: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  certificatePath: string;
}

/**
 * 운영기관 목록 조회 (미승인 포함)
 */
export async function getOrgList(): Promise<OrgListItem[]> {
  try {
    const headers = getAuthHeaders();

    // 디버깅: 요청 정보 확인
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      console.log("GET 요청:", `${API_BASE_URL}/admin/orgs`);
      console.log("헤더:", headers);
    }

    const response = await fetch(`${API_BASE_URL}/admin/orgs`, {
      method: "GET",
      headers: headers,
    });

    // 디버깅: 응답 상태 확인
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      console.log("응답 상태:", response.status, response.statusText);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // 401 에러인 경우 특별 처리
      if (response.status === 401) {
        throw new Error("인증이 필요합니다. 관리자로 다시 로그인해주세요.");
      }

      throw new Error(
        errorData.message ||
          errorData.error ||
          `기관 목록 조회 실패: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    // 네트워크 에러 처리
    if (error instanceof TypeError) {
      if (
        error.message === "Failed to fetch" ||
        error.message.includes("ERR_FAILED")
      ) {
        throw new Error(
          `서버에 연결할 수 없습니다. 백엔드 서버(${API_BASE_URL})가 실행 중인지 확인해주세요.`
        );
      }
      if (error.message.includes("CORS")) {
        throw new Error(
          `CORS 에러가 발생했습니다. 백엔드 서버의 CORS 설정을 확인해주세요.`
        );
      }
    }
    throw error;
  }
}

/**
 * 운영기관 승인/거절 처리
 */
export async function updateOrgStatus(
  email: string,
  status: "APPROVED" | "REJECTED",
  reason?: string
): Promise<OrgListItem> {
  const response = await fetch(`${API_BASE_URL}/admin/orgs/${email}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      status,
      ...(reason && { reason }),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `기관 상태 변경 실패: ${response.status}`
    );
  }

  return response.json();
}

// ========== 강의 관리 API ==========

export interface LectureListItem {
  lectureId: number;
  title: string;
  orgName: string;
  email: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface LectureDetail extends LectureListItem {
  id: number;
  organization: string;
  description: string;
  imageUrl?: string;
  region?: string;
  needCard?: boolean;
  tuition?: number;
  supportAvailable?: boolean;
  applicationProcess?: string;
  eligibility?: string;
  employmentSupport?: string;
  curriculum?: string;
  [key: string]: any;
}

/**
 * 미승인 강의 목록 조회
 */
export async function getPendingLectures(): Promise<LectureListItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/lectures/pending`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          errorData.error ||
          `강의 목록 조회 실패: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    // 네트워크 에러 처리
    if (error instanceof TypeError) {
      if (
        error.message === "Failed to fetch" ||
        error.message.includes("ERR_FAILED")
      ) {
        throw new Error(
          `서버에 연결할 수 없습니다. 백엔드 서버(${API_BASE_URL})가 실행 중인지 확인해주세요.`
        );
      }
      if (error.message.includes("CORS")) {
        throw new Error(
          `CORS 에러가 발생했습니다. 백엔드 서버의 CORS 설정을 확인해주세요.`
        );
      }
    }
    throw error;
  }
}

/**
 * 상태별 강의 목록 조회
 * 백엔드 API: GET /api/admin/lectures/status/{status}
 */
export async function getLecturesByStatus(
  status: "PENDING" | "APPROVED" | "REJECTED"
): Promise<LectureListItem[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/lectures/status/${status}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          errorData.error ||
          `강의 목록 조회 실패: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      if (
        error.message === "Failed to fetch" ||
        error.message.includes("ERR_FAILED")
      ) {
        throw new Error(
          `서버에 연결할 수 없습니다. 백엔드 서버(${API_BASE_URL})가 실행 중인지 확인해주세요.`
        );
      }
    }
    throw error;
  }
}

/**
 * 강의 상세 조회
 */
export async function getLectureDetail(
  lectureId: number
): Promise<LectureDetail> {
  const response = await fetch(`${API_BASE_URL}/admin/lectures/${lectureId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `강의 상세 조회 실패: ${response.status}`
    );
  }

  return response.json();
}

/**
 * 강의 승인/거절 처리
 */
export async function updateLectureStatus(
  lectureId: number,
  status: "APPROVED" | "REJECTED",
  reason?: string
): Promise<LectureDetail> {
  const response = await fetch(
    `${API_BASE_URL}/admin/lectures/${lectureId}/status`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status,
        ...(reason && { reason }),
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `강의 상태 변경 실패: ${response.status}`
    );
  }

  return response.json();
}

/**
 * 강의 삭제
 */
export async function deleteLecture(lectureId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/lectures/${lectureId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `강의 삭제 실패: ${response.status}`
    );
  }
}

// ========== 리뷰 관리 API ==========

export interface ReviewListItem {
  reviewId: number;
  email: string;
  lectureId: string;
  starRating: number;
  contents: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  lectureName?: string;
  author?: string;
}

/**
 * 리뷰 목록 조회 (미승인)
 */
export async function getReviewList(): Promise<ReviewListItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reviews`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          errorData.error ||
          `리뷰 목록 조회 실패: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    // 네트워크 에러 처리
    if (error instanceof TypeError) {
      if (
        error.message === "Failed to fetch" ||
        error.message.includes("ERR_FAILED")
      ) {
        throw new Error(
          `서버에 연결할 수 없습니다. 백엔드 서버(${API_BASE_URL})가 실행 중인지 확인해주세요.`
        );
      }
      if (error.message.includes("CORS")) {
        throw new Error(
          `CORS 에러가 발생했습니다. 백엔드 서버의 CORS 설정을 확인해주세요.`
        );
      }
    }
    throw error;
  }
}

/**
 * 상태별 리뷰 목록 조회
 */
export async function getReviewsByStatus(
  status: "PENDING" | "APPROVED" | "REJECTED"
): Promise<ReviewListItem[]> {
  const response = await fetch(
    `${API_BASE_URL}/admin/reviews/status/${status}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `리뷰 목록 조회 실패: ${response.status}`
    );
  }

  return response.json();
}

/**
 * 리뷰 승인/거절 처리
 */
export async function updateReviewStatus(
  reviewId: number,
  status: "APPROVED" | "REJECTED",
  reason?: string
): Promise<ReviewListItem> {
  const response = await fetch(
    `${API_BASE_URL}/admin/reviews/${reviewId}/status`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status,
        ...(reason && { reason }),
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `리뷰 상태 변경 실패: ${response.status}`
    );
  }

  return response.json();
}

// ========== 공지사항 관리 API ==========

export interface NoticeItem {
  noticeId: number;
  adminEmail?: string;
  title: string;
  contents: string;
  status: "VISIBLE" | "REJECTED";
  regDate: string;
  viewCount: number;
}

export interface CreateNoticeRequest {
  adminEmail: string;
  title: string;
  contents: string;
}

/**
 * 공지사항 등록
 */
export async function createNotice(
  data: CreateNoticeRequest
): Promise<NoticeItem> {
  const response = await fetch(`${API_BASE_URL}/admin/notices`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `공지사항 등록 실패: ${response.status}`
    );
  }

  return response.json();
}

/**
 * 공지사항 목록 조회
 */
export async function getNoticeList(): Promise<NoticeItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/notices`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          errorData.error ||
          `공지사항 목록 조회 실패: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      if (
        error.message === "Failed to fetch" ||
        error.message.includes("ERR_FAILED")
      ) {
        throw new Error(
          `서버에 연결할 수 없습니다. 백엔드 서버(${API_BASE_URL})가 실행 중인지 확인해주세요.`
        );
      }
    }
    throw error;
  }
}

/**
 * 공지사항 상세 조회
 */
export async function getNoticeDetail(noticeId: number): Promise<NoticeItem> {
  const response = await fetch(`${API_BASE_URL}/admin/notices/${noticeId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `공지사항 상세 조회 실패: ${response.status}`
    );
  }

  return response.json();
}

export interface UpdateNoticeRequest {
  title?: string;
  contents?: string;
  status?: "VISIBLE" | "REJECTED";
}

/**
 * 공지사항 수정
 */
export async function updateNotice(
  noticeId: number,
  data: UpdateNoticeRequest
): Promise<NoticeItem> {
  const response = await fetch(`${API_BASE_URL}/admin/notices/${noticeId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `공지사항 수정 실패: ${response.status}`
    );
  }

  return response.json();
}

/**
 * 공지사항 삭제
 */
export async function deleteNotice(noticeId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/notices/${noticeId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `공지사항 삭제 실패: ${response.status}`
    );
  }
}

/**
 * 공지사항 상태 변경 (VISIBLE ↔ REJECTED)
 */
export async function updateNoticeStatus(
  noticeId: number,
  status: "VISIBLE" | "REJECTED"
): Promise<NoticeItem> {
  const response = await fetch(
    `${API_BASE_URL}/admin/notices/${noticeId}/status?status=${status}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `공지사항 상태 변경 실패: ${response.status}`
    );
  }

  return response.json();
}

// ========== 통계 API ==========

export interface AdminStats {
  totalOrgs: number;
  pendingOrgs: number;
  totalLectures: number;
  pendingLectures: number;
  totalReviews: number;
  pendingReviews: number;
  totalNotices: number;
}

/**
 * 관리자 대시보드 통계 조회
 * (각 API를 개별 호출하여 통계를 계산)
 */
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [orgs, lectures, reviews, notices] = await Promise.all([
      getOrgList().catch(() => []),
      getPendingLectures().catch(() => []),
      getReviewList().catch(() => []),
      getNoticeList().catch(() => []),
    ]);

    const pendingOrgs = orgs.filter((org) => org.status === "PENDING").length;
    const pendingReviews = reviews.filter(
      (review) => review.status === "PENDING"
    ).length;

    return {
      totalOrgs: orgs.length,
      pendingOrgs,
      totalLectures: lectures.length,
      pendingLectures: lectures.length,
      totalReviews: reviews.length,
      pendingReviews,
      totalNotices: notices.length,
    };
  } catch (error) {
    console.error("통계 조회 실패:", error);
    throw error;
  }
}
