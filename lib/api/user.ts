// lib/api/user.ts

// ========== 사용자 API ==========
import { getValidToken } from "@/lib/auth-utils";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// .env 에 https://api.socam.kro.kr 처럼 넣어도 되고
// https://api.socam.kro.kr/api 처럼 넣어도 되게 처리
const API_BASE_URL =
  baseUrl
    ? baseUrl.endsWith("/api")
      ? baseUrl
      : `${baseUrl}/api`
    : "http://localhost:8080/api";

// ========== 인증 헤더 가져오기 ==========
function getAuthHeaders(): HeadersInit {
  // SSR/빌드 단계에서는 window 가 없으므로 인증 헤더 없이 보냄
  if (typeof window === "undefined") {
    return {
      "Content-Type": "application/json",
    };
  }

  const token = getValidToken();

  // 토큰이 없으면 Authorization 없이 보냄 (백엔드에서 401 처리)
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
    const errorData = await response.json().catch(() => ({} as any));
    throw new Error(
      (errorData as any).error ||
        (errorData as any).message ||
        `사용자 정보 조회 실패: ${response.status}`
    );
  }

  return response.json();
}

/**
 * 회원정보 수정
 * 백엔드에서는 토큰에 들어있는 이메일 기준으로 처리하므로
 * email 파라미터는 실제로 사용하지 않는다.
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
    const errorData = await response.json().catch(() => ({} as any));
    throw new Error(
      (errorData as any).error ||
        (errorData as any).message ||
        `회원정보 수정 실패: ${response.status}`
    );
  }

  return response.json();
}

/**
 * 회원 탈퇴
 * 마찬가지로 서버는 토큰의 이메일 기준으로 삭제 처리함.
 */
export async function deleteUser(email: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({} as any));
    throw new Error(
      (errorData as any).error ||
        (errorData as any).message ||
        `회원 탈퇴 실패: ${response.status}`
    );
  }
}