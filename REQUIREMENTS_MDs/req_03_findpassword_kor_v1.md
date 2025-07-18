# 비밀번호 찾기 기능 요구사항 (v1)

## 1. 개요
본 문서는 비밀번호를 잊어버린 기존 사용자가 비밀번호를 재설정하기 위한 절차의 기능적 요구사항을 정의합니다.

---

## 2. 공통 요구사항

### 2.1. 다국어 지원 (Internationalization)
- **R-2.1.1**: 비밀번호 찾기 흐름의 모든 UI 텍스트(레이블, 버튼, 안내 문구 등)는 다국어(한국어, 영어)를 지원해야 한다.
- **R-2.1.2**: 모든 서버 응답에 따른 토스트(Toast) 알림 메시지는 현재 설정된 언어로 표시되어야 한다.

---

## 3. 비밀번호 재설정 절차 (`FindPasswordStep`)

### 3.1. 기능 요구사항
- **R-3.1.1**: 사용자가 로그인 화면(`SigninStep`)에서 '비밀번호를 잊으셨나요?' 링크를 클릭하면 `FindPasswordStep`으로 이동해야 한다.
- **R-3.1.2**: 화면에는 사용자의 이메일 주소가 수정 불가능한 상태로 표시되어야 한다.
- **R-3.1.3**: 사용자가 '재설정 링크 받기' 버튼을 클릭하면, 시스템은 해당 이메일 주소로 비밀번호 재설정 링크를 발송해야 한다. (Supabase Auth `resetPasswordForEmail` 기능 사용)
- **R-3.1.4**: 링크 발송 후, 시스템은 "비밀번호 재설정 링크를 이메일로 보냈습니다." 와 같은 성공 메시지를 현재 설정된 언어에 맞춰 `toast` 알림으로 표시해야 한다.
- **R-3.1.5**: Toast 알림 후, 사용자는 자동으로 이전 단계인 `SigninStep`으로 돌아가야 한다.

### 3.2. 편의 기능
- **R-3.2.1**: '로그인으로 돌아가기' 링크를 제공하여, 사용자가 원할 경우 재설정 절차를 중단하고 로그인 화면으로 즉시 돌아갈 수 있도록 해야 한다. 