import { useEffect, useState } from 'react';
import WelcomePanel from '../components/WelcomePanel';
import SignUpInfoPanel from '../components/SignUpInfoPanel';
import EmailStep from '../components/EmailStep';
import SigninStep from '../components/SigninStep';
import SignupStep from '../components/SignupStep';
import TwoFactorStep from '../components/TwoFactorStep';
import SuccessStep from '../components/SuccessStep';
import { getUserByEmail } from '../utils/authUtils';
import { User } from '../types/auth';
import HelpFloatingButton from '../components/HelpFloatingButton';

type AuthStep = 'welcome' | 'signin' | 'signup' | '2fa' | 'success';
type ViewMode = 'welcome' | 'signup';

const IndexPage = () => {
  const [authState, setAuthState] = useState<{
    step: AuthStep;
    email: string;
    user: User | null;
    isExpanded: boolean;
    view: ViewMode;
  }>({
    step: 'welcome',
    email: '',
    user: null,
    isExpanded: false,
    view: 'welcome',
  });
  const [startRightAnimation, setStartRightAnimation] = useState(false);

  useEffect(() => {
    // WelcomePanel 애니메이션(1초) 후 오른쪽 패널 애니메이션 시작
    const timer = setTimeout(() => {
      setStartRightAnimation(true);
    }, 1000); 
    return () => clearTimeout(timer);
  }, []);

  const handleShowSignup = () => {
    setAuthState(s => ({
      ...s,
      step: 'signup',
      view: 'signup',
      email: '',
      isExpanded: false,
    }));
  };

  const handleEmailNext = async (email: string, isRegistered: boolean) => {
    if (isRegistered) {
      const user = await getUserByEmail(email);
      setAuthState(s => ({
        ...s,
        step: 'signin',
        email,
        user,
        isExpanded: false,
        view: 'welcome',
      }));
    } else {
      setAuthState(s => ({
        ...s,
        step: 'signup',
        view: 'signup',
        email,
        isExpanded: false,
      }));
    }
  };

  const handleBack = () => {
    setAuthState(s => ({
      ...s,
      step: 'welcome',
      email: '',
      user: null,
      isExpanded: false,
      view: 'welcome',
    }));
  };

  const handleSocialSignin = (provider: 'google') => {
    console.log(`Signin with ${provider}`);
  };

  const handleSigninNext = () => {
    setAuthState(s => ({ ...s, step: '2fa' }));
  };

  const handleSignupNext = () => {
    setAuthState(s => ({ ...s, step: 'success' }));
  };
  
  const handleTwoFactorNext = () => {
    setAuthState(s => ({ ...s, step: 'success' }));
  };

  const handleForgotPassword = () => {
    console.log('Forgot password for', authState.email);
  };

  const renderStep = () => {
    switch (authState.step) {
      case 'welcome':
        return (
          <EmailStep
            onNext={handleEmailNext}
            onGoogleSignin={() => handleSocialSignin('google')}
            onSignupClick={handleShowSignup}
          />
        );
      case 'signin':
        return (
          <SigninStep
            email={authState.email}
            user={authState.user}
            onBack={handleBack}
            onNext={handleSigninNext}
            onForgotPassword={handleForgotPassword}
          />
        );
      case 'signup':
        return (
          <SignupStep
            email={authState.email}
            onBack={handleBack}
            onNext={handleSignupNext}
          />
        );
      case '2fa':
        return (
          <TwoFactorStep
            email={authState.email}
            onBack={handleBack}
            onNext={handleTwoFactorNext}
          />
        );
      case 'success':
        return <SuccessStep onContinue={() => console.log("Continue to dashboard")} userEmail={authState.email} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-900">
      {/* --- Left Panel (Desktop) --- */}
      <div 
        className={`
          transition-all duration-500 ease-in-out
          hidden 
          ${authState.view === 'welcome' ? 'lg:w-1/2 lg:flex' : (authState.isExpanded ? 'lg:w-0' : 'lg:w-1/2 lg:flex')}
          lg:flex-col lg:justify-center
        `}
      >
        {authState.view === 'welcome' 
          ? <WelcomePanel isVisible={true} />
          : <SignUpInfoPanel isVisible={!authState.isExpanded} />
        }
      </div>
      
      {/* --- Right Panel (Content) --- */}
      <div 
        className={`
          bg-zinc-900 flex flex-col transition-all duration-500 ease-in-out
          w-full flex-grow
          ${authState.view === 'welcome' ? 'lg:w-1/2' : (authState.isExpanded ? 'lg:w-full' : 'lg:w-1/2')}
          transition-opacity duration-1000
          ${startRightAnimation ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {/* --- Mobile Header --- */}
        <div className="lg:hidden pt-16 px-8 pb-4 flex-shrink-0 text-center">
          {authState.view === 'welcome' ? (
            <div className="inline-flex items-center space-x-4">
              <img src="/logo_symbol_color.png" alt="ITSCOPE PMO Logo" className="w-10 h-10" />
              <h1 className="text-xl font-bold text-white">ITSCOPE PMO</h1>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-white">Sign Up</h1>
              <p className="text-zinc-400 mt-1">새로운 시작을 환영합니다!</p>
            </div>
          )}
        </div>
        
        {/* --- Auth Steps Wrapper --- */}
        <div className="flex-grow flex items-center justify-center lg:justify-start p-8">
          {renderStep()}
        </div>
      </div>
      {authState.step !== 'success' && <HelpFloatingButton />}
    </div>
  );
};

export default IndexPage;
