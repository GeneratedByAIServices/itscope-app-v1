import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { PMUser } from '@/types/auth';

interface SigninStepProps {
  email: string;
  user: PMUser | null;
  onBack: () => void;
  onSignin: (password: string) => Promise<void>;
  onForgotPassword: () => void;
}

const SigninStep: React.FC<SigninStepProps> = ({ email, user, onBack, onSignin, onForgotPassword }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || isLoading) return;

    setIsLoading(true);
    setError('');
    try {
      await onSignin(password);
    } catch (e) {
      setError('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const maskName = (name: string | null): string => {
    if (!name) return '사용자';
    if (name.length <= 2) {
      return `${name.charAt(0)}*`;
    }
    const middle = '*'.repeat(name.length - 2);
    return `${name.charAt(0)}${middle}${name.charAt(name.length - 1)}`;
  };

  return (
    <div className="w-full max-w-sm mx-auto lg:mx-0">
      <div className="space-y-6">
        <Button onClick={onBack} variant="ghost" className="p-0 h-auto text-zinc-400 hover:text-blue-400 hover:bg-zinc-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          다른 계정으로 로그인
        </Button>
        <div className="space-y-2 text-center lg:text-left">
          <h2 className="text-2xl font-bold text-white">
            {maskName(user?.name)}님, 안녕하세요!
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              readOnly
              className="h-12 bg-zinc-700/50 border-zinc-700 text-gray-400 cursor-not-allowed"
              autoComplete="username"
            />
            <Input
              ref={inputRef}
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-zinc-800 border-zinc-700 text-white"
              autoComplete="current-password"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
          <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700" disabled={!password || isLoading}>
            {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            계속
          </Button>
        </form>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember-me" className="border-zinc-600" />
            <label htmlFor="remember-me" className="text-sm text-zinc-300">
              로그인 상태 유지
            </label>
          </div>
          <Button onClick={onForgotPassword} variant="link" className="text-sm text-blue-400 hover:text-blue-300">
            비밀번호를 잊으셨나요?
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SigninStep;
