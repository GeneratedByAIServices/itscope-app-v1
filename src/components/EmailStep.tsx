import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useCallback } from 'react';
import { validateEmail, checkEmailExists } from '../utils/authUtils';
import { Loader2, Check } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { useTranslation } from 'react-i18next';

interface EmailStepProps {
  onNext: (email: string, isRegistered: boolean) => void;
  onGoogleSignin: () => void;
  onSignupClick: () => void;
}

const EmailStep: React.FC<EmailStepProps> = ({ onNext, onGoogleSignin, onSignupClick }) => {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [rememberEmail, setRememberEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const checkEmailRegistration = useCallback(
    async (emailToCheck: string) => {
      if (validateEmail(emailToCheck)) {
        setIsCheckingEmail(true);
        setIsRegistered(null);
        try {
          const exists = await checkEmailExists(emailToCheck);
          setIsRegistered(exists);
        } catch (err) {
          setError(t('errorEmailCheck'));
        } finally {
          setIsCheckingEmail(false);
        }
      } else {
        setIsRegistered(null);
      }
    },
    [t]
  );

  const debouncedCheck = useCallback(debounce(checkEmailRegistration, 500), [checkEmailRegistration]);

  useEffect(() => {
    if (email) {
      debouncedCheck(email);
    } else {
      setIsRegistered(null);
      setError('');
    }
  }, [email, debouncedCheck]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError(t('errorInvalidEmail'));
      return;
    }
    setIsLoading(true);
    
    // 이메일 체크가 진행 중이면 끝날 때까지 기다립니다.
    if (isCheckingEmail) {
      await new Promise(resolve => {
        const interval = setInterval(() => {
          if (!isCheckingEmail) {
            clearInterval(interval);
            resolve(null);
          }
        }, 100);
      });
    }

    if (rememberEmail) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    // 최종적으로 isRegistered 상태를 확인하고 onNext를 호출합니다.
    const finalIsRegistered = isRegistered ?? await checkEmailExists(email);

    setIsLoading(false);
    onNext(email, finalIsRegistered);
  };

  return (
    <div className="w-full max-w-sm mx-auto lg:mx-0">
      <div className="space-y-6">
        <div>
          <div className="space-y-3">
            <Button
              onClick={onGoogleSignin}
              variant="outline"
              className="w-full h-12 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-500/10 hover:border-zinc-500 hover:text-white"
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('googleSignIn')}
            </Button>
          </div>
        </div>

        <div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-zinc-900 px-2 text-zinc-400">{t('or')}</span>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t('emailPlaceholder')}
                required
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className={`h-12 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 pr-10 ${error ? 'border-red-500' : ''}`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {isCheckingEmail ? (
                  <Loader2 className="h-5 w-5 text-zinc-400 animate-spin" />
                ) : isRegistered === true ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : null}
              </div>
            </div>
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}

            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700" disabled={isLoading || isCheckingEmail}>
              {isLoading 
                ? t('buttonSubmitting') 
                : isRegistered === false 
                ? t('buttonSignUpWithEmail')
                : t('buttonContinue')}
            </Button>
          </form>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onSignupClick}
            className="font-semibold text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded text-sm"
          >
            {t('linkSignUpNew')}
          </button>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-email"
              checked={rememberEmail}
              onCheckedChange={(checked) => setRememberEmail(checked as boolean)}
            />
            <label htmlFor="remember-email" className="text-sm text-zinc-400">
              {t('rememberEmail')}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailStep;
