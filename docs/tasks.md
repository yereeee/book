# 독서 기록 앱 작업 목록

## Phase 1 — 프로젝트 초기 설정

### T001 — Next.js 프로젝트 생성
- **선행 작업**: 없음
- **작업 내용**
  - `create-next-app`으로 프로젝트 생성 (TypeScript, App Router, Tailwind CSS 선택)
  - `src/` 디렉토리 구조 생성 (design.md 폴더 구조 기준)
- **완료 기준**: `npm run dev` 실행 시 기본 페이지 정상 접근

---

### T002 — 패키지 설치
- **선행 작업**: T001
- **작업 내용**
  - `@supabase/supabase-js`, `@supabase/ssr` 설치
- **완료 기준**: `package.json`에 의존성 추가, 빌드 오류 없음

---

### T003 — 환경 변수 설정
- **선행 작업**: T001
- **작업 내용**
  - `.env.local` 파일 생성
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GOOGLE_BOOKS_API_KEY` 항목 추가
- **완료 기준**: `.env.local` 파일 존재, `.gitignore`에 포함 확인

---

## Phase 2 — Supabase 설정

### T004 — Supabase 프로젝트 생성 및 DB 스키마 적용
- **선행 작업**: T003
- **작업 내용**
  - Supabase 대시보드에서 프로젝트 생성
  - SQL 에디터에서 테이블 생성 (design.md 스키마 기준)
    - `statuses`, `categories`, `books`, `book_categories`
  - `updated_at` 자동 갱신 트리거 적용
- **완료 기준**: Supabase 대시보드 Table Editor에서 4개 테이블 확인

---

### T005 — Supabase 클라이언트 설정
- **선행 작업**: T002, T004
- **작업 내용**
  - `src/lib/supabase/client.ts` — 브라우저용 클라이언트
  - `src/lib/supabase/server.ts` — 서버 컴포넌트 / Route Handler용 클라이언트
- **완료 기준**: 각 파일에서 Supabase 클라이언트 import 후 타입 오류 없음

---

## Phase 3 — 인증

### T006 — 인증 미들웨어 구현
- **선행 작업**: T005
- **작업 내용**
  - `middleware.ts` 작성: 비로그인 사용자 → `/login` 리다이렉트
  - `/login` 경로는 미들웨어 제외
- **완료 기준**: 비로그인 상태에서 `/` 접근 시 `/login`으로 이동

---

### T007 — 로그인 화면 구현
- **선행 작업**: T006
- **작업 내용**
  - `src/app/(auth)/login/page.tsx` 작성
  - 이메일 + 패스워드 로그인 폼
  - 로그인 성공 시 `/` 리다이렉트
- **완료 기준**: Supabase에 등록된 계정으로 로그인 후 메인 화면 진입

---

## Phase 4 — 공통 기반

### T008 — 공통 타입 정의
- **선행 작업**: T004
- **작업 내용**
  - `src/types/index.ts` 작성
  - `Book`, `Status`, `Category`, `BookWithRelations` 타입 정의
- **완료 기준**: 모든 타입이 DB 스키마와 일치, 타입 오류 없음

---

### T009 — 공통 UI 컴포넌트 구현
- **선행 작업**: T001
- **작업 내용**
  - `Button.tsx`, `Input.tsx`, `Dialog.tsx`, `ColorPicker.tsx` 구현
- **완료 기준**: 각 컴포넌트가 Tailwind 스타일로 렌더링되고 props 동작 확인

---

## Phase 5 — Finder 레이아웃

### T010 — FinderLayout 구현
- **선행 작업**: T009
- **작업 내용**
  - `FinderLayout.tsx`: 사이드바 + 메인 패널 2단 레이아웃
  - `SidebarSection.tsx`: 섹션 헤더 + 하위 항목 영역
  - `SidebarItem.tsx`: 클릭 시 필터 적용, 선택 상태 하이라이트
  - `Toolbar.tsx`: 검색창, 뷰 전환 버튼, 도서 추가 버튼 배치
  - `src/app/(main)/layout.tsx` 에서 FinderLayout 적용
- **완료 기준**: 사이드바 + 툴바 + 메인 영역 레이아웃이 화면에 렌더링됨

---

## Phase 6 — 상태(Status) 기능

### T011 — 상태 API 라우트 구현
- **선행 작업**: T005, T008
- **작업 내용**
  - `GET /api/statuses` — 목록 조회
  - `POST /api/statuses` — 생성
  - `PATCH /api/statuses/[id]` — 수정
  - `DELETE /api/statuses/[id]` — 삭제 (연결된 도서의 status_id → NULL)
- **완료 기준**: 각 엔드포인트 curl 또는 브라우저에서 응답 확인

---

### T012 — 상태 컴포넌트 구현
- **선행 작업**: T011
- **작업 내용**
  - `StatusBadge.tsx`: 색상 원 + 상태명 표시
  - `StatusForm.tsx`: 이름 + 색상 입력 폼
  - `StatusManager.tsx`: 상태 목록 + 생성/수정/삭제
- **완료 기준**: 상태 생성 → 목록 표시 → 수정 → 삭제 동작 확인

---

## Phase 7 — 카테고리(Category) 기능

### T013 — 카테고리 API 라우트 구현
- **선행 작업**: T005, T008
- **작업 내용**
  - `GET /api/categories` — 목록 조회
  - `POST /api/categories` — 생성
  - `PATCH /api/categories/[id]` — 수정
  - `DELETE /api/categories/[id]` — 삭제 (book_categories에서 자동 제거, CASCADE)
- **완료 기준**: 각 엔드포인트 응답 확인

---

### T014 — 카테고리 컴포넌트 구현
- **선행 작업**: T013
- **작업 내용**
  - `CategoryDot.tsx`: 사이드바용 컬러 원 + 이름
  - `CategoryBadge.tsx`: 상세 패널 / 목록용 태그 UI
  - `CategoryForm.tsx`: 이름 + 색상 입력 폼
  - `CategoryManager.tsx`: 카테고리 목록 + 생성/수정/삭제
- **완료 기준**: 카테고리 생성 → 목록 표시 → 수정 → 삭제 동작 확인

---

### T015 — 사이드바에 상태/카테고리 연결
- **선행 작업**: T010, T012, T014
- **작업 내용**
  - `Sidebar.tsx` 구현: "즐겨찾기" 섹션에 상태 목록, "태그" 섹션에 카테고리 목록 표시
  - 사이드바 항목 클릭 시 URL 쿼리 파라미터로 필터 전달 (`?status=...`, `?category=...`)
  - "태그 추가" 버튼 → `CategoryForm` 인라인 표시
- **완료 기준**: 사이드바에서 상태/카테고리 클릭 시 필터 파라미터가 URL에 반영됨

---

## Phase 8 — 도서 API

### T016 — Google Books API 헬퍼 구현
- **선행 작업**: T003
- **작업 내용**
  - `src/lib/google-books.ts`: 검색 쿼리 → Google Books API 호출 → 결과 정규화
  - `GET /api/search?q=...` 라우트 구현 (API 키 서버에서만 사용)
- **완료 기준**: `/api/search?q=해리포터` 호출 시 제목/저자/표지 목록 반환

---

### T017 — 도서 API 라우트 구현
- **선행 작업**: T005, T008
- **작업 내용**
  - `GET /api/books` — 목록 조회 (`q`, `status_id`, `category_ids` 필터 지원)
  - `POST /api/books` — 도서 추가 (book_categories 동시 삽입)
  - `GET /api/books/[id]` — 상세 조회 (카테고리 join 포함)
  - `PATCH /api/books/[id]` — 수정 (book_categories 갱신 포함)
  - `DELETE /api/books/[id]` — 삭제
- **완료 기준**: 도서 CRUD 각 엔드포인트 응답 확인

---

### T018 — 도서 위치 저장 API
- **선행 작업**: T017
- **작업 내용**
  - `PATCH /api/books/[id]` 에서 `pos_x`, `pos_y` 업데이트 지원
  - 드래그 종료 시 호출할 수 있는 단순 엔드포인트
- **완료 기준**: pos_x, pos_y 변경 후 DB 반영 확인

---

## Phase 9 — 도서 UI

### T019 — 도서 검색 컴포넌트 구현 (BookSearch)
- **선행 작업**: T016, T009
- **작업 내용**
  - `BookSearch.tsx`: 검색창 입력 → `/api/search` 호출 → 결과 목록 표시
  - 결과 클릭 시 제목/저자/표지 URL 반환 (BookForm에서 사용)
- **완료 기준**: 검색어 입력 시 Google Books 결과 표시, 선택 시 데이터 전달

---

### T020 — 도서 추가/수정 폼 구현 (BookForm)
- **선행 작업**: T019, T012, T014
- **작업 내용**
  - `BookForm.tsx`: 모달 형태
    - 상단: `BookSearch` 연동 (검색 → 자동 채우기)
    - 제목 (필수) / 저자 / 표지 URL 입력
    - 상태 선택 (드롭다운)
    - 카테고리 다중 선택 (체크박스 또는 태그 선택)
    - 메모 텍스트 영역
  - 추가 모드 / 수정 모드 구분
- **완료 기준**: 도서 추가 후 목록에 반영, 수정 후 변경 사항 반영

---

### T021 — 도서 삭제 다이얼로그 구현 (BookDeleteDialog)
- **선행 작업**: T009, T017
- **작업 내용**
  - `BookDeleteDialog.tsx`: 삭제 확인 다이얼로그 (취소 / 삭제 버튼)
- **완료 기준**: 삭제 확인 후 도서 제거, 목록에서 사라짐

---

### T022 — 자유 배치 뷰 구현 (BookFreeformView)
- **선행 작업**: T017, T018, T009
- **작업 내용**
  - `BookFreeformView.tsx`: `position: relative` 캔버스 컨테이너
  - `BookIcon.tsx`: `position: absolute`, `pos_x`/`pos_y`로 배치
    - 표지 이미지 + 제목 (1줄 말줄임)
    - 클릭 시 `BookDetailPanel` 열기
    - 드래그 앤 드롭으로 위치 이동 → `PATCH /api/books/[id]` 호출
  - 신규 도서 추가 시 랜덤 좌표 배정
- **완료 기준**: 책이 캔버스에 자유 배치됨, 드래그 후 새로고침해도 위치 유지

---

### T023 — 목록 뷰 구현 (BookListView)
- **선행 작업**: T017, T012, T014
- **작업 내용**
  - `BookListView.tsx`: 도서 행 리스트
  - `BookRow.tsx`: 썸네일 / 제목·저자 / StatusBadge / CategoryBadge
  - 클릭 시 `BookDetailPanel` 열기
- **완료 기준**: 목록 뷰에서 도서 전체 표시, 각 정보 정상 렌더링

---

### T024 — 도서 상세 패널 구현 (BookDetailPanel)
- **선행 작업**: T020, T021, T012, T014
- **작업 내용**
  - `BookDetailPanel.tsx`: 우측 슬라이드인 패널
    - 표지 이미지 (크게)
    - 제목 / 저자
    - StatusBadge — 클릭으로 상태 변경
    - CategoryBadge 목록 — 클릭으로 카테고리 편집
    - 메모 — 클릭으로 인라인 편집
    - 수정 버튼 → `BookForm` 모달
    - 삭제 버튼 → `BookDeleteDialog`
- **완료 기준**: 책 클릭 시 패널 열림, 상태/메모 인라인 수정 후 DB 반영

---

## Phase 10 — 메인 화면 조립

### T025 — 메인 화면 구현
- **선행 작업**: T015, T022, T023, T024
- **작업 내용**
  - `src/app/(main)/page.tsx` 구현
  - URL 쿼리 파라미터 (`q`, `status_id`, `category_ids`) 읽어 API 호출
  - 필터 없음 → `BookFreeformView`, 필터 있음 → `BookListView` 전환
  - 툴바 뷰 전환 버튼으로 강제 전환 가능
- **완료 기준**: 사이드바 필터 클릭 → 해당 도서만 목록 뷰로 표시, 전체 클릭 → 자유 배치 뷰

---

## Phase 11 — 설정 화면

### T026 — 설정 화면 구현
- **선행 작업**: T012, T014
- **작업 내용**
  - `src/app/(main)/settings/page.tsx` 구현
  - `StatusManager` + `CategoryManager` 배치
- **완료 기준**: 설정 화면에서 상태/카테고리 CRUD 전체 동작 확인

---

## Phase 12 — Export / Import

### T027 — Export API 구현
- **선행 작업**: T017
- **작업 내용**
  - `GET /api/export`: `statuses`, `categories`, `books`(카테고리 포함) 전체 조회
  - JSON 파일로 다운로드 (`Content-Disposition: attachment` 헤더)
- **완료 기준**: Export 버튼 클릭 시 JSON 파일 다운로드, 데이터 전체 포함 확인

---

### T028 — Import API 구현
- **선행 작업**: T017
- **작업 내용**
  - `POST /api/import`: JSON 파싱 → statuses, categories, books 순으로 upsert
  - 중복 도서(동일 id) 는 기존 데이터 유지 (skip)
- **완료 기준**: Export 파일을 Import 후 데이터 정상 복원 확인

---

### T029 — Export/Import UI 연결
- **선행 작업**: T026, T027, T028
- **작업 내용**
  - 설정 화면에 Export 버튼 (다운로드 트리거)
  - Import 버튼 (파일 선택 → `/api/import` 호출)
- **완료 기준**: 버튼 클릭으로 Export/Import 전체 흐름 동작

---

## Phase 13 — 마무리

### T030 — 반응형 UI 점검
- **선행 작업**: T025, T026
- **작업 내용**
  - 모바일 화면 (375px~)에서 사이드바 토글 처리
  - 자유 배치 뷰는 모바일에서 목록 뷰로 대체
- **완료 기준**: iPhone Safari 기준 주요 화면 레이아웃 깨짐 없음

---

## 작업 순서 요약

```
T001 → T002 → T003
              ↓
T004 → T005
       ↓
T006 → T007                         (인증)
T008                                 (타입)
T009                                 (공통 UI)
T009 → T010                         (레이아웃)
T005+T008 → T011 → T012
T005+T008 → T013 → T014
T010+T012+T014 → T015               (사이드바 연결)
T003 → T016                         (Google Books)
T005+T008 → T017 → T018
T016+T009 → T019 → T020
T009+T017 → T021
T017+T018 → T022                    (자유 배치 뷰)
T017+T012+T014 → T023               (목록 뷰)
T020+T021+T012+T014 → T024          (상세 패널)
T015+T022+T023+T024 → T025          (메인 화면)
T012+T014 → T026                    (설정 화면)
T017 → T027 → T029
T017 → T028 → T029
T025+T026 → T030                    (반응형)
```
