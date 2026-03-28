# 독서 기록 앱 설계 문서

## 1. 폴더 구조

```
book/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx              # 로그인 화면
│   │   ├── (main)/
│   │   │   ├── layout.tsx                # 공통 레이아웃 (네비게이션 포함)
│   │   │   ├── page.tsx                  # 도서 목록 (메인)
│   │   │   ├── books/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx          # 도서 상세 / 수정
│   │   │   └── settings/
│   │   │       └── page.tsx              # 상태 · 카테고리 관리
│   │   ├── api/
│   │   │   ├── books/
│   │   │   │   ├── route.ts              # GET (목록), POST (추가)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts          # GET, PATCH, DELETE
│   │   │   ├── categories/
│   │   │   │   ├── route.ts              # GET, POST
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts          # PATCH, DELETE
│   │   │   ├── statuses/
│   │   │   │   ├── route.ts              # GET, POST
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts          # PATCH, DELETE
│   │   │   ├── search/
│   │   │   │   └── route.ts              # GET — Google Books API 프록시
│   │   │   ├── export/
│   │   │   │   └── route.ts              # GET — JSON 다운로드
│   │   │   └── import/
│   │   │       └── route.ts              # POST — JSON 업로드
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── FinderLayout.tsx          # 전체 Finder 스타일 레이아웃
│   │   │   ├── Sidebar.tsx               # 좌측 사이드바
│   │   │   ├── SidebarSection.tsx        # 즐겨찾기 / 태그 섹션
│   │   │   ├── SidebarItem.tsx           # 사이드바 항목 (클릭 시 필터)
│   │   │   └── Toolbar.tsx               # 상단 툴바 (검색, 뷰 전환, 추가)
│   │   ├── books/
│   │   │   ├── BookFreeformView.tsx      # 자유 배치 캔버스 뷰 (전체 보기)
│   │   │   ├── BookIcon.tsx              # 표지 + 제목 아이콘 (드래그 가능)
│   │   │   ├── BookListView.tsx          # 목록 뷰
│   │   │   ├── BookRow.tsx               # 목록 뷰 행
│   │   │   ├── BookDetailPanel.tsx       # 우측 상세 슬라이드 패널
│   │   │   ├── BookForm.tsx              # 도서 추가 / 수정 폼 (모달)
│   │   │   ├── BookSearch.tsx            # Google Books 검색 + 결과 선택
│   │   │   └── BookDeleteDialog.tsx      # 삭제 확인 다이얼로그
│   │   ├── categories/
│   │   │   ├── CategoryDot.tsx           # 사이드바용 컬러 점 + 이름
│   │   │   ├── CategoryBadge.tsx         # 카드/패널용 태그 UI
│   │   │   ├── CategoryManager.tsx       # 카테고리 목록 + CRUD
│   │   │   └── CategoryForm.tsx          # 카테고리 생성 / 수정 폼
│   │   ├── statuses/
│   │   │   ├── StatusBadge.tsx           # 상태 배지 UI
│   │   │   ├── StatusManager.tsx         # 상태 목록 + CRUD
│   │   │   └── StatusForm.tsx            # 상태 생성 / 수정 폼
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Dialog.tsx
│   │       └── ColorPicker.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                 # 브라우저용 Supabase 클라이언트
│   │   │   └── server.ts                 # 서버용 Supabase 클라이언트
│   │   └── google-books.ts               # Google Books API 호출 헬퍼
│   └── types/
│       └── index.ts                      # Book, Status, Category 타입 정의
├── public/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 2. 데이터 모델 (Supabase / PostgreSQL)

### 테이블 구조

```sql
-- 독서 상태 (사용자 정의)
CREATE TABLE statuses (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  color      TEXT,                          -- HEX 색상 코드 (예: #4CAF50)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 카테고리 (사용자 정의)
CREATE TABLE categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  color      TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 도서
CREATE TABLE books (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  author          TEXT,
  cover_image_url TEXT,
  status_id       UUID REFERENCES statuses(id) ON DELETE SET NULL,
  note            TEXT,
  pos_x           FLOAT,                   -- 자유 배치 X 좌표 (px)
  pos_y           FLOAT,                   -- 자유 배치 Y 좌표 (px)
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- 도서 ↔ 카테고리 (다대다 관계)
CREATE TABLE book_categories (
  book_id     UUID REFERENCES books(id)      ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, category_id)
);
```

### 관계 다이어그램

```
books ──── (N:1) ──── statuses
books ──── (N:M) ──── categories
             └── book_categories (중간 테이블)
```

### updated_at 자동 갱신 트리거

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 3. UI 컨셉

macOS Finder 창을 모티프로 한 레이아웃.

```
┌─────────────────────────────────────────────────────────────┐
│  ◀ ▶   나의 서재          [아이콘] [목록] [내보내기] [검색]  │
├───────────────┬─────────────────────────────────────────────┤
│  즐겨찾기      │                                             │
│  ├ 전체       │   [표지] [표지] [표지] [표지] [표지]        │
│  ├ 읽는 중    │                                             │
│  ├ 완독       │   [표지] [표지] [표지]                      │
│  ├ 중단       │                                             │
│               │                                             │
│  태그         │                                             │
│  ● 소설       │                                             │
│  ● 자기계발   │                                             │
│  ● 추천도서   │                                             │
│  + 태그 추가  │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

- **좌측 사이드바**: 독서 상태(즐겨찾기 섹션) + 사용자 카테고리(태그 섹션)로 구성, 클릭 시 해당 항목으로 필터링
- **메인 영역 (전체 보기)**: 책 표지가 캔버스 위에 자유롭게 배치 (Finder 자유 배치 뷰). 각 책의 위치(x, y)를 DB에 저장해 다음 접속 시에도 유지. 표지 아래 제목 표시
- **메인 영역 (카테고리/상태 필터 시)**: 목록 뷰로 전환
- **상단 툴바**: 검색, 뷰 전환(자유 배치/목록), 도서 추가 버튼

---

## 4. 화면별 컴포넌트 구성

### 4.1 로그인 화면 (`/login`)

```
LoginPage
└── Supabase Auth UI (이메일 + 패스워드)
```

- 로그인 성공 시 `/` 로 리다이렉트
- 미인증 접근 시 middleware에서 `/login` 으로 리다이렉트

---

### 4.2 메인 화면 (`/`) — Finder 스타일

```
FinderLayout
├── Sidebar
│   ├── SidebarSection ("즐겨찾기")
│   │   ├── SidebarItem — 전체
│   │   └── SidebarItem — 상태별 (StatusBadge + 이름)  ← 클릭 시 필터
│   └── SidebarSection ("태그")
│       ├── SidebarItem — 카테고리별 (CategoryDot + 이름)  ← 클릭 시 필터
│       └── SidebarAddButton — 새 태그 추가 → CategoryForm (인라인)
└── MainPane
    ├── Toolbar
    │   ├── SearchInput (제목 / 저자 검색)
    │   ├── ViewToggle (아이콘 뷰 / 목록 뷰)
    │   └── AddBookButton → BookForm (모달)
    └── BookFreeformView  (기본 뷰 — 전체 보기)
        │   캔버스 위에 책 표지를 자유 좌표로 배치
        │   드래그로 위치 변경 → 좌표 저장
        └── BookIcon (반복, absolute 포지셔닝)
            ├── 표지 이미지
            └── 제목 (1줄 말줄임)
        또는
        BookListView  (목록 뷰 전환 시 / 필터 적용 시)
        └── BookRow (반복)
            ├── 표지 썸네일
            ├── 제목 / 저자
            ├── StatusBadge
            └── CategoryBadge (다중)
```

---

### 4.3 도서 상세 패널

Finder의 "미리보기" 패널처럼 메인 화면 우측에 슬라이드인으로 표시 (별도 페이지 이동 없음).

```
BookDetailPanel (우측 슬라이드인)
├── 표지 이미지 (상단, 크게)
├── 제목 / 저자
├── StatusBadge (클릭으로 상태 변경)
├── CategoryBadge 목록 (클릭으로 카테고리 편집)
├── 메모 (클릭으로 인라인 편집)
├── 수정 버튼 → BookForm (모달)
└── 삭제 버튼 → BookDeleteDialog
```

---

### 4.4 설정 화면 (`/settings`)

```
FinderLayout (동일 사이드바)
└── SettingsPane
    ├── StatusManager
    │   ├── 상태 목록 (StatusBadge + 수정/삭제 버튼)
    │   └── StatusForm (새 상태 추가)
    ├── CategoryManager
    │   ├── 카테고리 목록 (CategoryDot + 이름 + 수정/삭제)
    │   └── CategoryForm (새 카테고리 추가)
    └── 데이터 관리
        ├── Export 버튼 (JSON 다운로드)
        └── Import 버튼 (JSON 파일 선택)
```

---

## 5. API 라우트 설계

### 도서

| 메서드 | 경로 | 설명 | 주요 파라미터 |
|--------|------|------|---------------|
| GET | `/api/books` | 도서 목록 조회 | `q`, `status_id`, `category_ids` (쿼리) |
| POST | `/api/books` | 도서 추가 | body: Book 데이터 |
| GET | `/api/books/[id]` | 도서 상세 조회 | — |
| PATCH | `/api/books/[id]` | 도서 수정 | body: 변경할 필드 |
| DELETE | `/api/books/[id]` | 도서 삭제 | — |

### 카테고리

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/categories` | 카테고리 목록 |
| POST | `/api/categories` | 카테고리 생성 |
| PATCH | `/api/categories/[id]` | 카테고리 수정 |
| DELETE | `/api/categories/[id]` | 카테고리 삭제 |

### 독서 상태

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/statuses` | 상태 목록 |
| POST | `/api/statuses` | 상태 생성 |
| PATCH | `/api/statuses/[id]` | 상태 수정 |
| DELETE | `/api/statuses/[id]` | 상태 삭제 |

### 도서 검색 (Google Books 프록시)

| 메서드 | 경로 | 설명 | 파라미터 |
|--------|------|------|----------|
| GET | `/api/search` | Google Books 검색 | `q` (필수) |

> API 키를 서버에서만 사용하기 위해 클라이언트에서 직접 호출하지 않고 Next.js API Route를 프록시로 사용.

### 데이터 내보내기 / 가져오기

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/export` | 전체 데이터 JSON 다운로드 |
| POST | `/api/import` | JSON 파일 업로드 후 복원 |

#### Export JSON 구조

```json
{
  "exported_at": "2026-03-28T00:00:00Z",
  "statuses": [...],
  "categories": [...],
  "books": [
    {
      ...bookFields,
      "categories": [...]
    }
  ]
}
```

---

## 6. 인증 처리

- `middleware.ts` (프로젝트 루트)에서 인증 여부 확인
- 미인증 요청은 `/login` 으로 리다이렉트
- Supabase 세션은 쿠키 기반으로 관리 (`@supabase/ssr` 패키지 사용)

---

## 7. 환경 변수

```
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_BOOKS_API_KEY=
```
