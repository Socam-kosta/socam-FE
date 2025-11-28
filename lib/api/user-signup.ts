// ========== 학생 회원가입 API ==========

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL = baseUrl 
  ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`)
  : "http://localhost:8080/api";

/**
 * 학생 이메일 중복 확인
 */
export async function checkUserEmail(
  email: string
): Promise<{ available: boolean; message: string }> {
  const response = await fetch(
    `${API_BASE_URL}/users/check-email?email=${encodeURIComponent(email)}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `이메일 확인 실패: ${response.status}`
    );
  }

  return response.json();
}

/**
 * 학생 닉네임 중복 확인
 */
export async function checkUserNickname(
  nickname: string
): Promise<{ available: boolean; message: string }> {
  const response = await fetch(
    `${API_BASE_URL}/users/check-nickname?nickname=${encodeURIComponent(
      nickname
    )}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `닉네임 확인 실패: ${response.status}`
    );
  }

  return response.json();
}

/**
 * 학생 회원가입
 */
export async function registerUser(
  email: string,
  password: string,
  name: string,
  nickname: string
) {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      name,
      nickname,
      role: "USER",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `회원가입 실패: ${response.status}`
    );
  }

  return response.json();
}
