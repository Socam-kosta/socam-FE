// ========== 사용자 API ==========

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL = baseUrl 
  ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`)
  : "http://localhost:8080/api";

// ========== 인증 헤더 가져오기 ==========
import { getValidToken } from "@/lib/auth-utils";

function getAuthHeaders(): HeadersInit {
  // 서버(SSR/빌드) 환경에서는 인증 헤더를 붙이지 않고, 기본 헤더만 반환
  if (typeof window === "undefined") {
    return {
      "Content-Type": "application/json",
    };
  }

  const token = getValidToken();

  // 토큰이 없으면 일단 Authorization 없이 보냄
  if (!token) {
    return {
      "Content-Type": "application/json",
    };
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ========== 사용자 정보 DTO ==========
export interface UserInfo {
  email: string;
  name: string;
  nickname: string;
  role: "USER" | "ORG" | "ADMIN";
  createdAt?: string; // 가입일
}

// ========== 사용자 정보 수정 요청 DTO ==========
export interface UpdateUserRequest {
  name?: string;
  nickname?: string;
  password?: string;
}

/**
 * 내 정보 조회
 */
export async function getMyInfo(): Promise<UserInfo> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `사용자 정보 조회 실패: ${response.status}`
    );
  }

  return response.json();
}

/**
 * 회원정보 수정
 */
export async function updateUserInfo(
  email: string,
  data: UpdateUserRequest
): Promise<UserInfo> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `회원정보 수정 실패: ${response.status}`
    );
  }

  return response.json();
}

/**
 * 회원 탈퇴
 */
export async function deleteUser(email: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `회원 탈퇴 실패: ${response.status}`
    );
  }
}

