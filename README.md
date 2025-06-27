# ITSCOPE PMO

"프로젝트 관리의 새로운 시작"을 위한 ITSCOPE PMO 프론트엔드 애플리케이션입니다. 이 애플리케이션은 사용자 회원가입 및 로그인 기능을 제공하며, React, TypeScript, Vite를 기반으로 구축되었습니다.

## 기술 스택

- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router
- **State Management**: TanStack Query
- **Form Handling**: React Hook Form
- **Schema Validation**: Zod
- **인증**: Supabase Auth (Email/Password, Social Login), JWT
- **상태 관리**: React Hooks (useState, useContext)
- **UI 라이브러리**: Radix UI, Lucide React
- **폼 처리**: (직접 구현)
- **알림**: Sonner (Toast notifications)

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

<!-- 애플리케이션은 `http://localhost:5173` 에서 실행됩니다. -->

## 주요 기능

- **통합 인증 시스템**: 이메일/비밀번호, Google, GitHub를 통한 간편한 로그인 및 회원가입
- **고도화된 인증 흐름**: 사용자의 가입 여부에 따라 로그인 또는 회원가입으로 유도하는 동적 UI/UX 제공
- **실시간 이메일 중복 확인**: 회원가입 시 이메일을 입력하면 실시간으로 가입 여부를 확인하고 즉시 로그인 전환을 지원
- **안전한 비밀번호 관리**: `bcryptjs`를 사용한 비밀번호 해싱으로 사용자 정보 보안 강화
- **동적 공지사항 목록**: DB에서 공지 데이터를 가져와 게시 기간에 맞는 목록을 동적으로 표시하고, 사용자의 읽음 상태를 브라우저에 저장
- **반응형 디자인**: 데스크톱과 모바일 환경에 최적화된 UI 제공
- **도움말 및 지원**: 법적 고지(이용약관, 개인정보처리방침) 모달 및 문의 채널 제공

## 프로젝트 구조

```
itscope-app-v1/
├── public/              # 정적 에셋
│   ├── components/      # React 컴포넌트
│   │   ├── ui/          # shadcn/ui 컴포넌트
│   │   └── *.tsx        # 기능별 커스텀 컴포넌트 (로그인, 회원가입 등)
│   ├── hooks/           # 커스텀 훅
│   ├── lib/             # 유틸리티 함수
│   ├── pages/           # 페이지 컴포넌트
│   ├── types/           # TypeScript 타입 정의
│   └── utils/           # 유틸리티 함수
├── package.json         # 프로젝트 의존성 및 스크립트
└── vite.config.ts       # Vite 설정 파일
```

## 스크립트

- `npm run dev`: 개발 모드로 애플리케이션을 실행합니다.
- `npm run build`: 프로덕션용으로 애플리케이션을 빌드합니다.
- `npm run lint`: ESLint로 코드 스타일을 검사합니다.
- `npm run preview`: 프로덕션 빌드를 로컬에서 미리 봅니다.

- `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase 프로젝트 Anon Key
