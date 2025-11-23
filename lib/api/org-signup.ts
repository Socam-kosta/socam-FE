// ========== 기관 회원가입 API ==========

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

/**
 * 기관 회원가입
 */
export async function registerOrg(
  email: string,
  password: string,
  orgName: string,
  contact: string,
  certificateFile: File
) {
  // FormData 생성
  const formData = new FormData();

  // JSON 데이터를 Blob으로 감싸서 추가 (스프링이 제대로 읽을 수 있도록)
  formData.append(
    "data",
    new Blob(
      [
        JSON.stringify({
          email,
          password,
          orgName,
          contact,
        }),
      ],
      { type: "application/json" }
    )
  );

  // 재직증명서 파일 추가
  formData.append("certificateFile", certificateFile);

  // API 호출
  const response = await fetch(`${API_BASE_URL}/org/register`, {
    method: "POST",
    body: formData,
    // FormData 사용 시 Content-Type은 자동으로 multipart/form-data로 설정됨
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

/**
 * 기관 이메일 중복 확인
 */
export async function checkOrgEmail(
  email: string
): Promise<{ available: boolean }> {
  const response = await fetch(
    `${API_BASE_URL}/org/check-email?email=${encodeURIComponent(email)}`,
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
