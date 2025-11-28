// ========== 교육기관 공개 API ==========
// 일반 사용자가 볼 수 있는 기관 정보

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL = baseUrl 
  ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`)
  : "http://localhost:8080/api";

export interface OrganizationInfo {
  email: string;
  orgName: string;
  contact: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

/**
 * 승인된 교육기관 목록 조회 (공개 API)
 */
export async function getApprovedOrganizations(): Promise<OrganizationInfo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/org/public/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          errorData.message ||
          `기관 목록 조회 실패: ${response.status}`
      );
    }

    const data = await response.json();
    return data.map((org: any) => ({
      email: org.email,
      orgName: org.orgName,
      contact: org.contact,
      status: org.status,
    }));
  } catch (error) {
    console.error("기관 목록 조회 실패:", error);
    return [];
  }
}

/**
 * 기관별 강의 수 조회
 * 강의 목록에서 기관별로 필터링하여 개수 계산
 */
export async function getOrgLectureCount(orgName: string): Promise<number> {
  try {
    // 강의 목록 API를 사용하여 해당 기관의 강의 수 계산
    const response = await fetch(`${API_BASE_URL}/lecture/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return 0;
    }

    const lectures = await response.json();
    // 강의의 organization 필드가 기관명과 일치하는지 확인
    const orgLectures = lectures.filter((lecture: any) => {
      return lecture.organization === orgName;
    });

    return orgLectures.length;
  } catch (error) {
    console.error("기관 강의 수 조회 실패:", error);
    return 0;
  }
}

