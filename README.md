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

- **사용자 회원가입**: 이메일, 이름, 비밀번호를 사용하여 새로운 사용자를 등록합니다.
- **사용자 로그인**: 등록된 사용자가 시스템에 접근할 수 있습니다.
- **UI 컴포넌트**: `shadcn/ui`를 활용한 다양한 UI 요소(Button, Input, Card 등)가 구현되어 있습니다.

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
