# SOCAM (Software Campus)

정부지원 IT 교육 플랫폼 - 소프트웨어 캠퍼스

## 프로젝트 개요

SOCAM은 정부지원 IT 교육과정을 소개하고 리뷰를 관리하는 웹 플랫폼입니다.
교육기관은 강의를 등록하고, 학생들은 강의를 탐색하며 리뷰를 작성할 수 있습니다.

## 기술 스택

- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4.1.9
- **Component Library**: shadcn/ui (Radix UI 기반)
- **Package Manager**: pnpm (권장)

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- **pnpm** (필수) - npm이나 yarn이 아닌 pnpm 사용

### pnpm 설치 (처음 사용하는 경우)

```bash
npm install -g pnpm
```

### 프로젝트 설정

```bash
# 저장소 클론
git clone [repository-url]
cd socam-FE

# 의존성 설치 (반드시 pnpm 사용)
pnpm install

# 개발 서버 실행
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 기타 명령어

```bash
# 빌드
pnpm build

# 프로덕션 실행
pnpm start

# 린트 실행
pnpm lint
```

> **⚠️ 중요**: 이 프로젝트는 **pnpm**을 사용합니다. npm이나 yarn을 사용하면 `pnpm-lock.yaml`과 충돌이 발생할 수 있습니다.

## 프로젝트 구조

```
socam-FE/
├── app/                          # Next.js App Router 페이지
│   ├── page.tsx                  # 메인 페이지
│   ├── login/                    # 로그인 (학생/기관)
│   ├── signup/                   # 회원가입 (학생/기관)
│   ├── lectures/                 # 강의 목록 및 상세
│   │   ├── page.tsx              # 강의 목록 (필터링, 검색)
│   │   └── [id]/page.tsx         # 강의 상세 페이지
│   ├── mypage/                   # 학생 마이페이지
│   ├── org/                      # 기관 마이페이지
│   ├── admin/                    # 관리자 페이지
│   └── notices/                  # 공지사항
├── components/                   # React 컴포넌트
│   ├── header.tsx                # 메인 헤더 (검색, 로그인)
│   ├── category-navigation.tsx   # 카테고리 네비게이션
│   ├── ad-banner-carousel.tsx    # 광고 배너 캐러셀
│   ├── best-lectures.tsx         # 베스트 강의 섹션
│   ├── new-lectures.tsx          # 신규 강의 섹션
│   ├── latest-notices.tsx        # 최신 공지사항
│   └── ui/                       # shadcn/ui 컴포넌트
├── lib/
│   ├── api/                      # API 클라이언트 함수들 ⭐
│   │   ├── lecture.ts            # 강의 관련 API
│   │   ├── review.ts             # 리뷰 관련 API
│   │   ├── user-login.ts         # 사용자 로그인
│   │   ├── user-signup.ts        # 사용자 회원가입
│   │   ├── user.ts               # 사용자 정보 관리
│   │   ├── wishlist.ts           # 찜하기 기능
│   │   ├── org-login.ts          # 기관 로그인
│   │   ├── org-signup.ts         # 기관 회원가입
│   │   ├── org.ts                # 기관 관련 API
│   │   ├── admin-login.ts        # 관리자 로그인
│   │   ├── admin.ts              # 관리자 관련 API
│   │   └── notice.ts             # 공지사항 API
│   └── utils.ts                  # 유틸리티 함수 (cn 등)
├── hooks/                        # Custom Hooks
├── public/                       # 정적 파일 (이미지 등)
└── styles/                       # 전역 스타일
```

## API 연동 가이드

### API 클라이언트 위치

모든 API 호출 함수는 `lib/api/` 디렉토리에 모듈별로 분리되어 있습니다.

### API 함수 사용 예시

```typescript
// 강의 목록 조회
import { getAllApprovedLectures } from "@/lib/api/lecture";
const lectures = await getAllApprovedLectures();

// 강의 상세 조회
import { getLectureDetail } from "@/lib/api/lecture";
const lecture = await getLectureDetail(lectureId);

// 리뷰 작성
import { addReview } from "@/lib/api/review";
await addReview(email, lectureId, starRating, contents, certificateFile);

// 찜하기
import { addWishlist, removeWishlist } from "@/lib/api/wishlist";
await addWishlist(email, lectureId);
```

### 인증 토큰 관리

대부분의 API 함수는 `localStorage`에서 `accessToken`을 자동으로 읽어서 `Authorization` 헤더에 포함합니다.

```typescript
// lib/api/wishlist.ts 예시
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}
```

### 백엔드 API 엔드포인트

백엔드 API는 `http://localhost:8080/api`를 기본 URL로 사용합니다.

환경 변수로 변경하려면 `.env.local` 파일에 다음을 추가:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## 환경 변수

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# 백엔드 API URL (선택사항, 기본값: http://localhost:8080/api)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## 코드 스타일 가이드

### 주석 규칙

모든 컴포넌트와 섹션에는 **한글 주석**을 사용합니다:

```tsx
// ========== 섹션 제목 ==========
// 기능 설명

export default function Component() {
  // ...
}
```

### 파일 네이밍

- 컴포넌트: `kebab-case.tsx` (예: `best-lectures.tsx`)
- 페이지: `page.tsx` (Next.js App Router 규칙)
- API 함수: `kebab-case.ts` (예: `user-login.ts`)

### 컴포넌트 구조

```tsx
// ========== 컴포넌트명 ==========
'use client' // 클라이언트 컴포넌트인 경우

import { ... } from '...'

export default function ComponentName() {
  // 상태 관리
  // 이벤트 핸들러
  // 렌더링
  return (
    <div>
      {/* ========== 섹션 1 ========== */}
    </div>
  )
}
```

## 주요 페이지 경로

### 공통 페이지

- `/` - 메인 페이지
- `/lectures` - 강의 목록 (필터링, 검색)
- `/lectures/[id]` - 강의 상세
- `/notices` - 공지사항 목록

### 인증 페이지

- `/login` - 로그인 선택
- `/login/student` - 학생 로그인
- `/login/org` - 기관 로그인
- `/signup/student` - 학생 회원가입
- `/signup/org` - 기관 회원가입

### 학생 페이지

- `/mypage` - 마이페이지 (내 정보, 리뷰, 찜 목록)

### 기관 페이지

- `/org` - 기관 마이페이지
- `/org/lectures/new` - 강의 등록
- `/org/lectures/[id]/edit` - 강의 수정

### 관리자 페이지

- `/admin` - 관리자 대시보드
- `/admin/orgs` - 기관 승인 관리
- `/admin/lectures` - 강의 승인 관리
- `/admin/reviews` - 리뷰 승인 관리
- `/admin/notices` - 공지사항 관리

## 협업 가이드

### Git 브랜치 전략

- `main` - 프로덕션 배포 브랜치
- `develop` - 개발 브랜치
- `feature/기능명` - 기능 개발 브랜치
- `fix/버그명` - 버그 수정 브랜치

### 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅 (기능 변경 없음)
refactor: 코드 리팩토링
```

### 코드 리뷰 체크리스트

- [ ] 한글 주석이 모든 섹션에 달려있는가?
- [ ] 타입스크립트 에러가 없는가?
- [ ] API 함수가 `lib/api/`에 올바르게 분리되어 있는가?
- [ ] 반응형 디자인이 적용되었는가?

## 디자인 가이드

### 색상 팔레트

- Primary Blue: `#1A73E8`
- Accent Cyan: `#00C4CC`
- Text Dark: `#1A1A1A`
- Text Grey: `#666666`
- Background White: `#FFFFFF`

### 타이포그래피

- 메인 제목: `text-4xl font-bold`
- 섹션 제목: `text-3xl font-bold`
- 본문: `text-base`

### 간격 (Spacing)

- 섹션 간격: `py-16` 또는 `py-20`
- 컨테이너: `max-w-7xl mx-auto px-4`
- 카드 간격: `gap-6` 또는 `gap-8`

## 문제 해결

### pnpm install 오류

```bash
# node_modules와 lock 파일 삭제 후 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### API 호출 오류

1. 백엔드 서버가 실행 중인지 확인 (`http://localhost:8080`)
2. `.env.local` 파일의 `NEXT_PUBLIC_API_BASE_URL` 확인
3. 브라우저 개발자 도구의 Network 탭에서 요청 확인

### 타입스크립트 에러

```bash
# 타입 체크 실행
pnpm exec tsc --noEmit
```

## 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [shadcn/ui 컴포넌트](https://ui.shadcn.com/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

## 라이선스

이 프로젝트는 KOSTA 교육 목적으로 제작되었습니다.
