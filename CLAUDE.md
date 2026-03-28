# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어

한국어로 답변한다.

## 실행 명령어

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
```

패키지 설치 시 npm 캐시 권한 문제가 있으므로 아래 방식 사용:
```bash
npm_config_cache=/tmp/npm-cache npm install <패키지>
```

## 아키텍처

**Next.js 16 App Router + Supabase + Tailwind CSS**

인증은 `src/proxy.ts` (Next.js 16에서 middleware → proxy로 변경됨)에서 처리. 미로그인 시 `/login`으로 리다이렉트.

### 데이터 흐름

- **클라이언트** → `/api/*` Route Handler → **Supabase**
- Google Books 검색은 `/api/search`를 프록시로 사용 (API 키 서버에서만 사용)
- Supabase 클라이언트: 브라우저용 `src/lib/supabase/client.ts`, 서버용 `src/lib/supabase/server.ts`

### 주요 화면 구조

```
(auth)/login/page.tsx         # 로그인
(main)/page.tsx               # 메인 (Finder 스타일, 자유 배치 뷰)
(main)/settings/page.tsx      # 상태/카테고리 관리 + Export/Import
```

메인 화면은 `FinderLayout` (사이드바 + 툴바 + 메인 패널)으로 구성. 사이드바에서 상태/카테고리 클릭 시 URL 쿼리 파라미터 없이 React state로 필터링. 필터 없으면 `BookFreeformView` (드래그 가능한 자유 배치), 필터 있으면 `BookListView` 자동 전환.

### 데이터 모델 (Supabase PostgreSQL)

- `books` — 도서 (pos_x, pos_y로 자유 배치 위치 저장)
- `statuses` — 사용자 정의 독서 상태
- `categories` — 사용자 정의 카테고리
- `book_categories` — books ↔ categories 다대다 중간 테이블

도서 조회 시 `book_categories(category:categories(*))` join으로 카테고리를 함께 가져온 후 `categories` 배열로 변환.

### 환경 변수 (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_BOOKS_API_KEY=
```
