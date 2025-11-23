// ========== 강의 API ==========

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// ========== 강의 응답 DTO ==========
export interface LectureResponseDto {
  id: number;
  title: string;
  instructor?: string;
  organization?: string;
  category?: string;
  method?: string;
  target?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  status?: "PENDING" | "APPROVED" | "REJECTED";
  imageUrl?: string;
}

export interface LectureDetailDto extends LectureResponseDto {
  description?: string;
  region?: string;
  needCard?: boolean;
  tuition?: number;
  supportAvailable?: boolean;
  applicationProcess?: string;
  eligibility?: string;
  employmentSupport?: string;
  curriculum?: string;
}

/**
 * 분류별 강의 조회
 * @param target 취준생(jobseeker) 또는 재직자(employee)
 * @param method 온라인(online) 또는 오프라인(offline)
 * @param category 카테고리 (프론트엔드, 백엔드, AI 등)
 */
export async function getLecturesByFilter(
  target?: string,
  method?: string,
  category?: string
): Promise<LectureResponseDto[]> {
  // 필터가 모두 제공된 경우에만 경로 파라미터 API 사용
  if (target && method && category) {
    const response = await fetch(
      `${API_BASE_URL}/lecture/${target}/${method}/${category}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
          errorData.message ||
          `강의 목록 조회 실패: ${response.status}`
      );
    }

    return response.json();
  }

  // 필터가 없는 경우, 모든 조합으로 호출하여 합치기
  // TODO: 백엔드에 전체 강의 조회 API가 있다면 그것을 사용하는 것이 더 효율적
  const targets = ["jobseeker", "employee"];
  const methods = ["online", "offline"];
  const categories = [
    "프론트엔드",
    "백엔드",
    "AI",
    "클라우드",
    "모바일",
    "풀스택",
    "보안",
    "DevOps",
  ];

  const allPromises: Promise<LectureResponseDto[]>[] = [];

  console.log("강의 목록 조회 시작 - 모든 필터 조합 호출");

  for (const t of targets) {
    for (const m of methods) {
      for (const c of categories) {
        allPromises.push(
          fetch(`${API_BASE_URL}/lecture/${t}/${m}/${c}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then(async (res) => {
              if (!res.ok) {
                console.warn(`강의 조회 실패: ${t}/${m}/${c} - ${res.status}`);
                return [];
              }
              const data = await res.json();
              console.log(`강의 조회 성공: ${t}/${m}/${c} - ${data.length}개`);
              return data;
            })
            .catch((error) => {
              console.error(`강의 조회 에러: ${t}/${m}/${c}`, error);
              return [];
            })
        );
      }
    }
  }

  const results = await Promise.all(allPromises);
  const allLectures = results.flat();

  console.log(`전체 조회된 강의 개수 (중복 포함): ${allLectures.length}`);

  // 중복 제거 (id 기준)
  const uniqueLectures = Array.from(
    new Map(allLectures.map((lecture) => [lecture.id, lecture])).values()
  );

  console.log(`중복 제거 후 강의 개수: ${uniqueLectures.length}`);

  return uniqueLectures;
}

/**
 * 강의 상세 조회
 */
export async function getLectureDetail(
  lectureId: number
): Promise<LectureDetailDto> {
  const response = await fetch(`${API_BASE_URL}/lecture/detail/${lectureId}`, {
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
        `강의 상세 조회 실패: ${response.status}`
    );
  }

  return response.json();
}

/**
 * 승인된 모든 강의 조회 (메인 페이지용)
 * 최신순 또는 평점순 정렬은 프론트엔드에서 처리
 */
export async function getAllApprovedLectures(): Promise<LectureResponseDto[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/lecture/all`, {
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
          `강의 목록 조회 실패: ${response.status}`
      );
    }

    const data = await response.json();
    console.log(`승인된 강의 전체 조회 성공: ${data.length}개`);
    return data;
  } catch (error) {
    console.error("승인된 강의 조회 실패:", error);
    // 에러 발생 시 빈 배열 반환
    return [];
  }
}
