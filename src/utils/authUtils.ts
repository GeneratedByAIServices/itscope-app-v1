import { User } from '../types/auth';

// 가짜 사용자 데이터베이스
const FAKE_USERS: User[] = [
  {
    id: '1',
    email: 'admin@itscope.com',
    name: '관리자',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'user@example.com',
    name: '일반사용자',
    createdAt: new Date('2024-02-01')
  }
];

// 이메일 존재 여부 확인 (가짜 구현)
export const checkEmailExists = async (email: string): Promise<boolean> => {
  console.log(`이메일 존재 여부 확인: ${email}`);
  
  // 실제 API 호출을 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const exists = FAKE_USERS.some(user => user.email === email);
  console.log(`결과: ${exists ? '존재함' : '존재하지 않음'}`);
  
  return exists;
};

// 사용자 정보 조회 (가짜 구현)
export const getUserByEmail = async (email: string): Promise<User | null> => {
  // 실제 API 호출을 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const user = FAKE_USERS.find(u => u.email === email);
  return user || null;
};

// 로그인 시도 (가짜 구현)
export const attemptSignin = async (email: string, password: string): Promise<User | null> => {
  console.log(`로그인 시도: ${email}, 비밀번호: ${password}`);
  
  // 실제 API 호출을 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = FAKE_USERS.find(u => u.email === email);
  
  // 간단한 비밀번호 체크 (실제로는 해시된 비밀번호와 비교)
  if (user && password === 'password123') {
    console.log('로그인 성공:', user);
    return user;
  }
  
  console.log('로그인 실패: 잘못된 비밀번호');
  return null;
};

// 회원가입 (가짜 구현)
export const attemptSignup = async (email: string, password: string, name: string): Promise<User> => {
  console.log(`회원가입 시도: ${email}, 이름: ${name}`);
  
  // 실제 API 호출을 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newUser: User = {
    id: String(FAKE_USERS.length + 1),
    email,
    name,
    createdAt: new Date()
  };
  
  FAKE_USERS.push(newUser);
  console.log('회원가입 성공:', newUser);
  
  return newUser;
};

// 2단계 인증 코드 검증 (가짜 구현)
export const verifyTwoFactorCode = async (code: string, method: 'totp' | 'sms'): Promise<boolean> => {
  console.log(`2단계 인증 코드 검증: ${code}, 방법: ${method}`);
  
  // 실제 API 호출을 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // 간단한 검증 (실제로는 서버에서 검증)
  const isValid = code === '123456';
  console.log(`2단계 인증 결과: ${isValid ? '성공' : '실패'}`);
  
  return isValid;
};

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
