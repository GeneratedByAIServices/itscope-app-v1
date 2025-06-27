import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface TwoFactorStepProps {
  email: string;
  onBack: () => void;
  onNext: () => void;
}

const TwoFactorStep: React.FC<TwoFactorStepProps> = ({ email, onBack, onNext }) => {
  const [code, setCode] = useState('');
  const [method, setMethod] = useState<'totp' | 'sms'>('totp');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || code.length !== 6) {
      setError('6자리 인증 코드를 입력해주세요');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 가짜 2차 인증 검증
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('2차 인증 시도:', { email, code, method });
      if (code === '123456') {
        console.log('2차 인증 성공, 대시보드로 이동');
        onNext();
      } else {
        setError('인증 코드가 올바르지 않습니다');
      }
    } catch (err) {
      setError('인증 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    console.log('인증 코드 재전송:', { email, method });
    toast.info('인증 코드가 재전송되었습니다.');
  };

  return (
    <div className="w-full max-w-sm mx-auto lg:mx-0">
      <div className="space-y-6">
        {/* 뒤로 가기 버튼 */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="p-0 h-auto text-zinc-400 hover:text-blue-400 hover:bg-zinc-800"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          다른 아이디로 로그인
        </Button>

        {/* 헤더 */}
        <div className="text-center lg:text-left">
          <h2 className="text-2xl font-bold text-white mb-2">
            2단계 인증
          </h2>
          <p className="text-zinc-400">
            보안 강화를 위해 2단계 인증 코드를 입력하세요.
          </p>
        </div>

        {/* 인증 방법 선택 */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={method === 'totp' ? 'default' : 'outline'}
              className={`h-12 ${method === 'totp' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }`}
              onClick={() => setMethod('totp')}
              disabled={isLoading}
            >
              앱 인증
            </Button>
            <Button
              type="button"
              variant={method === 'sms' ? 'default' : 'outline'}
              className={`h-12 ${method === 'sms' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }`}
              onClick={() => setMethod('sms')}
              disabled={isLoading}
            >
              SMS 인증
            </Button>
          </div>

          <p className="text-sm text-zinc-500 text-center lg:text-left">
            {method === 'totp' 
              ? 'Google Authenticator 또는 Authy 앱에서 생성된 6자리 코드를 입력하세요'
              : '휴대폰으로 전송된 6자리 인증 코드를 입력하세요'
            }
          </p>
        </div>

        {/* 인증 코드 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="6자리 인증 코드"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="h-12 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500 pr-24"
              disabled={isLoading}
              autoFocus
              maxLength={6}
            />
            <Button
              type="button"
              variant="link"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300 disabled:text-zinc-500 disabled:cursor-not-allowed"
              onClick={handleResendCode}
              disabled={isLoading}
            >
              {method === 'sms' ? 'SMS 재전송' : '새 코드 요청'}
            </Button>
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              '인증 완료'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorStep;
