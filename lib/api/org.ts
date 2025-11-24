// ========== 기관 강의 관리 API ==========

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// ========== 공통 헤더 ==========
import { getValidToken } from "@/lib/auth-utils";

function getAuthHeaders() {
  const token = getValidToken();

  if (!token) {
    throw new Error("로그인이 필요합니다. 기관으로 로그인해주세요.");
  }

  return {
    Authorization: `Bearer ${token}`,
    // FormData 사용 시 Content-Type은 자동으로 설정되므로 명시하지 않음
  };
}

// ========== 강의 등록 DTO ==========
export interface OrgLectureRequestDto {
  title: string; // 필수
  instructor?: string;
  category?: string;
  method?: string;
  target?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  description?: string;
  imageUrl?: string; // 기존 URL 등록용
  region?: string;
  needCard?: boolean;
  tuition?: number;
  supportAvailable?: boolean;
  applicationProcess?: string;
  eligibility?: string;
  employmentSupport?: string;
  curriculum?: string;
}

/**
 * 강의 등록
 */
export async function registerLecture(
  data: OrgLectureRequestDto,
  imageFile?: File
): Promise<string> {
  const formData = new FormData();

  // JSON 데이터를 Blob으로 감싸서 추가
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  // 이미지 파일이 있으면 추가
  if (imageFile) {
    formData.append("imageFile", imageFile);
  }

  const headers = getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/org/lecture/add`, {
    method: "POST",
    headers: headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `강의 등록 실패: ${response.status}`
    );
  }

  return response.text(); // "강의 등록 완료 (승인 대기)" 메시지 반환
}

// ========== 기관 정보 DTO ==========
export interface OrgInfo {
  email: string;
  orgName: string;
  contact: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  certificatePath: string;
}

// ========== 강의 응답 DTO ==========
export interface LectureResponseDto {
  id: number;
  title: string;
  instructor?: string;
  organization?: string;
  category?: string;
  method?: string;
  target?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  status?: "PENDING" | "APPROVED" | "REJECTED";
  imageUrl?: string;
}

/**
 * 기관 정보 조회
 */
export async function getOrgInfo(): Promise<OrgInfo> {
  const authHeaders = getAuthHeaders();
  const headers = {
    ...authHeaders,
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_BASE_URL}/org/me`, {
    method: "GET",
    headers: headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `기관 정보 조회 실패: ${response.status}`
    );
  }

  return response.json();
}

/**
 * 내 강의 목록 조회
 */
export async function getMyLectures(
  status?: "PENDING" | "APPROVED" | "REJECTED"
): Promise<LectureResponseDto[]> {
  const authHeaders = getAuthHeaders();
  const headers = {
    ...authHeaders,
    "Content-Type": "application/json",
  };

  const statusParam = status ? `?status=${status}` : "";
  const response = await fetch(
    `${API_BASE_URL}/org/lecture/list${statusParam}`,
    {
      method: "GET",
      headers: headers,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `강의 목록 조회 실패: ${response.status}`
    );
  }

  return response.json();
}

// ========== 기관 정보 수정 DTO ==========
export interface OrgUpdateInfoReqDto {
  orgName?: string;
  contact?: string;
  password?: string;
}

/**
 * 기관 정보 수정
 */
export async function updateOrgInfo(
  email: string,
  data: OrgUpdateInfoReqDto
): Promise<OrgInfo> {
  const authHeaders = getAuthHeaders();
  const headers = {
    ...authHeaders,
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_BASE_URL}/org/me/${email}`, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `기관 정보 수정 실패: ${response.status}`
    );
  }

  return response.json();
}
/**
 * 운영기관 탈퇴 기능
 */
export async function deleteOrg(email: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/org/delete/${email}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "기관 탈퇴 실패");
  }
}

// ========== 강의 상세 DTO ==========
export interface LectureDetailDto {
  title: string;
  instructor?: string;
  organization?: string;
  category?: string;
  method?: string;
  target?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  description?: string;
  imageUrl?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  region?: string;
  needCard?: boolean;
  tuition?: number;
  supportAvailable?: boolean;
  applicationProcess?: string;
  eligibility?: string;
  employmentSupport?: string;
  curriculum?: string;
}

/**
 * 강의 상세 조회
 */
export async function getLectureDetail(
  lectureId: number
): Promise<LectureDetailDto> {
  const authHeaders = getAuthHeaders();
  const headers = {
    ...authHeaders,
    "Content-Type": "application/json",
  };

  const response = await fetch(
    `${API_BASE_URL}/org/lecture/${lectureId}`,
    {
      method: "GET",
      headers: headers,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `강의 상세 조회 실패: ${response.status}`
    );
  }

  return response.json();
}

/**
 * 강의 수정
 */
export async function updateLecture(
  lectureId: number,
  data: OrgLectureRequestDto,
  imageFile?: File
): Promise<string> {
  const formData = new FormData();

  // JSON 데이터를 Blob으로 감싸서 추가
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  // 이미지 파일이 있으면 추가
  if (imageFile) {
    formData.append("imageFile", imageFile);
  }

  const headers = getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/org/lecture/${lectureId}`,
    {
      method: "PUT",
      headers: headers,
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `강의 수정 실패: ${response.status}`
    );
  }

  return response.text(); // "강의 수정 완료 (승인 대기)" 메시지 반환
}

/**
 * 강의 삭제
 */
export async function deleteLecture(lectureId: number): Promise<string> {
  const authHeaders = getAuthHeaders();
  const headers = {
    ...authHeaders,
    "Content-Type": "application/json",
  };

  const response = await fetch(
    `${API_BASE_URL}/org/lecture/${lectureId}`,
    {
      method: "DELETE",
      headers: headers,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `강의 삭제 실패: ${response.status}`
    );
  }

  return response.text(); // "강의가 삭제되었습니다." 메시지 반환
}
