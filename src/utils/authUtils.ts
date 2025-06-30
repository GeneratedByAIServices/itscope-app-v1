import { supabase } from '../lib/supabaseClient';
import { PMUser } from '../types/auth';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

// --- 타입 정의 ---
// PM_USER 테이블의 전체 구조를 반영하는 타입
// (src/types/auth.ts 로 이동)

// --- DB 통신 및 Mock 인증 함수 ---

/**
 * 이메일 주소로 pm_user 테이블에서 사용자 프로필 정보를 조회합니다.
 * @param email - 조회할 사용자의 이메일
 * @returns 사용자 프로필 객체 또는 null
 */
export const getUserByEmail = async (email: string): Promise<PMUser | null> => {
  console.log(`[getUserByEmail] Attempting to fetch user with email: ${email}`);
  try {
    // RPC 대신 표준 SELECT 쿼리 사용으로 변경
    const { data, error } = await supabase
      .from('pm_user')
      .select('*')
      .eq('email', email)
      .single(); // 단일 행을 가져오도록 보장

    console.log('[getUserByEmail] Supabase response:', { data, error });

    if (error) {
      // 'PGRST116' 코드는 결과가 0개 행일 때 발생하는 오류로, 여기서는 정상적인 상황입니다.
      // 따라서 해당 오류는 무시하고 null을 반환합니다.
      if (error.code !== 'PGRST116') {
        console.error('Error fetching user by email:', error);
      }
      return null;
    }
    
    console.log('[getUserByEmail] Successfully fetched data:', data);
    return data as PMUser;

  } catch (error) {
    console.error('[getUserByEmail] Exception caught:', error);
    return null;
  }
};

/**
 * 이메일 존재 여부를 확인합니다.
 * @param email - 확인할 이메일
 * @returns 이메일 존재 시 true
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  console.log(`[checkEmailExists] Checking for email: ${email}`);
  const user = await getUserByEmail(email);
  console.log(`[checkEmailExists] User found:`, user);
  const exists = !!user;
  console.log(`[checkEmailExists] Email exists: ${exists}`);
  return exists;
};

interface SignupData {
  email: string;
  password: string;
  name: string;
}

/**
 * (Mock) 회원가입을 시도합니다.
 * 비밀번호는 사용하지 않으며, pm_user 테이블에 프로필만 생성합니다.
 * @param email - 신규 사용자 이메일
 * @param password - (사용되지 않음) 신규 사용자 비밀번호
 * @param name - 신규 사용자 이름
 * @returns 생성된 사용자 프로필과 에러 객체를 반환
 */
export const attemptSignup = async ({ email, password, name }: SignupData): Promise<{ user: PMUser | null, error: any }> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { data: newUser, error: createError } = await supabase
      .from('pm_user')
      .insert([
        {
          id: uuidv4(),
          email,
          name,
          password_hash, // Store the hash, not the password
          account_status_code_id: 9, // '활성'
          account_type_code_id: 12, // '일반 사용자'
        },
      ])
      .select()
      .single();

    if (createError) {
      console.error('Error creating user profile:', createError);
      return { user: null, error: createError };
    }

    return { user: newUser, error: null };
  } catch (error) {
    console.error('Exception during signup:', error);
    return { user: null, error };
  }
};

/**
 * (Mock) 로그인을 시도합니다.
 * pm_user 테이블에 이메일이 존재하면 항상 성공으로 간주합니다. 비밀번호는 검증하지 않습니다.
 * @param email - 사용자 이메일
 * @param password - (사용되지 않음) 사용자 비밀번호
 * @returns 사용자 프로필 또는 null
 */
export const attemptSignin = async (email: string, password: string): Promise<{ user: PMUser | null, error: any }> => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return { user: null, error: { message: "사용자를 찾을 수 없습니다." } };
    }

    if (!user.password_hash) {
      // 소셜 로그인 등으로 패스워드가 없는 경우
      return { user: null, error: { message: "비밀번호가 설정되지 않은 계정입니다." } };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (isPasswordCorrect) {
      // 여기에 마지막 로그인 시간 업데이트 로직 추가 가능
      return { user, error: null };
    } else {
      // 여기에 로그인 실패 횟수 증가 로직 추가 가능
      return { user: null, error: { message: "비밀번호가 일치하지 않습니다." } };
    }
  } catch (error) {
    console.error('Exception during signin:', error);
    return { user: null, error };
  }
};

/**
 * pm_user 테이블에서 모든 사용자 목록을 가져옵니다. (테스트용)
 * @returns 모든 사용자 프로필 배열 또는 null
 */
export const getAllUsers = async (): Promise<PMUser[] | null> => {
  const { data, error } = await supabase
    .from('pm_user')
    .select('*');

  if (error) {
    console.error('Error fetching all users:', error);
    return null;
  }

  return data;
};

// --- 유틸리티 함수 (변경 없음) ---

// 이메일 유효성 검사
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비밀번호 유효성 검사
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('8자 이상이어야 합니다');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('대문자를 포함해야 합니다');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('소문자를 포함해야 합니다');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('숫자를 포함해야 합니다');
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('특수문자를 포함해야 합니다');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 2단계 인증 코드 검증 (가짜 구현 - 변경 없음)
export const verifyTwoFactorCode = async (code: string): Promise<boolean> => {
  console.log(`(Mock) Verifying 2FA code: ${code}`);
  await new Promise(resolve => setTimeout(resolve, 600));
  // 간단한 가짜 검증
  const isValid = code === '123456';
  console.log(`(Mock) 2FA verification result: ${isValid}`);
  return isValid;
};

export const updateUserPassword = async (email: string, newPassword: string): Promise<{ success: boolean; error?: any }> => {
    try {
      if (!newPassword) {
        throw new Error('New password cannot be empty.');
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      const { error } = await supabase
        .from('pm_user')
        .update({ password_hash: hashedPassword })
        .eq('email', email);
  
      if (error) {
        console.error('Error updating password:', error);
        throw error;
      }
  
      return { success: true };
    } catch (error) {
      console.error('An unexpected error occurred during password update:', error);
      return { success: false, error };
    }
  };

export const getNotices = async () => {
    try {
        const { data, error } = await supabase
            .from('sys_notice')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching notices:', error);
        return { success: false, error };
    }
};

export const incrementNoticeViewCount = async (noticeId: number) => {
    try {
        const { error } = await supabase.rpc('increment_view_count', { notice_id_arg: noticeId });
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error incrementing view count:', error);
        return { success: false, error };
    }
};

export const updateLastLogin = async (email: string) => {
  try {
    const { error } = await supabase.rpc('update_last_login', { user_email: email });
    if (error) throw error;
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

export const incrementFailedLoginAttempts = async (email: string) => {
  try {
    const { error } = await supabase.rpc('increment_failed_login_attempts', { user_email: email });
    if (error) throw error;
  } catch (error) {
    console.error('Error incrementing failed login attempts:', error);
  }
};

type LogUserActivityOptions = {
  userId: string | null;
  eventCategory: 'Authentication' | 'Account' | 'Profile';
  eventAction: string;
  isSuccess: boolean;
  metadata?: Record<string, any>;
}

export const logUserActivity = async (options: LogUserActivityOptions) => {
  const { userId, eventCategory, eventAction, isSuccess, metadata } = options;
  try {
    const { error } = await supabase.rpc('insert_user_account_log', {
      p_user_id: userId,
      p_event_category: eventCategory,
      p_event_action: eventAction,
      p_is_success: isSuccess,
      p_metadata: metadata,
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error logging user activity:', error);
  }
};
