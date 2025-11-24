# SOCAM 프론트엔드 API 구현 체크리스트

## 📋 개요

백엔드 API 문서(`03_API_ENDPOINTS.md`)와 비교하여 프론트엔드에서 구현되지 않은 API 기능들을 정리한 체크리스트입니다.

---

## ✅ 완료된 API 기능

### 1. 사용자 (User) API

- ✅ 회원가입 (`POST /api/users/register`)
- ✅ 로그인 (`POST /api/users/login`)
- ✅ 이메일 중복 확인 (`GET /api/users/check-email`)
- ✅ 닉네임 중복 확인 (`GET /api/users/check-nickname`)
- ✅ 내 정보 조회 (`GET /api/users/me`)
- ✅ 회원정보 수정 (`PUT /api/users/{email}`)
- ✅ 회원 탈퇴 (`DELETE /api/users/{email}`)

### 2. 강의 (Lecture) API

- ✅ 분류별 강의 조회 (`GET /api/lecture/{target}/{method}/{category}`)
- ✅ 강의 상세 조회 (`GET /api/lecture/detail/{lectureId}`)

### 3. 리뷰 (Review) API

- ✅ 리뷰 등록 (`POST /api/review/add`)
- ✅ 강의별 리뷰 조회 (`GET /api/review/lecture/{lectureId}`)
- ✅ 내 리뷰 목록 조회 (`GET /api/review/user/{email}`)
- ⚠️ 리뷰 삭제 (`DELETE /api/review/delete/{reviewId}`) - **직접 fetch로 구현됨, API 함수 없음**

### 4. 위시리스트 (Wishlist) API

- ✅ 찜 추가 (`POST /api/wishlist/add`)
- ✅ 찜 삭제 (`DELETE /api/wishlist/remove`)
- ✅ 찜 목록 조회 (`GET /api/wishlist/list`)

### 5. 운영기관 (Org) API

- ✅ 운영기관 회원가입 (`POST /api/org/register`)
- ✅ 운영기관 로그인 (`POST /api/org/login`)
- ✅ 운영기관 이메일 중복 확인 (`GET /api/org/check-email`)
- ✅ 운영기관 내 정보 조회 (`GET /api/org/me`)
- ✅ 운영기관 정보 수정 (`PUT /api/org/me/{email}`)

### 6. 운영기관 강의 (Org Lecture) API

- ✅ 강의 등록 (`POST /api/org/lecture/add`)
- ✅ 내 강의 목록 조회 (`GET /api/org/lecture/list`)
- ✅ 강의 상세 조회 (`GET /api/org/lecture/{lectureId}`)
- ✅ 강의 수정 (`PUT /api/org/lecture/{lectureId}`)
- ✅ 강의 삭제 (`DELETE /api/org/lecture/{lectureId}`)

### 7. 관리자 (Admin) API

- ✅ 관리자 로그인 (`POST /api/admin/login`)
- ✅ 미승인 강의 목록 조회 (`GET /api/admin/lectures/pending`)
- ✅ 상태별 강의 목록 조회 (`GET /api/admin/lectures/status/{status}`)
- ✅ 강의 상세 조회 (`GET /api/admin/lectures/{lectureId}`)
- ✅ 강의 승인/거절 처리 (`PUT /api/admin/lectures/{lectureId}/status`)
- ✅ 강의 삭제 (`DELETE /api/admin/lectures/{lectureId}`)
- ✅ 미승인 운영기관 목록 조회 (`GET /api/admin/orgs`)
- ✅ 운영기관 승인/거절 처리 (`PATCH /api/admin/orgs/{email}/status`)
- ✅ 미승인 리뷰 목록 조회 (`GET /api/admin/reviews`)
- ✅ 상태별 리뷰 목록 조회 (`GET /api/admin/reviews/status/{status}`)
- ✅ 리뷰 승인/거절 처리 (`PATCH /api/admin/reviews/{reviewId}/status`)
- ✅ 공지사항 등록 (`POST /api/admin/notices`)
- ✅ 공지사항 목록 조회 (`GET /api/admin/notices`)
- ✅ 공지사항 상세 조회 (`GET /api/admin/notices/{noticeId}`)
- ✅ 공지사항 수정 (`PUT /api/admin/notices/{noticeId}`)
- ✅ 공지사항 삭제 (`DELETE /api/admin/notices/{noticeId}`)
- ✅ 공지사항 상태 변경 (`PATCH /api/admin/notices/{noticeId}/status`)

---

## ❌ 미구현 API 기능

### 1. 사용자 (User) API

#### 1.1 비밀번호 재설정 요청

- **API**: `POST /api/users/password-reset-request`
- **설명**: 사용자 이메일로 비밀번호 재설정 링크 발송
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "비밀번호 재설정 메일이 발송되었습니다."
  }
  ```
- **구현 필요 파일**: `lib/api/user.ts` 또는 새 파일 `lib/api/user-password.ts`
- **우선순위**: 중

#### 1.2 비밀번호 재설정

- **API**: `POST /api/users/reset-password`
- **설명**: 이메일로 받은 토큰을 사용하여 비밀번호 재설정
- **Request Body**:
  ```json
  {
    "token": "reset_token_from_email",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "비밀번호가 성공적으로 변경되었습니다."
  }
  ```
- **구현 필요 파일**: `lib/api/user.ts` 또는 새 파일 `lib/api/user-password.ts`
- **우선순위**: 중

### 2. 인증 (Auth) API

- ✅ 토큰 재발급 (`POST /api/auth/refresh`) - **완료**

### 3. 리뷰 (Review) API

#### 3.1 리뷰 삭제 (API 함수화 필요)

- **API**: `DELETE /api/review/delete/{reviewId}?email={email}`
- **설명**: 사용자가 작성한 리뷰 삭제
- **현재 상태**: `app/mypage/page.tsx`에서 직접 fetch로 구현됨
- **구현 필요**: `lib/api/review.ts`에 함수 추가
- **우선순위**: 낮음 (기능은 동작하지만 코드 일관성을 위해)

### 4. 운영기관 (Org) API

#### 4.1 운영기관 탈퇴

- **API**: `DELETE /api/org/delete/{email}`
- **설명**: 운영기관 계정 삭제
- **Response**: `204 No Content`
- **구현 필요 파일**: `lib/api/org.ts`
- **우선순위**: 중

#### 4.2 운영기관 비밀번호 재설정 요청

- **API**: `POST /api/org/password-reset-request`
- **설명**: 운영기관 이메일로 비밀번호 재설정 링크 발송
- **Request Body**:
  ```json
  {
    "email": "org@example.com"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "비밀번호 재설정 메일이 발송되었습니다."
  }
  ```
- **구현 필요 파일**: `lib/api/org.ts` 또는 새 파일 `lib/api/org-password.ts`
- **우선순위**: 중

#### 4.3 운영기관 비밀번호 재설정

- **API**: `POST /api/org/reset-password`
- **설명**: 이메일로 받은 토큰을 사용하여 비밀번호 재설정
- **Request Body**:
  ```json
  {
    "token": "reset_token_from_email",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "비밀번호가 성공적으로 변경되었습니다."
  }
  ```
- **구현 필요 파일**: `lib/api/org.ts` 또는 새 파일 `lib/api/org-password.ts`
- **우선순위**: 중

### 5. 이미지 업로드 API

#### 5.1 이미지 업로드

- **API**: `POST /api/image/upload`
- **설명**: S3에 이미지 업로드 후 URL 반환
- **Content-Type**: `multipart/form-data`
- **Form Data**: `file` (MultipartFile)
- **Response**: `200 OK` (문자열)
  ```
  https://s3.amazonaws.com/socam-bucket/uploads/xxx.jpg
  ```
- **구현 필요 파일**: `lib/api/image.ts` (새 파일)
- **우선순위**: 중 (강의 등록/수정 시 이미지 업로드에 사용 가능)
- **참고**: 현재 강의 등록/수정 시 이미지 파일을 직접 FormData로 전송하지만, 별도 이미지 업로드 API가 있음

### 6. 공지사항 API (일반 사용자용)

- ✅ 공개된 공지사항 목록 조회 (`GET /api/notices`) - **완료**
- ✅ 공지사항 상세 조회 (`GET /api/notices/{noticeId}`) - **완료**
- ✅ 공지사항 조회수 증가 (`POST /api/notices/{noticeId}/view`) - **완료**

---

## 📊 구현 현황 요약

| 카테고리            | 완료   | 미구현 | 진행률    |
| ------------------- | ------ | ------ | --------- |
| 사용자 API          | 7      | 2      | 77.8%     |
| 인증 API            | 0      | 1      | 0%        |
| 강의 API            | 2      | 0      | 100%      |
| 리뷰 API            | 3      | 1      | 75%       |
| 위시리스트 API      | 3      | 0      | 100%      |
| 운영기관 API        | 5      | 3      | 62.5%     |
| 운영기관 강의 API   | 5      | 0      | 100%      |
| 관리자 API          | 17     | 0      | 100%      |
| 이미지 업로드 API   | 0      | 1      | 0%        |
| 공지사항 API (일반) | 3      | 0      | 100%      |
| **전체**            | **47** | **7** | **87%** |

---

## 🎯 우선순위별 구현 가이드

### 높은 우선순위 (즉시 구현 권장)

- ✅ 토큰 재발급 API - **완료**

### 중간 우선순위 (단기간 내 구현 권장)

2. **비밀번호 재설정 기능** (사용자 + 운영기관)

   - 사용자: `POST /api/users/password-reset-request`, `POST /api/users/reset-password`
   - 운영기관: `POST /api/org/password-reset-request`, `POST /api/org/reset-password`
   - 파일: `lib/api/user-password.ts`, `lib/api/org-password.ts` 또는 각각의 파일에 추가

3. **이미지 업로드 API** (`POST /api/image/upload`)

   - 강의 등록/수정 시 이미지 미리보기 등에 활용 가능
   - 파일: `lib/api/image.ts` 생성

4. **운영기관 탈퇴** (`DELETE /api/org/delete/{email}`)
   - 파일: `lib/api/org.ts`에 추가

### 낮은 우선순위 (백엔드 협의 필요 또는 코드 정리)

5. **리뷰 삭제 API 함수화**

   - 현재 동작하지만 코드 일관성을 위해 `lib/api/review.ts`에 함수 추가

6. ~~**공지사항 공개 API**~~ - **완료**

---

## 📝 구현 시 참고사항

### 1. 토큰 재발급 구현 시

- `lib/api/auth.ts` 파일 생성
- `refreshToken`을 localStorage에서 가져와서 호출
- 성공 시 새로운 `accessToken`을 localStorage에 저장
- API 호출 시 401 에러 발생 시 자동으로 토큰 재발급 시도하는 인터셉터 구현 고려

### 2. 비밀번호 재설정 구현 시

- 이메일 입력 페이지
- 토큰 검증 및 새 비밀번호 입력 페이지
- URL 파라미터에서 토큰 추출 (`?token=xxx`)
- 토큰 만료 시 에러 처리

### 3. 이미지 업로드 구현 시

- FormData 사용
- 파일 크기 제한 체크 (선택)
- 업로드 중 로딩 상태 표시
- 에러 처리

### 4. 공지사항 공개 API

- 백엔드 팀과 협의하여 공개 API 엔드포인트 추가 요청
- 인증 없이 접근 가능한 API로 구현
- `status: "VISIBLE"`인 공지사항만 반환

---

## 🔗 관련 문서

- 백엔드 API 문서: `socam_be/03_API_ENDPOINTS.md`
- DTO 타입 정의: `socam_be/04_DTO_TYPES.md`
- 비즈니스 로직: `socam_be/06_BUSINESS_LOGIC.md`
- 데이터베이스 구조: `socam_be/02_DATABASE_STRUCTURE.md`

---

**마지막 업데이트**: 2024년 (현재 날짜)
**작성자**: AI Assistant
