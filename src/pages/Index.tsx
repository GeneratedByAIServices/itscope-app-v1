import { useEffect, useState } from 'react';
import WelcomePanel from '../components/WelcomePanel';
import SignUpInfoPanel from '../components/SignUpInfoPanel';
import EmailStep from '../components/EmailStep';
import SigninStep from '../components/SigninStep';
import SignupStep from '../components/SignupStep';
import TwoFactorStep from '../components/TwoFactorStep';
import SuccessStep from '../components/SuccessStep';
import { getUserByEmail, checkEmailExists, attemptSignin, attemptSignup, getAllUsers } from '../utils/authUtils';
import { PMUser } from '../types/auth';
import HelpFloatingButton from '../components/HelpFloatingButton';
import { toast } from 'sonner';

type AuthStep = 'welcome' | 'signin' | 'signup' | '2fa' | 'success';
type ViewMode = 'welcome' | 'signup';

const IndexPage = () => {
  const [authState, setAuthState] = useState<{
    step: AuthStep;
    email: string;
    user: PMUser | null;
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
    const fetchAndLogUsers = async () => {
      console.log('--- 초기 사용자 정보 로드 ---');
      const users = await getAllUsers();
      if (users) {
        console.log('사전 등록된 사용자 목록:');
        console.table(users.map(u => ({ email: u.email, name: u.name })));
      } else {
        console.log('사용자 정보를 불러오는 데 실패했습니다.');
      }
      console.log('임시 비밀번호 (테스트용):', 'password123');
      console.log('---------------------------');
    };

    fetchAndLogUsers();
  }, []);

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

  const handleNextFromEmail = async (email: string, isRegistered: boolean) => {
    if (isRegistered) {
      const user = await getUserByEmail(email);
      setAuthState(s => ({
        ...s,
        step: 'signin',
        email,
        user,
        view: 'welcome' 
      }));
    } else {
      setAuthState(s => ({ ...s, step: 'signup', email, user: null }));
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
    toast.info(`${provider} 로그인은 추후 구현될 기능입니다.`);
    setAuthState(s => ({ ...s, step: '2fa', email: 'social_user@example.com' }));
  };

  const handleSwitchToLogin = async (email: string) => {
    const user = await getUserByEmail(email);
    setAuthState(s => ({
      ...s,
      step: 'signin',
      email,
      user,
      view: 'welcome',
    }));
  };

  const handleSignin = async (password: string) => {
    const { user, error } = await attemptSignin(authState.email, password);
    if (user) {
      toast.success("로그인 되었습니다.", {
        description: "2단계 인증을 진행합니다."
      });
      setAuthState(s => ({ ...s, step: '2fa', user }));
    } else {
      console.error("Signin failed:", error);
      toast.error("로그인에 실패했습니다.", {
        description: "이메일과 비밀번호를 확인해주세요."
      });
    }
  };

  const handleSignup = async (data: { email: string; password: string; name: string; }) => {
    const { email, password, name } = data;
    // 최종 방어 로직: 가입 직전에 다시 한번 이메일 존재 여부를 서버에 확인
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
        toast.error("이미 가입된 이메일입니다. 로그인 화면으로 이동합니다.");
        const user = await getUserByEmail(email);
        // 로그인 단계로 강제 전환
        setAuthState(s => ({ ...s, step: 'signin', email, user, view: 'welcome' }));
        return;
    }

    const { user, error } = await attemptSignup({ email, password, name });
    if (user) {
      toast.success("회원가입이 완료되었습니다.", {
        description: "로그인을 위해 2단계 인증을 진행합니다."
      });
      setAuthState(s => ({ ...s, step: '2fa', user }));
    } else {
      console.error("Signup failed:", error);
      toast.error(error?.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  const handle2FA = () => {
    // 2FA 성공 후 최종 상태
    setAuthState(s => ({ ...s, step: 'success' }));
  };

  const handleEmailCheck = async (email: string) => {
    return await checkEmailExists(email);
  };

  const renderStep = () => {
    switch (authState.step) {
      case 'welcome':
        return (
          <EmailStep
            onNext={handleNextFromEmail}
            onGoogleSignin={() => handleSocialSignin('google')}
            onSignupClick={() => setAuthState(s => ({ ...s, step: 'signup', user: null }))}
          />
        );
      case 'signin':
        return (
          <SigninStep
            email={authState.email}
            user={authState.user}
            onBack={handleBack}
            onSignin={handleSignin}
            onForgotPassword={() => toast.info("비밀번호 찾기 기능은 아직 구현되지 않았습니다.")}
          />
        );
      case 'signup':
        return (
          <SignupStep
            email={authState.email}
            onBack={handleBack}
            onSignup={handleSignup}
            onSwitchToLogin={handleSwitchToLogin}
          />
        );
      case '2fa':
        return (
          <TwoFactorStep
            user={authState.user}
            onBack={handleBack}
            onVerify={handle2FA}
          />
        );
      case 'success':
        return <SuccessStep user={authState.user} onContinue={() => console.log("Redirecting to dashboard...")} />;
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
        <div className="lg:hidden pt-24 px-8 pb-8 flex-shrink-0 text-center">
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
