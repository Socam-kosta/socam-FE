// ========== 인증 유틸리티 ==========
// JWT 토큰 만료 검증 및 관리

/**
 * JWT 토큰의 payload를 디코딩하여 만료 시간 확인
 */
function decodeJwtPayload(token: string): { exp?: number; iat?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (error) {
    console.error('JWT 토큰 디코딩 실패:', error);
    return null;
  }
}

/**
 * JWT 토큰이 만료되었는지 확인
 */
export function isTokenExpired(token: string): boolean {
  if (!token) {
    return true;
  }

  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) {
    return true; // 만료 시간 정보가 없으면 만료된 것으로 간주
  }

  // exp는 초 단위이므로 밀리초로 변환
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();

  return currentTime >= expirationTime;
}

/**
 * localStorage에서 토큰을 가져와서 만료 여부 확인
 * 만료되었으면 삭제하고 null 반환
 */
export function getValidToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = localStorage.getItem('accessToken');
  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    // 만료된 토큰이면 모든 인증 정보 삭제
    clearAuthData();
    return null;
  }

  return token;
}

/**
 * 모든 인증 데이터 삭제
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userType');
  localStorage.removeItem('rememberMe');
}

/**
 * sessionStorage에서 어드민 토큰을 가져와서 만료 여부 확인
 */
export function getValidAdminToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = sessionStorage.getItem('adminAccessToken');
  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    // 만료된 토큰이면 모든 어드민 인증 정보 삭제
    clearAdminAuthData();
    return null;
  }

  return token;
}

/**
 * 모든 어드민 인증 데이터 삭제
 */
export function clearAdminAuthData(): void {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.removeItem('adminAccessToken');
  sessionStorage.removeItem('adminRefreshToken');
  sessionStorage.removeItem('adminEmail');
  sessionStorage.removeItem('adminUserType');
}

/**
 * 토큰의 만료 시간(밀리초) 반환
 */
export function getTokenExpirationTime(token: string): number | null {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) {
    return null;
  }
  // exp는 초 단위이므로 밀리초로 변환
  return payload.exp * 1000;
}

/**
 * 토큰 만료까지 남은 시간(밀리초) 반환
 */
export function getTimeUntilExpiration(token: string): number | null {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) {
    return null;
  }
  const currentTime = Date.now();
  const timeLeft = expirationTime - currentTime;
  return timeLeft > 0 ? timeLeft : 0;
}

/**
 * 남은 시간을 읽기 쉬운 형식으로 변환 (예: "1시간 30분", "45분", "5분")
 */
export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) {
    return '만료됨';
  }

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    if (remainingMinutes > 0) {
      return `${hours}시간 ${remainingMinutes}분`;
    }
    return `${hours}시간`;
  }

  if (minutes > 0) {
    return `${minutes}분`;
  }

  return `${seconds}초`;
}

