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
 *
 * Note: 현재 백엔드 API는 관리자 권한이 필요하지만,
 * 일반 사용자도 공지사항을 볼 수 있어야 하므로
 * 백엔드에 공개 API가 추가되면 그쪽을 사용하도록 수정 필요
 */
export async function getPublicNotices(): Promise<NoticeResponseDto[]> {
  try {
    // TODO: 백엔드에 공개 공지사항 API가 있다면 그것을 사용
    // 현재는 관리자 API를 사용하되, 프론트엔드에서 VISIBLE만 필터링
    // 또는 백엔드에 /api/notices 같은 공개 엔드포인트 추가 필요

    // 임시로 빈 배열 반환 (백엔드에 공개 API가 없을 경우)
    // 실제로는 백엔드에 공개 공지사항 조회 API를 추가해야 함
    return [];
  } catch (error) {
    console.error("공지사항 조회 실패:", error);
    return [];
  }
}

/**
 * 공지사항 상세 조회 (일반 사용자용)
 */
export async function getPublicNoticeDetail(
  noticeId: number
): Promise<NoticeResponseDto | null> {
  try {
    // TODO: 백엔드에 공개 공지사항 상세 조회 API 추가 필요
    return null;
  } catch (error) {
    console.error("공지사항 상세 조회 실패:", error);
    return null;
  }
}
