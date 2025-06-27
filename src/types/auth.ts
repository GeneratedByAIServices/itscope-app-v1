/**
 * public.pm_user 테이블 및 Supabase auth.users의 정보를 종합한 사용자 타입
 */
export interface PMUser {
  id: string; // uuid from auth.users
  email: string;
  name?: string | null;
  is_admin?: boolean | null;
  password_hash?: string | null;
  last_login_at?: string | null;
  failed_login_attempts?: number | null;
  job_title?: string | null;
  department_id: number | null;
  session_status_code_id: number | null;
  account_status_code_id: number | null;
  account_type_code_id: number | null;
  two_factor_method_code_id: number | null;
  work_status_code_id: number | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface AuthState {
  step: 'welcome' | 'email' | 'signin' | 'signup' | 'twofa' | 'dashboard';
  email: string;
  isSignup: boolean;
  user: User | null;
  isExpanded: boolean;
}

export interface TwoFactorMethod {
  type: 'totp' | 'sms';
  label: string;
  description: string;
}
