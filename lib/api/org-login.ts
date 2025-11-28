// ========== 기관 로그인 API ==========

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL = baseUrl 
  ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`)
  : "http://localhost:8080/api";

export interface OrgLoginRequest {
  email: string;
  password: string;
}

export interface OrgLoginResponse {
  accessToken: string;
  refreshToken: string;
  email?: string;
  orgName?: string;
  status?: string; // "PENDING" | "APPROVED" | "REJECTED"
  role?: string; // "ORG" (백엔드 응답에 없을 수 있음)
}

/**
 * 기관 로그인
 */
export async function loginOrg(
  email: string,
  password: string
): Promise<OrgLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/org/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.error || `로그인 실패: ${response.status}`
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
  // 백엔드 응답의 role 사용 (없으면 "ORG" 기본값, OrgService는 role을 응답에 포함하지 않음)
  const role = data.role || "ORG";
  localStorage.setItem("userType", role.toLowerCase()); // "org"로 저장

  return data;
}
