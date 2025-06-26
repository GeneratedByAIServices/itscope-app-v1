
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Smartphone, MessageSquare } from 'lucide-react';
import { TwoFactorMethod } from '../types/auth';

interface TwoFactorStepProps {
  onBack: () => void;
  onNext: () => void;
}

const TwoFactorStep: React.FC<TwoFactorStepProps> = ({ onBack, onNext }) => {
  const [selectedMethod, setSelectedMethod] = useState<'totp' | 'sms'>('totp');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);

  const methods: TwoFactorMethod[] = [
    {
      type: 'totp',
      label: '인증 앱',
      description: 'Google Authenticator 또는 Authy 앱을 사용하세요'
    },
    {
      type: 'sms',
      label: 'SMS',
      description: '휴대폰으로 인증번호를 받으세요'
    }
  ];

  // 타이머 효과
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleMethodChange = (method: 'totp' | 'sms') => {
    setSelectedMethod(method);
    setCode('');
    setError('');
    
    if (method === 'sms') {
      // SMS 발송 시뮬레이션
      console.log('SMS 인증번호 발송: 123456');
      setTimeLeft(30);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setError('6자리 인증번호를 입력해주세요');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 가짜 API 호출
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // 데모용 인증번호 체크
      if (code === '123456') {
        console.log('2단계 인증 성공');
        onNext();
      } else {
        setError('인증번호가 올바르지 않습니다');
      }
    } catch (err) {
      setError('인증 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    console.log(`${selectedMethod} 인증번호 재발송`);
    setTimeLeft(30);
    setCode('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* 뒤로 가기 버튼 */}
      <Button
        onClick={onBack}
        variant="ghost"
        className="p-0 h-auto text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        뒤로
      </Button>

      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          2단계 인증
        </h2>
        <p className="text-gray-600">
          계정 보안을 위해 추가 인증을 진행합니다
        </p>
      </div>

      {/* 인증 방법 선택 */}
      <div className="space-y-3">
        {methods.map((method) => (
          <div
            key={method.type}
            className={`
              p-4 border rounded-lg cursor-pointer transition-all
              ${selectedMethod === method.type 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => handleMethodChange(method.type)}
          >
            <div className="flex items-center space-x-3">
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${selectedMethod === method.type 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
                }
              `}>
                {selectedMethod === method.type && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {method.type === 'totp' ? (
                  <Smartphone className="w-5 h-5 text-gray-600" />
                ) : (
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                )}
                <div>
                  <div className="font-medium text-gray-900">
                    {method.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {method.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 인증번호 입력 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="6자리 인증번호"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="h-12 text-center text-lg tracking-widest"
            disabled={isLoading}
            autoFocus
            maxLength={6}
          />
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gray-900 hover:bg-gray-800"
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? '인증 중...' : '인증하기'}
        </Button>
      </form>

      {/* 재발송 */}
      <div className="text-center">
        {timeLeft > 0 ? (
          <p className="text-sm text-gray-500">
            {timeLeft}초 후 재발송 가능
          </p>
        ) : (
          <Button
            onClick={handleResend}
            variant="link"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            인증번호 재발송
          </Button>
        )}
      </div>

      {/* 도움말 */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          데모용 인증번호: <code className="bg-gray-100 px-2 py-1 rounded text-xs">123456</code>
        </p>
      </div>
    </div>
  );
};

export default TwoFactorStep;
