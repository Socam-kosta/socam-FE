// ========== 인증 API ==========
// 토큰 재발급 등 인증 관련 API

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL = baseUrl 
  ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`)
  : "http://localhost:8080/api";

export interface RefreshTokenResponse {
  accessToken: string;
}

/**
 * Refresh Token을 사용하여 새로운 Access Token 발급
 */
export async function refreshAccessToken(): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("브라우저 환경에서만 사용 가능합니다.");
  }

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("Refresh Token이 없습니다. 다시 로그인해주세요.");
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Refresh Token도 만료된 경우
    if (response.status === 401) {
      // 모든 인증 정보 삭제
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userType");
      throw new Error("세션이 만료되었습니다. 다시 로그인해주세요.");
    }

    throw new Error(
      errorData.error ||
        errorData.message ||
        `토큰 재발급 실패: ${response.status}`
    );
  }

  const data: RefreshTokenResponse = await response.json();
  
  // 새로운 Access Token 저장
  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }

  return data.accessToken;
}

