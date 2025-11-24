// ========== 공지사항 API (일반 사용자용) ==========

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// ========== 공지사항 응답 DTO ==========
export interface NoticeResponseDto {
  noticeId: number;
  adminEmail: string;
  title: string;
  contents: string;
  regDate: string; // YYYY-MM-DDTHH:mm:ss
  status: "VISIBLE" | "REJECTED";
  viewCount?: number;
  editDate?: string;
}

/**
 * 공개된 공지사항 목록 조회 (일반 사용자용)
 * status가 VISIBLE인 공지사항만 반환
 */
export async function getPublicNotices(): Promise<NoticeResponseDto[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/notices`, {
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
          `공지사항 목록 조회 실패: ${response.status}`
      );
    }

    const data = await response.json();
    return data.map((notice: any) => ({
      noticeId: notice.noticeId,
      adminEmail: notice.adminEmail,
      title: notice.title,
      contents: notice.contents,
      regDate: notice.regDate,
      status: notice.status,
      viewCount: notice.viewCount || 0,
      editDate: notice.editDate,
    }));
  } catch (error) {
    console.error("공지사항 조회 실패:", error);
    return [];
  }
}

/**
 * 공지사항 상세 조회 (일반 사용자용)
 * 조회수 증가 없음
 */
export async function getPublicNoticeDetail(
  noticeId: number
): Promise<NoticeResponseDto | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/notices/${noticeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          errorData.message ||
          `공지사항 상세 조회 실패: ${response.status}`
      );
    }

    const data = await response.json();
    return {
      noticeId: data.noticeId,
      adminEmail: data.adminEmail,
      title: data.title,
      contents: data.contents,
      regDate: data.regDate,
      status: data.status,
      viewCount: data.viewCount || 0,
      editDate: data.editDate,
    };
  } catch (error) {
    console.error("공지사항 상세 조회 실패:", error);
    return null;
  }
}

/**
 * 공지사항 조회수 증가 (별도 호출)
 */
export async function incrementNoticeViewCount(
  noticeId: number
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/notices/${noticeId}/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // 조회수 증가 실패는 조용히 처리 (에러 로그만)
      console.warn(`공지사항 조회수 증가 실패: ${response.status}`);
    }
  } catch (error) {
    // 조회수 증가 실패는 조용히 처리
    console.warn("공지사항 조회수 증가 실패:", error);
  }
}
