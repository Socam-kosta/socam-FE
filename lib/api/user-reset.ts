const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// 🔹 비밀번호 재설정 요청 (메일 발송)
export async function requestPasswordReset(email: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/users/password-reset-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "메일 전송에 실패했습니다.");
    }
}

// 🔹 실제 비밀번호 재설정
export async function resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string
): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "비밀번호 변경에 실패했습니다.");
    }
}
