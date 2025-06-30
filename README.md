# ITSCOPE PMO

"프로젝트 관리의 새로운 시작"을 위한 ITSCOPE PMO 프론트엔드 애플리케이션입니다. 이 애플리케이션은 React, TypeScript, Vite, Supabase를 기반으로 구축되었으며, 고급 사용자 인증, 동적 공지사항 시스템, 활동 로깅 등 PMO 도구의 핵심 기능을 제공합니다.

## 기술 스택

- **Framework**: React.js
- **Language**: TypeScript
- **Build Tool**: Vite
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animation**: Framer Motion
- **Routing**: React Router
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Form Handling**: React Hook Form
- **Schema Validation**: Zod
- **Notifications**: Sonner (Toast)

## 주요 기능

- **고급 인증 시스템**:
    - 이메일/비밀번호, 소셜 로그인(Google - 준비중) 지원
    - 가입 여부에 따라 로그인/회원가입으로 자동 분기
    - 2단계 인증(TFA)으로 보안 강화
- **사용자 활동 로깅**:
    - 로그인 성공/실패, 로그아웃, 2FA 시도 등 주요 사용자 활동을 데이터베이스에 기록
    - 관리자가 사용자 활동을 추적하고 이상 징후를 파악할 수 있는 기반 제공
- **동적 공지사항 시스템**:
    - 데이터베이스에서 공지사항을 실시간으로 조회하여 목록 표시
    - 조회수 카운트, 읽음/안읽음 상태 관리 (localStorage 연동)
    - 사용자가 직접 공지사항을 '보관'하여 목록을 관리하는 기능
- **반응형 UI/UX**:
    - 데스크톱과 모바일 환경에 최적화된 UI 제공
    - 모바일 환경에서의 가독성과 사용성을 고려한 레이아웃 조정
- **다국어 지원 기반**:
    - 도움말 플로팅 버튼 내 언어(KOR/ENG) 토글 기능 구현

## 프로젝트 구조

```
itscope-app-v1/
├── src/
│   ├── components/      # React 컴포넌트
│   │   ├── ui/          # shadcn/ui 컴포넌트
│   │   └── *.tsx        # 기능별 커스텀 컴포넌트
│   ├── hooks/           # 커스텀 훅 (e.g., use-mobile)
│   ├── lib/             # 외부 라이브러리 설정 (e.g., supabaseClient)
│   ├── pages/           # 라우팅 단위의 페이지 컴포넌트
│   ├── types/           # TypeScript 타입 정의
│   └── utils/           # 순수 함수 유틸리티 (e.g., authUtils)
├── public/              # 정적 에셋 (이미지, 폰트 등)
├── REQUIREMENTS_MDs/    # 기능 요구사항 정의서
├── DB_SQL_LOG.md        # 데이터베이스 스키마 변경 이력
├── USER_FLOW.md         # 사용자 흐름 다이어그램 및 시나리오
├── package.json         # 프로젝트 의존성 및 스크립트
└── vite.config.ts       # Vite 설정 파일
```

## 시작하기

### 1. 저장소 복제

```bash
git clone <YOUR_GIT_URL>
cd itscope-app-v1
```

### 2. 의존성 설치

`npm`을 사용하여 필요한 패키지를 설치합니다.

```bash
npm install
```

### 3. 개발 서버 실행

다음 명령어를 실행하여 개발 서버를 시작합니다.

```bash
npm run dev
```

애플리케이션은 `http://localhost:5173` 에서 실행됩니다.

## 환경 변수

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 아래 환경 변수들을 추가해야 합니다.

```
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PROJECT_ANON_KEY
```
- `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase 프로젝트 공개 Anon Key

## 데이터베이스 (Supabase)

- **주요 테이블**:
    - `pm_user`: 사용자 정보 관리
    - `sys_notice`: 시스템 공지사항 관리
    - `pm_user_account_log`: 사용자 계정 활동 로그 기록
    - `pm_code` / `pm_code_group`: 시스템 전반에서 사용되는 공통 코드 관리
- **주요 RPC 함수**:
    - `insert_user_account_log`: 사용자 활동 로그를 삽입
    - `increment_view_count`: 공지사항 조회수를 1 증가
    - `update_last_login`: 로그인 성공 시 최종 로그인 시간 업데이트
    - `increment_failed_login_attempts`: 로그인 실패 시 시도 횟수 증가

## 스크립트

- `npm run dev`: 개발 모드로 애플리케이션을 실행합니다.
- `npm run build`: 프로덕션용으로 애플리케이션을 빌드합니다.
- `npm run lint`: ESLint로 코드 스타일을 검사합니다.
- `npm run preview`: 프로덕션 빌드를 로컬에서 미리 봅니다.

## AI 페어 프로그래밍 가이드

이 프로젝트는 AI 코딩 어시스턴트(Cursor)와 함께 개발되었습니다. AI와 효율적으로 협업하기 위해 다음 가이드라인을 따르는 것을 권장합니다.

- **명확한 지시**: "로그인 버튼을 파란색으로 바꿔줘"와 같이 명확하고 구체적으로 지시합니다.
- **파일 참조**: 코드 수정이 필요한 파일을 언급할 때는 `@` 기호를 사용하여 파일 경로를 명시합니다. (예: `@src/components/SigninStep.tsx`의 스타일을 수정해줘.)
- **규칙/문서 참조**: 프로젝트의 특정 규칙이나 문서를 참고해야 할 경우, 해당 파일명을 `@`와 함께 언급합니다. (예: `@git-rule.mdc` 규칙에 따라 커밋해줘.)
- **컨텍스트 제공**: 복잡한 요청의 경우, AI가 맥락을 더 잘 이해할 수 있도록 관련 배경이나 목표를 함께 설명해주는 것이 좋습니다.
