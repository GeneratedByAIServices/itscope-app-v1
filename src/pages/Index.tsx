
import React, { useState } from 'react';
import { AuthState } from '../types/auth';
import { checkEmailExists, attemptSignin, attemptSignup, verifyTwoFactorCode } from '../utils/authUtils';

import WelcomePanel from '../components/WelcomePanel';
import EmailStep from '../components/EmailStep';
import SigninStep from '../components/SigninStep';
import SignupStep from '../components/SignupStep';
import TwoFactorStep from '../components/TwoFactorStep';
import SuccessStep from '../components/SuccessStep';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [authState, setAuthState] = useState<AuthState>({
    step: 'welcome',
    email: '',
    isSignup: false,
    user: null,
    isExpanded: false
  });

  const handleEmailNext = async (email: string) => {
    console.log('이메일 입력:', email);
    
    try {
      const emailExists = await checkEmailExists(email);
      
      setAuthState(prev => ({
        ...prev,
        email,
        isSignup: !emailExists,
        step: emailExists ? 'signin' : 'signup',
        isExpanded: true
      }));
    } catch (error) {
      console.error('이메일 확인 중 오류:', error);
    }
  };

  const handleSocialSignin = (provider: 'google' | 'github') => {
    console.log(`${provider} 소셜 로그인 시도`);
    
    // 소셜 로그인 성공 시뮬레이션
    setTimeout(() => {
      setAuthState(prev => ({
        ...prev,
        email: `user@${provider}.com`,
        user: {
          id: '1',
          email: `user@${provider}.com`,
          name: `${provider} 사용자`,
          createdAt: new Date()
        },
        step: 'twofa',
        isExpanded: true
      }));
    }, 1000);
  };

  const handleSigninNext = () => {
    console.log('로그인 완료, 2차 인증으로 이동');
    setAuthState(prev => ({ ...prev, step: 'twofa' }));
  };

  const handleSignupNext = () => {
    console.log('회원가입 완료, 2차 인증으로 이동');
    setAuthState(prev => ({ ...prev, step: 'twofa' }));
  };

  const handleTwoFactorNext = () => {
    console.log('2차 인증 완료');
    setAuthState(prev => ({ ...prev, step: 'success' }));
  };

  const handleSuccessNext = () => {
    console.log('대시보드로 이동');
    setAuthState(prev => ({ ...prev, step: 'dashboard' }));
  };

  const handleBack = () => {
    switch (authState.step) {
      case 'signin':
      case 'signup':
        setAuthState(prev => ({ 
          ...prev, 
          step: 'welcome',
          isExpanded: false,
          email: ''
        }));
        break;
      case 'twofa':
        setAuthState(prev => ({ 
          ...prev, 
          step: authState.isSignup ? 'signup' : 'signin'
        }));
        break;
    }
  };

  const handleLogout = () => {
    console.log('로그아웃');
    setAuthState({
      step: 'welcome',
      email: '',
      isSignup: false,
      user: null,
      isExpanded: false
    });
  };

  const handleForgotPassword = () => {
    console.log('비밀번호 찾기 요청');
    // 실제로는 비밀번호 재설정 플로우로 이동
    alert('비밀번호 재설정 링크가 이메일로 발송되었습니다. (데모)');
  };

  // 대시보드 단계에서는 전체 화면 렌더링
  if (authState.step === 'dashboard') {
    return (
      <Dashboard 
        userEmail={authState.email}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background font-noto">
      <div className="min-h-screen flex">
        {/* Welcome Panel - 2:1 비율의 왼쪽 */}
        <div 
          className={`
            transition-all duration-500 ease-in-out
            ${authState.isExpanded 
              ? 'w-0 overflow-hidden' 
              : 'w-full lg:w-2/3'
            }
          `}
        >
          <WelcomePanel isVisible={!authState.isExpanded} />
        </div>

        {/* Auth Panel - 2:1 비율의 오른쪽 */}
        <div 
          className={`
            bg-white flex flex-col justify-center transition-all duration-500 ease-in-out
            ${authState.isExpanded 
              ? 'w-full' 
              : 'w-full lg:w-1/3'
            }
          `}
        >
          <div className="px-6 py-8 sm:px-10 lg:px-12 max-w-md mx-auto w-full">
            {authState.step === 'welcome' && (
              <EmailStep
                onNext={handleEmailNext}
                onGoogleSignin={() => handleSocialSignin('google')}
                onGithubSignin={() => handleSocialSignin('github')}
              />
            )}

            {authState.step === 'signin' && (
              <SigninStep
                email={authState.email}
                onBack={handleBack}
                onNext={handleSigninNext}
                onForgotPassword={handleForgotPassword}
              />
            )}

            {authState.step === 'signup' && (
              <SignupStep
                email={authState.email}
                onBack={handleBack}
                onNext={handleSignupNext}
              />
            )}

            {authState.step === 'twofa' && (
              <TwoFactorStep
                onBack={handleBack}
                onNext={handleTwoFactorNext}
              />
            )}

            {authState.step === 'success' && (
              <SuccessStep
                userEmail={authState.email}
                onContinue={handleSuccessNext}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
