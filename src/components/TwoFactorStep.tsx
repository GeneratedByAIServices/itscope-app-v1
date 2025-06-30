import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { verifyTwoFactorCode } from '@/utils/authUtils';
import { PMUser } from '@/types/auth';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from 'react-i18next';

interface TwoFactorStepProps {
  user: PMUser | null;
  onBack: () => void;
  onVerify: (code: string, isSuccess: boolean) => void;
}

const TwoFactorStep: React.FC<TwoFactorStepProps> = ({ user, onBack, onVerify }) => {
  const { t } = useTranslation('auth');
  const [code, setCode] = useState('');
  const [method, setMethod] = useState<'totp' | 'sms'>('totp');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError(t('errorInvalid2FACode'));
      return;
    }

    setIsLoading(true);
    setError('');

    const isValid = await verifyTwoFactorCode(code);
    onVerify(code, isValid);
    
    if (!isValid) {
      setError(t('error2FACodeMismatch'));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleResendCode = () => {
    // 기존 타이머가 있다면 초기화
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setCode(''); // 텍스트 필드 비우기
    toast.info(t('resend2FACodeToast'));
    
    setCountdown(180); // 3분 = 180초
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if(timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const placeholderText = countdown > 0 
    ? t('2faPlaceholderCountdown', { time: formatTime(countdown) })
    : t('2faPlaceholder');

  const handleSkip = () => {
    toast.warning(t('skip2FAWarningTitle'), {
      description: t('skip2FAWarningDesc')
    });
    onVerify('skipped_2fa', true);
  };

  return (
    <div className="w-full max-w-sm mx-auto lg:mx-0">
      <div className="space-y-6">
        <Button onClick={onBack} variant="ghost" className="p-0 h-auto text-zinc-400 hover:text-blue-400 hover:bg-zinc-800" disabled={isLoading}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToLogin')}
        </Button>

        <div className="text-center lg:text-left">
          <h2 className="text-2xl font-bold text-white mb-2">{t('twoFactorAuth')}</h2>
          {/* <p className="text-zinc-400">보안 강화를 위해 2단계 인증 코드를 입력하세요.</p> */}
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant={method === 'totp' ? 'default' : 'outline'}
              className={`h-12 ${method === 'totp' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}
              onClick={() => setMethod('totp')} disabled={isLoading}>
              {t('appVerification')}
            </Button>
            <Button type="button" variant={method === 'sms' ? 'default' : 'outline'}
              className={`h-12 ${method === 'sms' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}
              onClick={() => setMethod('sms')} disabled={isLoading}>
              {t('smsVerification')}
            </Button>
          </div>
          <p className="text-sm text-zinc-500 text-center lg:text-left">
            {method === 'totp'
              ? t('totpGuide')
              : t('smsGuide', { contact: user?.email })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input type="text" placeholder={placeholderText} value={code}
                onChange={(e) => setCode(e.target.value.replace(/\\D/g, '').slice(0, 6))}
                className="h-12 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500 pr-24"
                disabled={isLoading} autoFocus maxLength={6}/>
              <Button type="button" variant="link"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300 disabled:text-zinc-500 disabled:cursor-not-allowed px-2"
                onClick={handleResendCode} disabled={isLoading}>
                {method === 'sms' ? t('resendSms') : t('requestNewCode')}
              </Button>
            </div>
            {error && (<p className="text-red-400 text-sm mt-2">{error}</p>)}
          </div>
          <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading || code.length !== 6}>
            {isLoading ? (<Loader2 className="w-5 h-5 animate-spin" />) : (t('verifyComplete'))}
          </Button>
        </form>

        <Accordion type="single" collapsible className="w-full pt-2">
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="text-sm text-zinc-400 hover:no-underline [&[data-state=open]]:text-white">
              {t('2faHelpTitle')}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <Alert variant="destructive" className="bg-red-900/20 border-red-500/30 text-red-300">
                  <AlertTriangle className="h-4 w-4 !text-red-400" />
                  <AlertTitle className="text-red-400 font-bold">{t('warning2FASkipTitle')}</AlertTitle>
                  <AlertDescription>
                    {t('warning2FASkipDesc').split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                  </AlertDescription>
                </Alert>
                <Button
                  variant="outline"
                  className="w-full h-11 bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-red-900/50 hover:border-red-500/50 hover:text-red-300"
                  onClick={handleSkip}
                >
                  {t('agreeAndSkip')}
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default TwoFactorStep;
