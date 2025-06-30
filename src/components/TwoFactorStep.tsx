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

interface TwoFactorStepProps {
  user: PMUser | null;
  onBack: () => void;
  onVerify: (code: string, isSuccess: boolean) => void;
}

const TwoFactorStep: React.FC<TwoFactorStepProps> = ({ user, onBack, onVerify }) => {
  const [code, setCode] = useState('');
  const [method, setMethod] = useState<'totp' | 'sms'>('totp');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError('6자리 인증 코드를 입력해주세요');
      return;
    }

    setIsLoading(true);
    setError('');

    const isValid = await verifyTwoFactorCode(code);
    onVerify(code, isValid);
    
    if (!isValid) {
      setError('인증 코드가 올바르지 않습니다.');
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
    toast.info('인증 코드가 재전송되었습니다.');
    
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
    ? `인증 코드 (남은 시간: ${formatTime(countdown)})` 
    : '6자리 인증 코드';

  const handleSkip = () => {
    toast.warning("2단계 인증을 건너뛰었습니다.", {
      description: "계정 보안을 위해 2단계 인증 설정을 권장합니다."
    });
    onVerify('skipped_2fa', true);
  };

  return (
    <div className="w-full max-w-sm mx-auto lg:mx-0">
      <div className="space-y-6">
        <Button onClick={onBack} variant="ghost" className="p-0 h-auto text-zinc-400 hover:text-blue-400 hover:bg-zinc-800" disabled={isLoading}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          다른 아이디로 로그인
        </Button>

        <div className="text-center lg:text-left">
          <h2 className="text-2xl font-bold text-white mb-2">2단계 인증</h2>
          {/* <p className="text-zinc-400">보안 강화를 위해 2단계 인증 코드를 입력하세요.</p> */}
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant={method === 'totp' ? 'default' : 'outline'}
              className={`h-12 ${method === 'totp' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}
              onClick={() => setMethod('totp')} disabled={isLoading}>
              앱 인증
            </Button>
            <Button type="button" variant={method === 'sms' ? 'default' : 'outline'}
              className={`h-12 ${method === 'sms' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}
              onClick={() => setMethod('sms')} disabled={isLoading}>
              SMS 인증
            </Button>
          </div>
          <p className="text-sm text-zinc-500 text-center lg:text-left">
            {method === 'totp'
              ? 'Google Authenticator 또는 Authy 앱에서 생성된 6자리 코드를 입력하세요'
              : `휴대폰(${user?.email})으로 전송된 6자리 인증 코드를 입력하세요`}
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
                {method === 'sms' ? 'SMS 재전송' : '새 코드 요청'}
              </Button>
            </div>
            {error && (<p className="text-red-400 text-sm mt-2">{error}</p>)}
          </div>
          <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading || code.length !== 6}>
            {isLoading ? (<Loader2 className="w-5 h-5 animate-spin" />) : ('인증 완료')}
          </Button>
        </form>

        <Accordion type="single" collapsible className="w-full pt-2">
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="text-sm text-zinc-400 hover:no-underline [&[data-state=open]]:text-white">
              인증에 문제가 있거나 건너뛰고 싶으신가요?
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <Alert variant="destructive" className="bg-red-900/20 border-red-500/30 text-red-300">
                  <AlertTriangle className="h-4 w-4 !text-red-400" />
                  <AlertTitle className="text-red-400 font-bold">경고: 보안 수준 저하</AlertTitle>
                  <AlertDescription>
                    2단계 미인증에 대해서는 별도의 로그로 기록되며, 일부 기능의 액세스에 제한을 받을 수 있습니다.
                    <br />
                    동의하실 경우, 아래의 건너뛰기 버튼을 눌러주세요.
                  </AlertDescription>
                </Alert>
                <Button
                  variant="outline"
                  className="w-full h-11 bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-red-900/50 hover:border-red-500/50 hover:text-red-300"
                  onClick={handleSkip}
                >
                  동의하고 건너뛰기
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
