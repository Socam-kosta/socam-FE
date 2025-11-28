// ========== 사용자 로그인 API ==========

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL = baseUrl 
  ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`)
  : "http://localhost:8080/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role?: string; // "USER"
  name?: string;
  email?: string;
  nickname?: string;
}

/**
 * 사용자 로그인
 */
export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `로그인 실패: ${response.status}`
    );
  }

  const data = await response.json();
  
  // JWT 토큰을 localStorage에 저장
  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }
  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }
  if (data.email) {
    localStorage.setItem("userEmail", data.email);
  }
  // 백엔드 응답의 role 사용 (대문자 "USER"), 없으면 기본값
  const role = data.role || "USER";
  localStorage.setItem("userType", role.toLowerCase()); // "user"로 저장

  return data;
}

