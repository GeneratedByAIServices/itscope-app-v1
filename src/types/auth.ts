
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
