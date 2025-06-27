# Supabase 데이터베이스 스키마 변경 로그

이 문서는 `Supabase MCP`를 통해 실행된 모든 데이터베이스 스키마 관련 SQL 쿼리를 기록합니다.
실행된 순서대로 기록되며, 가장 최근의 변경 내역이 맨 아래에 위치합니다.

---

### 1. `create_users_table` (2024-07-31 11:00:00)

**설명:** 초기 사용자 정보 저장을 위한 `users` 테이블을 생성합니다.

```sql
CREATE TABLE public.users (
  id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NULL,
  email text NOT NULL,
  profile_image_url text NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);
```

---

### 2. `drop_users_table` (2024-07-31 11:15:00)

**설명:** 스키마 재설계를 위해 기존 `users` 테이블을 삭제합니다.

```sql
DROP TABLE public.users;
```

---

### 3. `create_initial_core_tables` (2024-07-31 11:15:01)

**설명:** 코드 관리 시스템 및 회사/부서 정보 등 핵심 기반 테이블 4개를 생성합니다.

```sql
-- 1. PM_CODE_GROUP: 코드 그룹 테이블 생성
CREATE TABLE public.pm_code_group (
  group_id integer NOT NULL,
  group_name text NOT NULL,
  description text NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  CONSTRAINT pm_code_group_pkey PRIMARY KEY (group_id),
  CONSTRAINT pm_code_group_group_name_key UNIQUE (group_name)
);

-- 2. PM_CODE: 개별 코드 테이블 생성
CREATE TABLE public.pm_code (
  code_id serial NOT NULL,
  group_id integer NOT NULL,
  code_value text NOT NULL,
  code_name text NOT NULL,
  sort_order integer NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  description text NULL,
  value_1 text NULL,
  value_2 text NULL,
  value_3 text NULL,
  value_4 text NULL,
  value_5 text NULL,
  CONSTRAINT pm_code_pkey PRIMARY KEY (code_id),
  CONSTRAINT pm_code_group_id_code_value_key UNIQUE (group_id, code_value),
  CONSTRAINT pm_code_group_id_sort_order_key UNIQUE (group_id, sort_order),
  CONSTRAINT pm_code_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.pm_code_group(group_id)
);

-- 3. PM_COMPANY: 회사 정보 테이블 생성
CREATE TABLE public.pm_company (
  company_id serial NOT NULL,
  company_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pm_company_pkey PRIMARY KEY (company_id)
);

-- 4. PM_DEPARTMENT: 부서 정보 테이블 생성
CREATE TABLE public.pm_department (
  department_id serial NOT NULL,
  department_name text NOT NULL,
  company_id integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pm_department_pkey PRIMARY KEY (department_id),
  CONSTRAINT pm_department_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.pm_company(company_id)
);
```

---

### 4. `create_pm_user_table` (2024-07-31 11:15:02)

**설명:** 최종 사용자 정보 모델인 `pm_user` 테이블을 생성하고, 다른 테이블과의 관계(FK)를 설정합니다.

```sql
CREATE TABLE public.pm_user (
  id uuid NOT NULL,
  email text NOT NULL,
  name text NULL,
  is_admin boolean NOT NULL DEFAULT false,
  last_login_at timestamptz NULL,
  failed_login_attempts integer NOT NULL DEFAULT 0,
  job_title text NULL,
  department_id integer NULL,
  session_status_code_id integer NULL,
  account_status_code_id integer NULL,
  account_type_code_id integer NULL,
  two_factor_method_code_id integer NULL,
  work_status_code_id integer NULL,
  CONSTRAINT pm_user_pkey PRIMARY KEY (id),
  CONSTRAINT pm_user_email_key UNIQUE (email),
  CONSTRAINT pm_user_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT pm_user_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.pm_department(department_id),
  CONSTRAINT pm_user_session_status_fkey FOREIGN KEY (session_status_code_id) REFERENCES public.pm_code(code_id),
  CONSTRAINT pm_user_account_status_fkey FOREIGN KEY (account_status_code_id) REFERENCES public.pm_code(code_id),
  CONSTRAINT pm_user_account_type_fkey FOREIGN KEY (account_type_code_id) REFERENCES public.pm_code(code_id),
  CONSTRAINT pm_user_two_factor_method_fkey FOREIGN KEY (two_factor_method_code_id) REFERENCES public.pm_code(code_id),
  CONSTRAINT pm_user_work_status_fkey FOREIGN KEY (work_status_code_id) REFERENCES public.pm_code(code_id)
);
```

---

### 5. `insert_initial_code_and_company_data` (2024-07-31 11:30:00)

**설명:** 시스템 운영에 필요한 회사, 부서, 그리고 각종 상태 코드 그룹 및 개별 코드 데이터를 초기 생성합니다.

```sql
-- Insert Company Data
INSERT INTO public.pm_company (company_name) VALUES ('ITSCOPE');

-- Insert Department Data
INSERT INTO public.pm_department (department_name, company_id) VALUES
('IT 개발팀', 1),
('서비스 기획팀', 1),
('디자인팀', 1);

-- Insert Code Group Data
INSERT INTO public.pm_code_group (group_id, group_name, description) VALUES
(10001, 'SESSION_STATUS', '사용자 세션 상태'),
(10002, 'ACCOUNT_STATUS', '사용자 계정 상태'),
(10003, 'ACCOUNT_TYPE', '사용자 계정 생성 유형 (이메일/소셜)'),
(10004, 'TWO_FACTOR_METHOD', '2단계 인증 수단'),
(10005, 'WORK_STATUS', '사용자 현재 업무 상태');

-- Insert Code Data
-- 10001: SESSION_STATUS
INSERT INTO public.pm_code (group_id, code_value, code_name, sort_order) VALUES
(10001, 'ONLINE', '온라인', 0),
(10001, 'OFFLINE', '오프라인', 1),
(10001, 'ERROR', '오류', 2);

-- 10002: ACCOUNT_STATUS
INSERT INTO public.pm_code (group_id, code_value, code_name, sort_order) VALUES
(10002, 'ACTIVE', '활성', 0),
(10002, 'INACTIVE', '비활성', 1),
(10002, 'SUSPENDED', '정지', 2),
(10002, 'PENDING_VERIFICATION', '이메일 인증 대기', 3);

-- 10003: ACCOUNT_TYPE
INSERT INTO public.pm_code (group_id, code_value, code_name, sort_order) VALUES
(10003, 'EMAIL', '이메일', 0),
(10003, 'GOOGLE', '구글', 1);

-- 10004: TWO_FACTOR_METHOD
INSERT INTO public.pm_code (group_id, code_value, code_name, sort_order) VALUES
(10004, 'NONE', '사용 안함', 0),
(10004, 'EMAIL', '이메일 인증', 1),
(10004, 'TOTP', 'OTP 앱', 2);

-- 10005: WORK_STATUS
INSERT INTO public.pm_code (group_id, code_value, code_name, sort_order) VALUES
(10005, 'WORKING', '업무중', 0),
(10005, 'AWAY', '부재중', 1),
(10005, 'INACTIVE', '비활성화', 2);
```

### 2024-07-25: 외래 키(Foreign Key) 제거 및 초기 사용자 데이터 생성

- **사유**: Mock 인증을 활성화하기 위해, `pm_user.id`와 `auth.users.id`를 연결하는 외래 키 제약 조건을 제거했습니다. 이를 통해 Supabase 인증 스키마에 의존하지 않고 `pm_user` 테이블에 직접 사용자를 생성할 수 있게 되었습니다. 이후, 4개의 사전 등록 사용자 계정을 `pm_user` 테이블에 추가했습니다.
- **마이그레이션 이름**: `drop_user_id_foreign_key`
- **SQL**:
  ```sql
  ALTER TABLE public.pm_user
  DROP CONSTRAINT pm_user_id_fkey;
  ```
- **마이그레이션 이름**: `seed_pre-registered_users_retry`
- **SQL**:
  ```sql
  -- 사전 등록 사용자 4명 추가 (재시도)
  INSERT INTO public.pm_user (id, email, name, is_admin, job_title, account_status_code_id, account_type_code_id)
  VALUES 
  ('4b01476f-876a-49a3-a0e2-7e04f9b17f59', 'admin@itscope.com', '관리자', true, 'System Administrator', 9, 12),
  ('e97491b6-e822-421b-a53b-e8549e377f0a', 'pl@itscope.com', '김프로', false, 'Project Leader', 9, 12),
  ('d5f1e8e8-d1d6-4e5a-a3a8-6e5a07c4c34e', 'dev@itscope.com', '이개발', false, 'Software Developer', 9, 12),
  ('1f6b2e3c-2e9b-4e8a-8b1a-9e1e2c3d4f5a', 'user@itscope.com', '박사용', false, 'QA Tester', 9, 12);
  ```

---

### 2024-07-25: `pm_user` 테이블 RLS 정책 추가

- **사유**: 클라이언트에서 `pm_user` 테이블의 사용자 목록을 조회할 수 있도록, 모든 사용자에게 `SELECT` 권한을 부여하는 행 수준 보안(RLS) 정책을 추가했습니다. 이는 테스트 및 개발 목적으로 적용되었습니다.
- **마이그레이션 이름**: `enable_read_for_all_on_pm_user`
- **SQL**:
  ```sql
  -- pm_user 테이블에 행 수준 보안(RLS) 활성화
  ALTER TABLE public.pm_user ENABLE ROW LEVEL SECURITY;

  -- 모든 사용자가 pm_user 데이터를 읽을 수 있도록 허용하는 정책 생성
  CREATE POLICY "Allow all users to read user data"
  ON public.pm_user
  FOR SELECT
  USING (true);
  ```

---

### 2024-07-25: `PM_CODE` 및 `PM_USER` 테이블 구조 개선

- **사유**: `PM_CODE` 테이블의 관리 편의성을 높이기 위해 `sort_order`를 대체하는 `code_no`를 도입하고, `PM_USER` 테이블에 SMS 인증을 위한 연락처 정보를 추가했습니다.
- **마이그레이션 이름**: `enhance_pm_code_and_pm_user_tables`
- **SQL**:
  ```sql
  -- 1. PM_CODE 테이블에 code_no 컬럼 추가
  ALTER TABLE public.pm_code ADD COLUMN code_no INTEGER;

  -- 2. 기존 sort_order 값으로 code_no 초기화
  UPDATE public.pm_code SET code_no = sort_order;

  -- 3. code_no 컬럼에 NOT NULL 제약 조건 추가
  ALTER TABLE public.pm_code ALTER COLUMN code_no SET NOT NULL;

  -- 4. (group_id, code_no) 복합 유니크 제약 조건 추가
  ALTER TABLE public.pm_code ADD CONSTRAINT pm_code_group_id_code_no_key UNIQUE (group_id, code_no);

  -- 5. pm_user 테이블에 국가번호 및 휴대폰번호 컬럼 추가
  ALTER TABLE public.pm_user
  ADD COLUMN country_code VARCHAR(4) NOT NULL DEFAULT '+82',
  ADD COLUMN phone_number VARCHAR(20) NULL;

  -- 6. 기존 sort_order의 유니크 제약 조건 제거 (code_no가 이를 대체)
  ALTER TABLE public.pm_code DROP CONSTRAINT pm_code_group_id_sort_order_key;
  ```

---

### 2024-07-25: 인증 로그 테이블 생성

- **사유**: 사용자 인증 시도를 기록하고 추적하기 위해 1차, 2차 인증 로그 테이블을 생성했습니다.
- **마이그레이션 이름**: `create_auth_log_tables`
- **SQL**:
  ```sql
  -- 1. 1차 인증 로그 테이블 생성
  CREATE TABLE public.pm_auth_log_primary (
      log_id bigserial PRIMARY KEY,
      user_id uuid NULL, -- 로그인 실패 시 사용자가 특정되지 않을 수 있으므로 NULL 허용
      email_attempted text,
      auth_method_code_id integer NULL REFERENCES public.pm_code(code_id),
      is_success boolean NOT NULL,
      ip_address inet,
      user_agent text,
      created_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.pm_user(id) ON DELETE SET NULL
  );

  -- 2. 2차 인증 로그 테이블 생성
  CREATE TABLE public.pm_auth_log_secondary (
      log_id bigserial PRIMARY KEY,
      user_id uuid NOT NULL REFERENCES public.pm_user(id) ON DELETE CASCADE,
      auth_method_code_id integer NULL REFERENCES public.pm_code(code_id),
      is_success boolean NOT NULL,
      ip_address inet,
      user_agent text,
      created_at timestamptz NOT NULL DEFAULT now()
  );
  ```

---

### 2024-07-25: 이메일 조회를 위한 RPC 함수 생성

- **사유**: 클라이언트의 `406 (Not Acceptable)` 오류를 해결하고, 데이터베이스 조회를 보다 명시적으로 제어하기 위해 `pm_user` 테이블에서 이메일로 사용자를 조회하는 RPC(Remote Procedure Call) 함수를 생성했습니다.
- **마이그레이션 이름**: `create_rpc_for_get_user_by_email`
- **SQL**:
  ```sql
  CREATE OR REPLACE FUNCTION get_user_by_email_rpc(p_email TEXT)
  RETURNS SETOF pm_user AS $$
  BEGIN
    RETURN QUERY
    SELECT *
    FROM public.pm_user
    WHERE email = p_email;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  ```

### 2024-05-22: 클라이언트에서 사용자 조회를 위한 RLS 정책 추가

- **사유**: 클라이언트에서 `pm_user` 테이블의 사용자 목록을 조회할 수 있도록, 모든 사용자에게 `SELECT` 권한을 부여하는 행 수준 보안(RLS) 정책을 추가했습니다. 이는 테스트 및 개발 목적으로 적용되었습니다.
- **마이그레이션 이름**: `enable_read_for_all_on_pm_user`
- **SQL**:
  ```sql
  -- pm_user 테이블에 행 수준 보안(RLS) 활성화
  ALTER TABLE public.pm_user ENABLE ROW LEVEL SECURITY;

  -- 모든 사용자가 pm_user 데이터를 읽을 수 있도록 허용하는 정책 생성
  CREATE POLICY "Allow anon select on pm_user"
  ON public.pm_user
  FOR SELECT
  TO anon
  USING (true);
  ```

### 2024-05-22: 비밀번호 암호화를 위한 password_hash 컬럼 추가

- **사유**: 비밀번호를 암호화하여 저장하기 위해 `pm_user` 테이블에 `password_hash` 컬럼을 추가했습니다.
- **마이그레이션 이름**: `add_password_hash_to_pm_user`
- **SQL**:
  ```sql
  ALTER TABLE public.pm_user
  ADD COLUMN password_hash TEXT;

  COMMENT ON COLUMN public.pm_user.password_hash IS 'Hashed user password';
  ```

### 2024-05-23: 시스템 공지사항 테이블 생성 및 데이터 시딩

- **사유**: 시스템의 공지사항을 관리하기 위한 `SYS_NOTICE` 테이블을 생성하고, 초기 테스트를 위한 가짜 데이터를 추가했습니다.
- **마이그레이션 이름**: `fix_and_create_sys_notice_table`
- **SQL**:
  ```sql
  -- 1. SYS_NOTICE 테이블 생성 (참조 컬럼명 수정)
  CREATE TABLE public.sys_notice (
      notice_id bigint PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
      title text NOT NULL,
      content text NOT NULL,
      author_id uuid REFERENCES public.pm_user(id) ON DELETE SET NULL,
      notice_type text NOT NULL DEFAULT '일반',
      is_published boolean NOT NULL DEFAULT false,
      is_pinned boolean NOT NULL DEFAULT false,
      publish_start_dt timestamptz,
      publish_end_dt timestamptz,
      view_count integer NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz
  );

  COMMENT ON TABLE public.sys_notice IS '시스템 공지사항 관리 테이블';
  COMMENT ON COLUMN public.sys_notice.author_id IS '작성자 ID (pm_user(id) 참조)';

  -- 2. updated_at 자동 갱신을 위한 함수 및 트리거 생성
  CREATE OR REPLACE FUNCTION public.handle_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = now();
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER on_sys_notice_updated
  BEFORE UPDATE ON public.sys_notice
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

  -- 3. Fake Data 추가
  DO $$
  DECLARE
      first_user_id uuid;
  BEGIN
      SELECT id INTO first_user_id FROM public.pm_user LIMIT 1;

      INSERT INTO public.sys_notice (title, content, author_id, notice_type, is_published, is_pinned, view_count)
      VALUES
      ('v1.1 업데이트 안내', '이번 업데이트에서는 사용자 UI가 개선되고 몇 가지 버그가 수정되었습니다. 많은 이용 바랍니다.', first_user_id, '일반', true, true, 120),
      ('정기 점검 안내 (5/30)', '서비스 안정화를 위해 5월 30일 새벽 2시부터 4시까지 정기 점검이 진행됩니다. 이용에 불편을 드려 죄송합니다.', first_user_id, '점검', true, false, 250),
      ('개인정보처리방침 개정 안내', '개인정보처리방침이 6월 1일부터 일부 개정될 예정입니다. 자세한 내용은 본문을 확인해주세요.', first_user_id, '일반', true, false, 88),
      ('[이벤트] 신규 가입 이벤트 안내 (미게시)', '신규 가입자분들께 특별한 혜택을 드리는 이벤트를 준비 중입니다. 곧 공개될 예정이니 기대해주세요!', first_user_id, '이벤트', false, false, 10),
      ('긴급 장애 복구 완료 안내 (미게시)', '오늘 오전에 발생했던 로그인 장애 문제가 모두 복구되었습니다. 현재 정상적으로 서비스 이용이 가능합니다.', first_user_id, '장애', false, false, 5);
  END $$;

### 2024-05-23: 공지사항 테이블 스키마 수정 및 데이터 업데이트

- **사유**: 공지사항의 실제 이벤트/점검 기간을 별도로 관리하고, 게시 기간을 현실적으로 조정하기 위해 스키마를 수정하고 데이터를 업데이트했습니다.
- **마이그레이션 이름**: `alter_and_update_sys_notice_schema`
- **SQL**:
  ```sql
  -- 1. 스키마 수정: event_start_dt, event_end_dt 컬럼 추가
  ALTER TABLE public.sys_notice
  ADD COLUMN event_start_dt timestamptz,
  ADD COLUMN event_end_dt timestamptz;

  COMMENT ON COLUMN public.sys_notice.event_start_dt IS '이벤트/점검 실제 시작 일시';
  COMMENT ON COLUMN public.sys_notice.event_end_dt IS '이벤트/점검 실제 종료 일시';

  -- 2. 데이터 업데이트
  -- 오늘 날짜: 2025-06-27

  -- Notice 1: v1.1 업데이트 안내 (게시 중, 상단 고정)
  UPDATE public.sys_notice
  SET
      publish_start_dt = '2025-06-20 00:00:00+09',
      publish_end_dt = '2025-07-20 23:59:59+09'
  WHERE title = 'v1.1 업데이트 안내';

  -- Notice 2: 정기 점검 안내 (제목 수정, 게시 중, 이벤트 날짜 설정)
  UPDATE public.sys_notice
  SET
      title = '서비스 정기 점검 안내 (7/15)',
      content = '서비스 안정화를 위해 7월 15일 새벽 2시부터 4시까지 정기 점검이 진행됩니다. 이용에 불편을 드려 죄송합니다.',
      publish_start_dt = '2025-06-25 00:00:00+09',
      publish_end_dt = '2025-07-16 23:59:59+09',
      event_start_dt = '2025-07-15 02:00:00+09',
      event_end_dt = '2025-07-15 04:00:00+09'
  WHERE notice_id = (SELECT notice_id FROM public.sys_notice WHERE content LIKE '%정기 점검%');

  -- Notice 3: 개인정보처리방침 개정 안내 (게시 중)
  UPDATE public.sys_notice
  SET
      publish_start_dt = '2025-06-01 00:00:00+09',
      publish_end_dt = '2025-07-01 23:59:59+09'
  WHERE title = '개인정보처리방침 개정 안내';

  -- Notice 4: 신규 가입 이벤트 안내 (미게시, 이벤트 날짜 설정)
  UPDATE public.sys_notice
  SET
      title = '[이벤트] 신규 가입 이벤트 안내',
      publish_start_dt = '2025-07-01 00:00:00+09',
      publish_end_dt = '2025-07-31 23:59:59+09',
      event_start_dt = '2025-07-01 00:00:00+09',
      event_end_dt = '2025-07-31 23:59:59+09'
  WHERE notice_type = '이벤트';

  -- Notice 5: 긴급 장애 복구 안내 (과거 게시, 단일 이벤트 날짜)
  UPDATE public.sys_notice
  SET
      title = '긴급 장애 복구 완료 안내',
      is_published = true, -- 테스트를 위해 게시된 것으로 변경
      publish_start_dt = '2025-06-26 10:00:00+09',
      publish_end_dt = '2025-06-26 23:59:59+09',
      event_start_dt = '2025-06-26 09:00:00+09',
      event_end_dt = '2025-06-26 10:00:00+09'
  WHERE notice_type = '장애';
  ``` 