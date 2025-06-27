# ITSCOPE PMO 디자인 시스템

이 문서는 ITSCOPE PMO 애플리케이션의 일관된 UI/UX를 위한 디자인 가이드라인을 제공합니다.

## 1. 색상 팔레트 (Color Palette)

색상 팔레트는 애플리케이션의 전체적인 톤앤매너를 결정합니다. 매우 어두운 회색(Zinc)을 기본으로 하며, 주요 액션을 위한 파란색(Blue)과 상태/알림을 위한 다양한 색상을 포인트로 사용합니다.

### 기본 배경 (Backgrounds)

| 사용처 | 클래스 | 색상 |
| --- | --- | --- |
| 좌측 패널 (그라데이션) | `from-slate-900 via-slate-800 to-slate-900` | ![#1e293b](https://via.placeholder.com/15/1e293b/000000?text=+) `#334155` |
| 우측 패널 | `bg-zinc-900` | ![#18181b](https://via.placeholder.com/15/18181b/000000?text=+) `#18181b` |
| 입력 필드, 버튼 (outline) | `bg-zinc-800` | ![#27272a](https://via.placeholder.com/15/27272a/000000?text=+) `#27272a` |
| 호버 (버튼 등) | `hover:bg-zinc-600` | ![#52525b](https://via.placeholder.com/15/52525b/000000?text=+) `#52525b` |

### 텍스트 (Text)

| 사용처 | 클래스 | 색상 |
| --- | --- | --- |
| 기본 (밝은 배경 위) | `text-white` | ![#ffffff](https://via.placeholder.com/15/ffffff/000000?text=+) `#ffffff` |
| 부가 정보 (어두운 배경 위) | `text-zinc-300` / `text-zinc-400` | ![#d4d4d8](https://via.placeholder.com/15/d4d4d8/000000?text=+) `#d4d4d8` / `#a1a1aa` |
| 플레이스홀더 | `placeholder-zinc-500` | ![#71717a](https://via.placeholder.com/15/71717a/000000?text=+) `#71717a` |
| 비활성화 | `disabled:text-zinc-500` / `disabled:text-zinc-600` | ![#71717a](https://via.placeholder.com/15/71717a/000000?text=+) `#71717a` / ![#52525b](https://via.placeholder.com/15/52525b/000000?text=+) `#52525b` |

### 테두리 (Borders)

| 사용처 | 클래스 | 색상 |
| --- | --- | --- |
| 기본 | `border-zinc-700` | ![#3f3f46](https://via.placeholder.com/15/3f3f46/000000?text=+) `#3f3f46` |
| 장식 요소 | `border-zinc-800` | ![#27272a](https://via.placeholder.com/15/27272a/000000?text=+) `#27272a` |
| 포커스 (활성) | `focus:border-blue-500` | ![#3b82f6](https://via.placeholder.com/15/3b82f6/000000?text=+) `#3b82f6` |

### 강조/포인트 (Accents)

| 사용처 | 클래스 | 색상 |
| --- | --- | --- |
| 주요 버튼 | `bg-blue-600` | ![#2563eb](https://via.placeholder.com/15/2563eb/000000?text=+) `#2563eb` |
| 링크 | `text-blue-400` | ![#60a5fa](https://via.placeholder.com/15/60a5fa/000000?text=+) `#60a5fa` |
| 오류 | `text-red-400` | ![#f87171](https://via.placeholder.com/15/f87171/000000?text=+) `#f87171` |
| 좌측 패널 포인트 1 | `bg-blue-500` | ![#3b82f6](https://via.placeholder.com/15/3b82f6/000000?text=+) `#3b82f6` |
| 좌측 패널 포인트 2 | `bg-purple-500` | ![#a855f7](https://via.placeholder.com/15/a855f7/000000?text=+) `#a855f7` |
| 좌측 패널 포인트 3 | `bg-green-500` | ![#22c55e](https://via.placeholder.com/15/22c55e/000000?text=+) `#22c55e` |
| 좌측 패널 포인트 4 | `bg-yellow-500` | ![#eab308](https://via.placeholder.com/15/eab308/000000?text=+) `#eab308` |

---

## 2. 타이포그래피 (Typography)

일관된 사용자 경험을 위해 정의된 텍스트 스타일을 사용합니다. 기본 폰트는 'Noto Sans KR' 입니다.

| 사용처 | 클래스 | 폰트 크기 / 줄 간격 | 특징 |
| --- | --- | --- | --- |
| **H1 - 메인 타이틀** | `text-3xl font-bold` | `1.875rem` / `2.25rem` | 가장 큰 제목 (좌측 패널) |
| **H2 - 서브 타이틀** | `text-2xl font-bold` | `1.5rem` / `2rem` | 각 단계별 제목 (우측 패널) |
| **H3 - 섹션 제목** | `text-xl font-semibold` | `1.25rem` / `1.75rem` | 콘텐츠 그룹 제목 |
| **본문 (Large)** | `text-lg` | `1.125rem` / `1.75rem` | 설명 문구 |
| **본문 (Default)** | (기본값) `text-base` | `1rem` / `1.5rem` | 대부분의 텍스트 |
| **본문 (Small)** | `text-sm` | `0.875rem` / `1.25rem` | 부가 정보, 라벨 |
| **본문 (Extra Small)** | `text-xs` | `0.75rem` / `1rem` | 가장 작은 텍스트 |

--- 