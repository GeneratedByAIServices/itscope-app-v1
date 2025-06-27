import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { User } from '@/types/auth';

interface SigninStepProps {
  email: string;
  user: User | null;
  onBack: () => void;
  onNext: () => void;
  onForgotPassword: () => void;
}

const SigninStep: React.FC<SigninStepProps> = ({ email, user, onBack, onNext, onForgotPassword }) => {
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const maskName = (name: string | undefined): string => {
    if (!name) return '';
    if (name.length <= 2) {
      return `${name.charAt(0)}*`;
    }
    const middle = '*'.repeat(name.length - 2);
    return `${name.charAt(0)}${middle}${name.charAt(name.length - 1)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('비밀번호를 입력해주세요');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('로그인 시도:', { email, password, rememberMe });
      if (password === 'password123') {
        console.log('로그인 성공, 2차 인증으로 진행');
        onNext();
      } else {
        setError('비밀번호가 올바르지 않습니다');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto lg:mx-0">
      <div className="space-y-6">
        {/* 뒤로 가기 버튼 */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="p-0 h-auto text-zinc-400 hover:text-blue-400 hover:bg-zinc-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          다른 계정으로 로그인
        </Button>

        {/* 헤더 */}
        <div className="text-center lg:text-left">
          {/* <h2 className="text-2xl font-bold text-white mb-2">
            비밀번호 입력
          </h2> */}
          <p className="text-lg font-bold text-white">
            {email}
          </p>
          {user && (
            <p className="text-sm text-zinc-400 mt-1">
              {maskName(user.name)}
            </p>
          )}
        </div>

        {/* 비밀번호 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* 기억하기 & 비밀번호 찾기 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label htmlFor="remember" className="text-sm text-zinc-400">
                로그인 상태 유지
              </label>
            </div>
            
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-sm text-blue-400 hover:text-blue-300"
              onClick={onForgotPassword}
            >
              비밀번호 찾기
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading || !password}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SigninStep;
