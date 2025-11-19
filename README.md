# SOCAM (Software Campus)

정부지원 IT 교육 플랫폼 - 소프트웨어 캠퍼스

## 프로젝트 개요

SOCAM은 정부지원 IT 교육과정을 소개하고 리뷰를 관리하는 웹 플랫폼입니다. 
교육기관은 강의를 등록하고, 학생들은 강의를 탐색하며 리뷰를 작성할 수 있습니다.

## 기술 스택

### Frontend
- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4.1.9
- **Component Library**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Form**: React Hook Form + Zod

### Backend (향후 구현)
- **Database**: PostgreSQL / MySQL (예정)
- **ORM**: Prisma / Drizzle (예정)
- **Authentication**: NextAuth.js (예정)

## 프로젝트 구조

\`\`\`
socam/
├── app/                          # Next.js App Router 페이지
│   ├── page.tsx                  # 메인 페이지 (히어로, 카테고리 네비, 광고 배너)
│   ├── login/                    # 로그인
│   ├── signup/                   # 회원가입 (학생/기관)
│   ├── lectures/                 # 강의 목록 및 상세
│   │   ├── page.tsx              # 강의 목록
│   │   └── [id]/page.tsx         # 강의 상세 (6개 탭, 사이드바)
│   ├── organizations/            # 교육기관 목록
│   ├── notices/                  # 공지사항
│   ├── mypage/                   # 학생 마이페이지
│   ├── org/                      # 기관 마이페이지
│   └── admin/                    # 관리자 페이지
│       ├── page.tsx              # 관리자 대시보드
│       ├── orgs/                 # 기관 승인 관리
│       ├── lectures/             # 강의 승인 관리
│       ├── reviews/              # 리뷰 승인 관리
│       └── notices/              # 공지사항 관리
├── components/                   # React 컴포넌트
│   ├── header.tsx                # 메인 헤더 (로고, 메뉴, 검색, 로그인)
│   ├── category-navigation.tsx  # 2번째 헤더 (10개 카테고리 네비게이션)
│   ├── ad-banner-carousel.tsx   # 광고 배너 캐러셀 (8초 자동 전환)
│   ├── footer.tsx                # 푸터
│   ├── hero.tsx                  # 히어로 배너
│   ├── category-section.tsx     # 카테고리 섹션
│   ├── best-lectures.tsx        # 베스트 강의 (16개 목업)
│   ├── new-lectures.tsx         # 신규 강의 (21개 목업)
│   ├── latest-notices.tsx       # 최신 공지사항
│   ├── platform-info.tsx        # 플랫폼 정보
│   └── ui/                       # shadcn/ui 컴포넌트
├── lib/                          # 유틸리티 함수
│   └── utils.ts                  # cn() 등
├── hooks/                        # Custom Hooks
│   ├── use-mobile.ts             # 모바일 감지
│   └── use-toast.ts              # Toast 알림
└── public/                       # 정적 파일 (이미지 등)
\`\`\`

## 주요 기능

### 메인 페이지 구성
1. **메인 헤더**
   - 로고 (SOCAM)
   - 네비게이션: 강의 / 교육기관 / 공지사항
   - 검색 버튼
   - 로그인 / 회원가입 버튼

2. **카테고리 네비게이션 (2번째 헤더, Sticky)**
   - 전체
   - 프론트엔드
   - 백엔드
   - 풀스택
   - 모바일
   - AI/데이터
   - 클라우드
   - 보안
   - DevOps
   - 기획/마케팅

3. **광고 배너 캐러셀**
   - 5개 배너 (목업 데이터)
   - 8초마다 자동 전환
   - 좌우 화살표 버튼
   - 하단 인디케이터 점

4. **베스트 강의 섹션** (16개 목업)
5. **신규 강의 섹션** (21개 목업)

### 강의 상세 페이지 구성

#### 좌측 메인 콘텐츠 영역 (6개 탭)
1. **강의 소개**
   - 강의 설명 (classDetail)
   - 강의 특징
   - 수강 대상

2. **NCS 정보**
   - NCS 코드
   - 훈련 핵심 과목
   - 능력 단위

3. **지원 정보**
   - 지원 자격 (나이, 학력, 경력)
   - 내일배움카드 필요 여부
   - 지원 절차 (서류 → 코딩테스트 → 면접 → 합격)

4. **커리큘럼**
   - 주차별 커리큘럼 (아코디언)
   - 상세 학습 내용

5. **수강 후기**
   - 후기 목록 (평점, 내용, 작성자)
   - 후기 작성 폼 (로그인 시)

6. **강사 소개**
   - 강사 프로필
   - 경력 사항
   - 수상 이력

#### 우측 고정 사이드바
1. **수강료 정보**
   - 정가
   - 훈련 지원금
   - 실 부담금

2. **훈련 일정**
   - 훈련 기간
   - 훈련 시간
   - 훈련 장소
   - 온/오프라인 여부

3. **지원 자격**
   - 내일배움카드 필수 여부
   - 나이 제한
   - 학력 제한

4. **채용 연계**
   - 인재 추천 여부
   - 인턴 전형 여부
   - 취업률

5. **신청하기 버튼** (큰 버튼)
6. **찜하기 / 공유 버튼**

### 역할별 기능

#### 비회원 (Guest)
- 강의 목록 조회
- 강의 상세 조회
- 교육기관 목록 조회
- 공지사항 조회
- 로그인 / 회원가입

#### 학생 (User)
- 비회원 기능 전체
- 강의 찜하기
- 리뷰 작성 (승인 후 게시)
- 마이페이지
  - 내 정보 관리
  - 내 리뷰 관리
  - 찜 목록 관리
  - 회원 탈퇴

#### 교육기관 (Org)
- 강의 등록 요청
- 강의 수정/삭제 요청
- 강의 승인 현황 조회
- 내 강의에 대한 리뷰 조회
- 기관 정보 관리

#### 관리자 (Admin)
- 전체 통계 대시보드
- 기관 가입 승인/거절
- 강의 등록 승인/거절
- 강의 삭제 요청 승인/거절
- 리뷰 승인/거절/삭제
- 공지사항 작성/수정/삭제

## 페이지 목록

### 공통 페이지
- `/` - 메인 페이지
- `/lectures` - 강의 목록
- `/lectures/[id]` - 강의 상세 (6개 탭, 사이드바, 추천 강의)
- `/organizations` - 교육기관 목록
- `/notices` - 공지사항 목록

### 인증 페이지
- `/login` - 로그인
- `/signup` - 회원가입 선택
- `/signup/student` - 학생 회원가입
- `/signup/org` - 기관 회원가입

### 학생 페이지
- `/mypage` - 학생 마이페이지 (내 정보, 리뷰, 찜, 탈퇴)

### 기관 페이지
- `/org` - 기관 마이페이지 (기관 정보, 강의 관리, 리뷰 조회)

### 관리자 페이지
- `/admin` - 관리자 대시보드
- `/admin/orgs` - 기관 승인 관리
- `/admin/lectures` - 강의 승인 관리
- `/admin/reviews` - 리뷰 승인 관리
- `/admin/notices` - 공지사항 관리
- `/admin/notices/new` - 공지사항 작성

## 설치 및 실행

### 사전 요구사항
- Node.js 18 이상
- pnpm (권장) 또는 npm

### 설치

\`\`\`bash
# 저장소 클론
git clone [repository-url]
cd socam

# 의존성 설치
pnpm install
# 또는
npm install
\`\`\`

### 개발 서버 실행

\`\`\`bash
pnpm dev
# 또는
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드

\`\`\`bash
pnpm build
# 또는
npm run build
\`\`\`

### 프로덕션 실행

\`\`\`bash
pnpm start
# 또는
npm start
\`\`\`

## 환경 변수 (예정)

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

\`\`\`env
# Database (예정)
DATABASE_URL="postgresql://..."

# Authentication (예정)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# File Upload (예정)
NEXT_PUBLIC_UPLOAD_URL="..."
\`\`\`

## 데이터베이스 스키마 (확장 예정)

### 기존 테이블
- `user` - 학생 정보
- `org` - 교육기관 정보
- `admin` - 관리자 정보
- `lecture` - 강의 정보 (기본 필드)
- `review` - 리뷰 정보
- `notice` - 공지사항
- `image` - 첨부 이미지

### 강의 테이블 확장 필드 (예정)

#### 강의 상세 정보
\`\`\`sql
-- 기본 정보 (기존)
id, title, org_id, teacher, category, target, method, 
start_date, end_date, class_detail, organization, 
rating, review_count, thumbnail, status, created_at

-- 추가 필드 (확장 예정)
location VARCHAR(100),              -- 지역 (강남, 온라인 등)
is_online BOOLEAN,                   -- 온라인 여부
is_offline BOOLEAN,                  -- 오프라인 여부
requires_card BOOLEAN,               -- 내일배움카드 필요 여부

-- NCS 정보
ncs_code VARCHAR(50),                -- NCS 코드
ncs_subjects TEXT[],                 -- 훈련핵심과목 배열

-- 수강료 정보
price INTEGER,                       -- 정가
support_amount INTEGER,              -- 훈련지원금
final_price INTEGER,                 -- 실 부담금

-- 훈련 일정
schedule TEXT,                       -- 훈련 시간표 (09:00-18:00)
duration_months INTEGER,             -- 훈련 기간 (개월)

-- 지원 자격
age_min INTEGER,                     -- 최소 나이
age_max INTEGER,                     -- 최대 나이
education_requirement VARCHAR(50),   -- 학력 요건
experience_requirement VARCHAR(100), -- 경력 요건

-- 지원 절차
application_process JSONB,           -- 지원 절차 (JSON)
has_coding_test BOOLEAN,             -- 코딩테스트 여부
has_interview BOOLEAN,               -- 면접 여부
has_document_screening BOOLEAN,      -- 서류전형 여부

-- 채용 연계
recruitment_talent BOOLEAN,          -- 인재 추천
recruitment_intern BOOLEAN,          -- 인턴 전형
recruitment_rate INTEGER,            -- 취업률 (%)

-- 강의 콘텐츠
description TEXT,                    -- 강의 상세 설명
features TEXT[],                     -- 강의 특징 배열
target_audience TEXT[],              -- 수강 대상 배열
curriculum JSONB,                    -- 커리큘럼 (JSON)
instructor_bio TEXT,                 -- 강사 소개
instructor_career TEXT[],            -- 강사 경력
instructor_awards TEXT[]             -- 강사 수상 이력
\`\`\`

### 리뷰 테이블 구조

\`\`\`sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  lecture_id INTEGER REFERENCES lectures(id),
  user_id INTEGER REFERENCES users(id),
  lecture_name VARCHAR(200),         -- 강의명
  instructor_name VARCHAR(100),      -- 강사명
  training_subject VARCHAR(100),     -- 훈련과목
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  content TEXT,                      -- 느낀점
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

## 코드 스타일 및 컨벤션

### 주석 규칙
모든 컴포넌트와 섹션에는 **한글 주석**을 사용합니다:

\`\`\`tsx
// ========== 섹션 제목 ==========
// 기능 설명

export default function Component() {
  // ...
}
\`\`\`

### 파일 네이밍
- 컴포넌트: `kebab-case.tsx` (예: `best-lectures.tsx`)
- 페이지: `page.tsx` (Next.js App Router 규칙)
- 유틸리티: `kebab-case.ts` (예: `use-mobile.ts`)

### 컴포넌트 구조
\`\`\`tsx
// ========== 컴포넌트명 ==========
'use client' // 클라이언트 컴포넌트인 경우

import { ... } from '...'

// 타입 정의
interface Props {
  // ...
}

export default function ComponentName({ props }: Props) {
  // 상태 관리
  
  // 이벤트 핸들러
  
  // 렌더링
  return (
    <div>
      {/* ========== 섹션 1 ========== */}
      
      {/* ========== 섹션 2 ========== */}
    </div>
  )
}
\`\`\`

## 협업 가이드

### Git 브랜치 전략
- `main` - 프로덕션 배포 브랜치
- `develop` - 개발 브랜치
- `feature/기능명` - 기능 개발 브랜치
- `fix/버그명` - 버그 수정 브랜치

### 커밋 메시지 규칙
\`\`\`
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅 (기능 변경 없음)
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 설정, 패키지 매니저 등
\`\`\`

### 코드 리뷰 체크리스트
- [ ] 한글 주석이 모든 섹션에 달려있는가?
- [ ] 컴포넌트가 적절히 분리되어 있는가?
- [ ] 타입스크립트 에러가 없는가?
- [ ] 반응형 디자인이 적용되었는가?
- [ ] 접근성(a11y)을 고려했는가?

## 디자인 가이드

### 색상 팔레트 (5가지 제한)
\`\`\`
Primary Blue: #1A73E8
Accent Cyan: #00C4CC
Text Dark: #1A1A1A
Text Grey: #666666
Background White: #FFFFFF
Border Light: #E5E5E5
\`\`\`

### 타이포그래피
- 메인 제목: `text-4xl font-bold` 또는 `text-5xl font-bold`
- 섹션 제목: `text-3xl font-bold`
- 서브 제목: `text-xl font-semibold`
- 본문: `text-base`
- 작은 텍스트: `text-sm text-muted-foreground`

### 간격 (Spacing)
- 섹션 간격: `py-16` 또는 `py-20`
- 컨테이너: `max-w-7xl mx-auto px-4`
- 카드 간격: `gap-6` 또는 `gap-8`

### 레이아웃 우선순위
1. Flexbox (대부분의 레이아웃)
2. CSS Grid (복잡한 2D 레이아웃만)
3. Absolute/Float (최후의 수단)

## 목업 데이터 정리

### 광고 배너 (5개)
1. React Full-Stack 개발 부트캠프
2. AI & 머신러닝 실전 과정
3. AWS 클라우드 아키텍트 양성
4. Spring Boot 백엔드 마스터
5. UX/UI 디자인 & Figma

### 베스트 강의 (16개)
카테고리별 분산: 프론트엔드, 백엔드, AI/데이터, 클라우드, 모바일, 보안, DevOps, 기획/마케팅

### 신규 강의 (21개)
최신 기술 스택 포함: Next.js, TypeScript, Python, Docker, Kubernetes, Flutter 등

## 향후 계획

### Phase 1: 백엔드 구축 (현재)
- [ ] 데이터베이스 설계 및 구현
- [ ] API 엔드포인트 구현
- [ ] 인증/인가 시스템 구축

### Phase 2: 핵심 기능
- [ ] 강의 CRUD 완성
- [ ] 리뷰 시스템 완성
- [ ] 승인 워크플로우 구현
- [ ] 파일 업로드 구현

### Phase 3: 강의 상세 페이지 확장
- [ ] 백엔드 필드 추가 (location, NCS, tuition 등)
- [ ] 커리큘럼 CRUD
- [ ] 후기 작성/관리 기능
- [ ] 찜하기 기능
- [ ] 유사 강의 추천 알고리즘

### Phase 4: 추가 기능
- [ ] 검색 기능 고도화
- [ ] 알림 시스템
- [ ] 이메일 발송 (승인/거절 등)
- [ ] 통계 및 분석 대시보드

### Phase 5: 최적화
- [ ] 성능 최적화
- [ ] SEO 개선
- [ ] 테스트 코드 작성
- [ ] 배포 자동화

## 라이선스

이 프로젝트는 KOSTA 교육 목적으로 제작되었습니다.

## 기여자

- 팀원 1
- 팀원 2
- 팀원 3

## 문의

프로젝트 관련 문의사항은 [이메일 주소]로 연락 주세요.
