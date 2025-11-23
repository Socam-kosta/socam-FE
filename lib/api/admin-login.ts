// ========== 관리자 로그인 API ==========

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export interface AdminLoginRequest {
  adminEmail: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  refreshToken: string;
  role?: string; // "ADMIN"
  name?: string;
  email?: string;
  nickname?: string;
}

/**
 * 관리자 로그인
 */
export async function loginAdmin(
  adminEmail: string,
  password: string
): Promise<AdminLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ adminEmail, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.error || `로그인 실패: ${response.status}`
    );
  }

  const data = await response.json();

  // 어드민 인증 정보는 sessionStorage에 저장 (새 창에서 공유되지 않음)
  if (data.accessToken) {
    sessionStorage.setItem("adminAccessToken", data.accessToken);
  }
  if (data.refreshToken) {
    sessionStorage.setItem("adminRefreshToken", data.refreshToken);
  }
  if (data.email || data.adminEmail) {
    sessionStorage.setItem("adminEmail", data.email || data.adminEmail);
  }
  // 백엔드 응답의 role 사용 (대문자 "ADMIN"), 없으면 기본값
  const role = data.role || "ADMIN";
  sessionStorage.setItem("adminUserType", role.toLowerCase()); // "admin"으로 저장

  return data;
}
