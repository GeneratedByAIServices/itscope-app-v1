
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface TwoFactorStepProps {
  onBack: () => void;
  onNext: () => void;
}

const TwoFactorStep: React.FC<TwoFactorStepProps> = ({ onBack, onNext }) => {
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
      
      if (code === '123456') {
        console.log('2차 인증 성공');
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
    console.log('인증 코드 재전송');
    alert('인증 코드가 재전송되었습니다. (데모)');
  };

  return (
    <div className="space-y-6">
      {/* 뒤로 가기 버튼 */}
      <Button
        onClick={onBack}
        variant="ghost"
        className="p-0 h-auto text-slate-400 hover:text-white"
        disabled={isLoading}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        뒤로
      </Button>

      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          2차 인증
        </h2>
        <p className="text-slate-400">
          보안을 위해 추가 인증이 필요합니다
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
              : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
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
              : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
            }`}
            onClick={() => setMethod('sms')}
            disabled={isLoading}
          >
            SMS 인증
          </Button>
        </div>

        <p className="text-sm text-slate-500 text-center">
          {method === 'totp' 
            ? 'Google Authenticator 또는 Authy 앱에서 생성된 6자리 코드를 입력하세요'
            : '휴대폰으로 전송된 6자리 인증 코드를 입력하세요'
          }
        </p>
      </div>

      {/* 인증 코드 입력 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="6자리 인증 코드"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="h-12 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 text-center text-lg tracking-widest"
            disabled={isLoading}
            autoFocus
            maxLength={6}
          />
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-blue-600 hover:bg-blue-700"
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              메인 화면으로 이동 중...
            </>
          ) : (
            '인증 완료'
          )}
        </Button>
      </form>

      {/* 재전송 버튼 */}
      <div className="text-center">
        <Button
          type="button"
          variant="link"
          className="text-sm text-blue-400 hover:text-blue-300"
          onClick={handleResendCode}
          disabled={isLoading}
        >
          {method === 'sms' ? 'SMS 재전송' : '새 코드 요청'}
        </Button>
      </div>

      {/* 도움말 */}
      <div className="text-center">
        <p className="text-sm text-slate-500">
          데모용 인증 코드: <code className="bg-slate-700 px-2 py-1 rounded text-xs">123456</code>
        </p>
      </div>
    </div>
  );
};

export default TwoFactorStep;
