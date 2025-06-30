import { useEffect, useState } from 'react';
import WelcomePanel from '../components/WelcomePanel';
import SignUpInfoPanel from '../components/SignUpInfoPanel';
import EmailStep from '../components/EmailStep';
import SigninStep from '../components/SigninStep';
import SignupStep from '../components/SignupStep';
import TwoFactorStep from '../components/TwoFactorStep';
import SuccessStep from '../components/SuccessStep';
import Dashboard from '../components/Dashboard';
import { getUserByEmail, checkEmailExists, attemptSignin, attemptSignup, getAllUsers, updateUserPassword, getNotices, incrementNoticeViewCount, updateLastLogin, incrementFailedLoginAttempts, logUserActivity } from '../utils/authUtils';
import { PMUser } from '../types/auth';
import HelpFloatingButton from '../components/HelpFloatingButton';
import { toast } from 'sonner';
import FindPasswordStep from '../components/FindPasswordStep';
import NoticeList from '../components/NoticeList';
import NoticeDetailModal from '../components/NoticeDetailModal';
import { Notice } from '../types/notice';
import { useIsMobile } from '../hooks/use-mobile';

type AuthStep = 'welcome' | 'signin' | 'signup' | '2fa' | 'success' | 'findPassword' | 'dashboard';
type ViewMode = 'welcome' | 'signup';

const HIDDEN_NOTICES_KEY = 'hidden_notices';
const READ_NOTICES_KEY = 'read_notices';
const TOOLTIP_SHOWN_COUNT_KEY = 'notice_hide_tooltip_shown_count';

const IndexPage = () => {
  const isMobile = useIsMobile();
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
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Notice state lifted up
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoadingNotices, setIsLoadingNotices] = useState(true);
  const [hiddenNoticeIds, setHiddenNoticeIds] = useState<number[]>([]);
  const [hidingNoticeIds, setHidingNoticeIds] = useState<number[]>([]);
  const [readNoticeIds, setReadNoticeIds] = useState<number[]>([]);
  const [canShowTooltip, setCanShowTooltip] = useState(false);

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

  useEffect(() => {
    // localStorage 접근은 클라이언트 사이드에서만
    const storedHiddenIds = JSON.parse(localStorage.getItem(HIDDEN_NOTICES_KEY) || '[]');
    setHiddenNoticeIds(storedHiddenIds);

    const storedReadIds = JSON.parse(localStorage.getItem(READ_NOTICES_KEY) || '[]');
    setReadNoticeIds(storedReadIds);

    const tooltipCount = parseInt(localStorage.getItem(TOOLTIP_SHOWN_COUNT_KEY) || '0', 10);
    if (tooltipCount < 2) {
        setCanShowTooltip(true);
    }
    
    const fetchAndFilterNotices = async () => {
        setIsLoadingNotices(true);
        const { success, data } = await getNotices();
        if (success && data) {
            const now = new Date();
            const publishedNotices = data.filter(n => {
                if (!n.is_published) return false;
                const startDate = n.publish_start_dt ? new Date(n.publish_start_dt) : null;
                const endDate = n.publish_end_dt ? new Date(n.publish_end_dt) : null;
                const isAfterStartDate = !startDate || now >= startDate;
                const isBeforeEndDate = !endDate || now <= endDate;
                return isAfterStartDate && isBeforeEndDate;
            });
            
            publishedNotices.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
            setNotices(publishedNotices);
        }
        setIsLoadingNotices(false);
    };
    fetchAndFilterNotices();
  }, []);

  const handleMarkAsRead = (noticeId: number) => {
    if (readNoticeIds.includes(noticeId)) return;
    const newReadIds = [...readNoticeIds, noticeId];
    setReadNoticeIds(newReadIds);
    localStorage.setItem(READ_NOTICES_KEY, JSON.stringify(newReadIds));
  };

  const handleNoticeClick = (notice: Notice) => {
    handleMarkAsRead(notice.notice_id);
    incrementNoticeViewCount(notice.notice_id);

    // 낙관적 업데이트 (Optimistic Update)
    const updatedNotice = { ...notice, view_count: notice.view_count + 1 };

    // 1. 전체 공지 목록 상태를 업데이트
    setNotices(currentNotices =>
      currentNotices.map(n =>
        n.notice_id === notice.notice_id ? updatedNotice : n
      )
    );

    // 2. 모달에 표시될 공지 상태를 업데이트
    setSelectedNotice(updatedNotice);
  };

  const handleHideNotice = (noticeId: number) => {
    if (hidingNoticeIds.includes(noticeId)) return;

    setHidingNoticeIds(prev => [...prev, noticeId]);

    setTimeout(() => {
        setHiddenNoticeIds(prevHiddenIds => {
            const newHiddenIds = [...prevHiddenIds, noticeId];
            localStorage.setItem(HIDDEN_NOTICES_KEY, JSON.stringify(newHiddenIds));
            return newHiddenIds;
        });
    }, 500);
  };

  const handleTooltipHover = () => {
    let count = parseInt(localStorage.getItem(TOOLTIP_SHOWN_COUNT_KEY) || '0', 10);
    if (count < 2) {
        count++;
        localStorage.setItem(TOOLTIP_SHOWN_COUNT_KEY, count.toString());
        if (count >= 2) {
            setCanShowTooltip(false);
        }
    }
  };

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

  const handleSocialSignin = () => {
    // 이 부분은 실제 Google OAuth2 흐름이 구현될 때 더 정교해져야 합니다.
    // 현재는 성공 시나리오만 가정합니다.
    const mockEmail = 'social_user@example.com';
    const mockUser = { id: 'mock-google-user-id', email: mockEmail }; // 임시 사용자 객체

    logUserActivity({
      userId: mockUser.id,
      eventCategory: 'Authentication',
      eventAction: 'Google Login Success',
      isSuccess: true,
    });
    
    // 실패 시나리오 예시 (실제 구현 시 필요)
    // logUserActivity({
    //   userId: null,
    //   eventCategory: 'Authentication',
    //   eventAction: 'Google Login Fail',
    //   isSuccess: false,
    //   metadata: { error: "OAuth2 Provider Error" }
    // });

    toast.info(`Google 로그인은 추후 구현될 기능입니다.`);
    setAuthState(s => ({ ...s, step: '2fa', email: mockEmail }));
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
      logUserActivity({
        userId: user.id,
        eventCategory: 'Authentication',
        eventAction: 'Primary Login Success',
        isSuccess: true,
      });
      setAuthState(s => ({ ...s, step: '2fa', user }));
    } else {
      console.error("Signin failed:", error);
      incrementFailedLoginAttempts(authState.email); 
      logUserActivity({
        userId: authState.user?.id || null,
        eventCategory: 'Authentication',
        eventAction: 'Primary Login Fail',
        isSuccess: false,
        metadata: { email: authState.email, error: error?.message },
      });
      toast.error("로그인에 실패했습니다.", {
        description: "이메일과 비밀번호를 확인해주세요."
      });
    }
  };

  const handleSignup = async (data: { email: string; password: string; name: string; }) => {
    const { email, password, name } = data;
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
        toast.error("이미 가입된 이메일입니다. 로그인 화면으로 이동합니다.");
        const user = await getUserByEmail(email);
        setAuthState(s => ({ ...s, step: 'signin', email, user, view: 'welcome' }));
        return;
    }

    const { user, error } = await attemptSignup({ email, password, name });
    if (user) {
      logUserActivity({
        userId: user.id,
        eventCategory: 'Account',
        eventAction: 'Account Created',
        isSuccess: true,
      });
      toast.success("회원가입이 완료되었습니다.", {
        description: "로그인을 위해 2단계 인증을 진행합니다."
      });
      setAuthState(s => ({ ...s, step: '2fa', user }));
    } else {
      logUserActivity({
        userId: null,
        eventCategory: 'Account',
        eventAction: 'Account Creation Fail',
        isSuccess: false,
        metadata: { email: data.email, error: error?.message }
      });
      console.error("Signup failed:", error);
      toast.error(error?.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  const handle2FA = (code: string, isSuccess: boolean) => {
    if (isSuccess) {
      const isSkipped = code === 'skipped_2fa';
      logUserActivity({
          userId: authState.user?.id || null,
          eventCategory: 'Authentication',
          eventAction: isSkipped ? '2FA Skipped' : '2FA Success',
          isSuccess: true,
      });
      if (!isSkipped) {
          updateLastLogin(authState.email);
      }
      setAuthState(s => ({ ...s, step: 'success' }));
    } else {
      logUserActivity({
        userId: authState.user?.id || null,
        eventCategory: 'Authentication',
        eventAction: '2FA Fail',
        isSuccess: false,
        metadata: { code_attempted: code }
      });
    }
  };

  const handleContinueToDashboard = () => {
    setAuthState(s => ({ ...s, step: 'dashboard' }));
  };

  const handleLogout = () => {
    logUserActivity({
      userId: authState.user?.id || null,
      eventCategory: 'Authentication',
      eventAction: 'Logout',
      isSuccess: true,
    });
    setAuthState({
      step: 'welcome',
      email: '',
      user: null,
      isExpanded: false,
      view: 'welcome',
    });
    toast.info("성공적으로 로그아웃되었습니다.");
  };

  const handleEmailCheck = async (email: string) => {
    return await checkEmailExists(email);
  };

  const handleResetPassword = async (password: string) => {
    const { success, error } = await updateUserPassword(authState.email, password);
    if (success) {
      const user = await getUserByEmail(authState.email);
      logUserActivity({
        userId: user?.id || null,
        eventCategory: 'Account',
        eventAction: 'Password Reset Success',
        isSuccess: true,
      });
      toast.success('비밀번호가 성공적으로 변경되었습니다.');
      setAuthState(s => ({ ...s, step: 'signin' }));
    } else {
      logUserActivity({
        userId: authState.user?.id || null,
        eventCategory: 'Account',
        eventAction: 'Password Reset Fail',
        isSuccess: false,
        metadata: { email: authState.email, error: error?.message }
      });
      toast.error('비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  const handleCloseModal = () => {
    setSelectedNotice(null);
  };

  const renderStep = () => {
    switch (authState.step) {
      case 'welcome':
        return <EmailStep onNext={handleNextFromEmail} onGoogleSignin={handleSocialSignin} onSignupClick={handleShowSignup} />;
      case 'signin':
        return <SigninStep onBack={handleBack} onSignin={handleSignin} onForgotPassword={() => setAuthState(s => ({ ...s, step: 'findPassword' }))} user={authState.user} email={authState.email} />;
      case 'signup':
        return <SignupStep onBack={handleBack} onSignup={handleSignup} onSwitchToLogin={handleSwitchToLogin} email={authState.email} />;
      case '2fa':
        return <TwoFactorStep onBack={handleBack} onVerify={handle2FA} user={authState.user} />;
      case 'success':
        return <SuccessStep user={authState.user} onContinue={handleContinueToDashboard} />;
      case 'findPassword':
        return <FindPasswordStep onBack={handleBack} onPasswordChange={handleResetPassword} email={authState.email} setEmail={(email) => setAuthState(s => ({ ...s, email }))} />;
      case 'dashboard':
        return <Dashboard onLogout={handleLogout} />;
      default:
        return <EmailStep onNext={handleNextFromEmail} onGoogleSignin={handleSocialSignin} onSignupClick={handleShowSignup} />;
    }
  };

  const noticeListProps = {
    notices: notices.filter(n => !hiddenNoticeIds.includes(n.notice_id)),
    isLoading: isLoadingNotices,
    hiddenNoticeIds,
    hidingNoticeIds,
    readNoticeIds,
    canShowTooltip,
    onNoticeClick: handleNoticeClick,
    onHide: handleHideNotice,
    onTooltipHover: handleTooltipHover,
  };

  if (authState.step === 'dashboard') {
    return <Dashboard onLogout={handleLogout} />;
  }

  const showNoticesOnMobile = isMobile && authState.view === 'welcome' && authState.step !== '2fa' && authState.step !== 'success';

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
          ? <WelcomePanel isVisible={true} noticeListProps={noticeListProps} />
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
            <div>
              <div className="inline-flex items-center space-x-4 mb-8">
                <img src="/logo_symbol_color.png" alt="ITSCOPE PMO Logo" className="w-10 h-10" />
                <h1 className="text-xl font-bold text-white">ITSCOPE PMO</h1>
              </div>
              {showNoticesOnMobile && <NoticeList {...noticeListProps} />}
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-white">Sign Up</h1>
              <p className="text-zinc-400 mt-1">새로운 시작을 환영합니다!</p>
            </div>
          )}
        </div>
        
        {/* --- Auth Steps Wrapper --- */}
        <div className="flex-grow flex items-center justify-center lg:justify-start p-8 pt-4">
          <div className="w-full max-w-sm">
            {renderStep()}
          </div>
        </div>
        {authState.step !== 'success' && <HelpFloatingButton />}
      </div>
      
      {selectedNotice && (
        <NoticeDetailModal
          notice={selectedNotice}
          isOpen={!!selectedNotice}
          onClose={handleCloseModal}
          onHide={() => selectedNotice && handleHideNotice(selectedNotice.notice_id)}
        />
      )}
    </div>
  );
};

export default IndexPage;
