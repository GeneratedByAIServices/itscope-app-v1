
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateEmail } from '../utils/authUtils';
import LegalModal from './LegalModal';

interface EmailStepProps {
  onNext: (email: string) => void;
  onGoogleSignin: () => void;
  onGithubSignin: () => void;
}

const EmailStep: React.FC<EmailStepProps> = ({ onNext, onGoogleSignin, onGithubSignin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError('올바른 이메일 주소를 입력해주세요');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onNext(email);
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-3">
          Welcome back
        </h2>
        <p className="text-slate-400 text-lg">
          Enter your email to get started
        </p>
      </div>

      {/* 이메일 입력 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email address
          </label>
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          />
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          disabled={isLoading || !email}
        >
          {isLoading ? 'Loading...' : 'Continue →'}
        </Button>
      </form>

      {/* 구분선 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-slate-800 text-slate-400">or continue with</span>
        </div>
      </div>

      {/* 소셜 로그인 버튼들 */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          onClick={onGoogleSignin}
          variant="outline"
          className="h-12 bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </Button>

        <Button
          onClick={onGithubSignin}
          variant="outline"
          className="h-12 bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </Button>

        <Button
          variant="outline"
          className="h-12 bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white"
        >
          <div className="w-5 h-5 bg-slate-500 rounded" />
        </Button>
      </div>

      {/* Demo Accounts */}
      <div className="bg-slate-700/50 rounded-lg p-4">
        <div className="text-sm text-slate-400 mb-2">Demo Accounts:</div>
        <div className="space-y-1 text-xs text-slate-500">
          <div>• demo@example.com (with 2FA)</div>
          <div>• user@test.com (no 2FA)</div>
          <div>• john@company.com (no 2FA)</div>
        </div>
      </div>

      {/* 이용약관 및 개인정보처리방침 */}
      <div className="text-center text-xs text-slate-500">
        계속 진행하면{' '}
        <button 
          onClick={() => setLegalModal('terms')}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          이용약관
        </button>
        {' '}및{' '}
        <button 
          onClick={() => setLegalModal('privacy')}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          개인정보처리방침
        </button>
        에 동의하는 것으로 간주됩니다.
      </div>

      {/* Legal Modal */}
      <LegalModal 
        type={legalModal} 
        onClose={() => setLegalModal(null)} 
      />
    </div>
  );
};

export default EmailStep;
