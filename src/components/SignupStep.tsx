import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { validatePassword, validateEmail } from '../utils/authUtils';
import LegalModal from './LegalModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SignupStepProps {
  email?: string;
  onBack: () => void;
  onNext: () => void;
}

const SignupStep: React.FC<SignupStepProps> = ({ email, onBack, onNext }) => {
  const [formData, setFormData] = useState({
    email: email || '',
    name: '',
    password: '',
    confirmPassword: ''
  });

  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [timer, setTimer] = useState(180);

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);

  useEffect(() => {
    if (!isVerificationSent || timer <= 0 || isEmailVerified) return;
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isVerificationSent, timer, isEmailVerified]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (field === 'email') {
      setIsEmailVerified(false);
      setIsVerificationSent(false);
    }
  };
  
  const handleSendVerification = () => {
    if (!validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: '올바른 이메일 주소를 입력해주세요' }));
      return;
    }
    setErrors(prev => ({ ...prev, email: '' }));
    setIsVerificationSent(true);
    setTimer(180);
    console.log('Cheat Code: 123456');
    console.log('Verification code sent to:', formData.email);
  };

  const handleVerifyCode = () => {
    if (verificationCode === '123456') {
      setIsEmailVerified(true);
      setErrors(prev => ({...prev, verification: ''}));
    } else {
      setErrors(prev => ({...prev, verification: '인증코드가 올바르지 않습니다.'}));
    }
  };


  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!isEmailVerified) {
      newErrors.verification = '이메일 인증을 완료해주세요.';
    }
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    if (!acceptTerms) {
      newErrors.terms = '이용약관에 동의해주세요';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('회원가입 성공:', formData);
      onNext();
    } catch (err) {
      setErrors({ general: '회원가입 중 오류가 발생했습니다' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.password);

  const isSignupDisabled =
    isLoading ||
    !isEmailVerified ||
    !formData.name.trim() ||
    !passwordValidation.isValid ||
    formData.password !== formData.confirmPassword ||
    !acceptTerms;

  return (
    <div className="w-full max-w-sm mx-auto lg:mx-0">
      <div className="space-y-6">
        <Button onClick={onBack} variant="ghost" className="p-0 h-auto text-zinc-400 hover:text-blue-400 hover:bg-zinc-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          로그인
        </Button>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <div className="relative w-full">
                <Input type="email" placeholder="이메일 주소" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="h-12 bg-zinc-800 border-zinc-700 text-white"/>
                {isEmailVerified && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />}
              </div>
              <Button type="button" className="h-12 shrink-0 bg-zinc-600 text-zinc-50 hover:bg-zinc-500" onClick={handleSendVerification} disabled={isEmailVerified || (isVerificationSent && timer > 0)}>
                {isVerificationSent ? '재전송' : '인증'}
              </Button>
            </div>
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            
            {isVerificationSent && !isEmailVerified && (
              <div className="flex space-x-2 pt-2">
                <div className="relative w-full">
                  <Input type="text" placeholder="인증 코드 6자리" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="h-12 bg-zinc-800 border-zinc-700 text-white" maxLength={6} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                </div>
                <Button type="button" onClick={handleVerifyCode} className="h-12 shrink-0" disabled={timer <= 0}>인증 확인</Button>
              </div>
            )}
            {errors.verification && <p className="text-red-400 text-sm">{errors.verification}</p>}
          </div>

          <div>
            <Input type="text" placeholder="이름" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="h-12 bg-zinc-800 border-zinc-700 text-white"/>
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <div className="relative">
              <Input type="password" placeholder="비밀번호" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className="h-12 bg-zinc-800 border-zinc-700 text-white"/>
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {formData.password.length > 0 && (
                  passwordValidation.isValid 
                    ? <Check className="w-5 h-5 text-green-400" />
                    : (
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle className="w-5 h-5 text-yellow-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-zinc-900 text-white border-zinc-800">
                            <ul className="list-disc pl-4">
                              {passwordValidation.errors.map((error, i) => <li key={i}>{error}</li>)}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                )}
              </div>
            </div>
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <div className="relative">
              <Input type="password" placeholder="비밀번호 확인" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} className="h-12 bg-zinc-800 border-zinc-700 text-white"/>
              {formData.password && formData.password !== "" && formData.password === formData.confirmPassword && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />}
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}/>
              <label htmlFor="terms" className="text-sm text-zinc-300 leading-5 text-left">
                <button type="button" onClick={() => setLegalModal('terms')} className="text-blue-400 hover:text-blue-300 underline">이용약관</button> 및 <button type="button" onClick={() => setLegalModal('privacy')} className="text-blue-400 hover:text-blue-300 underline">개인정보처리방침</button>에 동의합니다
              </label>
            </div>
            {errors.terms && <p className="text-red-400 text-sm">{errors.terms}</p>}
          </div>

          <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700" disabled={isSignupDisabled}>
            {isLoading ? '가입 중...' : '회원가입'}
          </Button>
        </form>

        <LegalModal type={legalModal} onClose={() => setLegalModal(null)}/>
      </div>
    </div>
  );
};

export default SignupStep;
