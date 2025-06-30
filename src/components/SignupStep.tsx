import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Check, AlertCircle, Loader2 } from 'lucide-react';
import { validatePassword, validateEmail, checkEmailExists } from '../utils/authUtils';
import LegalModal from './LegalModal';
import { toast } from "sonner"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTranslation, Trans } from 'react-i18next';
import { i18n as i18nInstance } from 'i18next';

interface SignupStepProps {
  email: string;
  onBack: () => void;
  onSignup: (data: { email: string; password: string; name: string; }) => Promise<void>;
  onSwitchToLogin: (email: string) => void;
}

const SignupStep: React.FC<SignupStepProps> = ({ email, onBack, onSignup, onSwitchToLogin }) => {
    const { t, i18n } = useTranslation('auth');
    const [formData, setFormData] = useState({
        email: email || '',
        name: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    
    // 이메일 인증을 위한 상태
    const [isVerificationSent, setIsVerificationSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [timer, setTimer] = useState(180);

    const [acceptTerms, setAcceptTerms] = useState(false);
    const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);

    const verificationCodeInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isVerificationSent || timer <= 0 || isEmailVerified) return;
        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [isVerificationSent, timer, isEmailVerified]);

    useEffect(() => {
        if (isVerificationSent && !isEmailVerified) {
            verificationCodeInputRef.current?.focus();
        }
    }, [isVerificationSent, isEmailVerified]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        if (field === 'email') {
            setIsEmailVerified(false);
            setIsVerificationSent(false);
            setTimer(180);
        }
    };

    const handleVerificationRequest = async () => {
        console.log(`[SignupStep] '인증 요청' 클릭됨. 이메일 존재 여부 확인 시작: ${formData.email}`);
        if (!validateEmail(formData.email)) {
            setErrors(prev => ({...prev, email: t('emailInvalid')}));
            return;
        }
        
        setIsLoading(true);
        const emailExists = await checkEmailExists(formData.email);
        console.log(`[SignupStep] 이메일(${formData.email}) 존재 확인 결과: ${emailExists}`);
        
        if (emailExists) {
            let toastId: string | number | undefined;
            toastId = toast.info(t('emailAlreadyExists'), {
                description: (
                    <div className="w-full">
                        <p className="mb-2">{t('confirmLogin')}</p>
                        <Button
                            className="w-full"
                            size="sm"
                            onClick={() => {
                                onSwitchToLogin(formData.email);
                                if (toastId) toast.dismiss(toastId);
                            }}
                        >
                            {t('yesLogin')}
                        </Button>
                    </div>
                ),
                duration: 10000,
            });
        } else {
            // 이 부분은 UI 복원을 위해 이전 로직을 따라갑니다.
            toast.success(t('verificationCodeSentToast'));
            setIsVerificationSent(true);
            setTimer(180);
            console.log('Mock Verification Code: 123456');
        }
        setIsLoading(false);
    };

    const handleVerifyCode = () => {
        // 실제 인증 로직 대신 UI 확인을 위한 Mock 로직
        if (verificationCode === '123456') {
            toast.success(t('emailVerified'));
            setIsEmailVerified(true);
            setErrors(prev => ({...prev, verification: ''}));
        } else {
            const errorMsg = t('verificationCodeInvalid');
            toast.error(errorMsg);
            setErrors(prev => ({...prev, verification: errorMsg}));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isEmailVerified) {
            setErrors(prev => ({...prev, general: t('completeEmailVerification')}));
            return;
        }
        if (!acceptTerms) {
            setErrors(prev => ({...prev, terms: t('agreeToTerms')}));
            return;
        }

        setIsLoading(true);
        try {
            await onSignup({
                email: formData.email,
                password: formData.password,
                name: formData.name,
            });
        } catch (error) {
            setErrors(prev => ({...prev, general: t('errorSignUp')}));
        }
        setIsLoading(false);
    };

    const passwordValidation = validatePassword(formData.password, t);
    const isSignupDisabled = isLoading || !isEmailVerified || !formData.name || !passwordValidation.isValid || formData.password !== formData.confirmPassword || !acceptTerms;

    return (
        <div className="w-full max-w-sm mx-auto lg:mx-0">
          <div className="space-y-6">
            <Button onClick={onBack} variant="ghost" className="p-0 h-auto text-zinc-400 hover:text-blue-400 hover:bg-zinc-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToLoginShort')}
            </Button>
    
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <div className="relative w-full">
                    <Input 
                        id="email"
                        name="email"
                        type="email" 
                        placeholder={t('companyEmailPlaceholder')} 
                        value={formData.email} 
                        onChange={(e) => handleInputChange('email', e.target.value)} 
                        className="h-12 bg-zinc-800 border-zinc-700 text-white" 
                        disabled={isEmailVerified || isVerificationSent}
                        autoComplete="username"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleVerificationRequest();
                            }
                        }}
                    />
                     {isEmailVerified ? (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                     ) : (
                        <Button type="button" onClick={handleVerificationRequest} disabled={isLoading || (isVerificationSent && timer > 0)} className="absolute right-2 top-1/2 -translate-y-1/2 h-9 shrink-0">
                            {isLoading ? t('verifying') : (isVerificationSent ? t('resend') : t('requestVerification'))}
                        </Button>
                     )}
                  </div>
                </div>
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
                
                {isVerificationSent && !isEmailVerified && (
                  <div className="flex space-x-2 pt-2">
                    <div className="relative w-full">
                      <Input 
                        ref={verificationCodeInputRef}
                        type="text" 
                        placeholder={t('verificationCodePlaceholder')} 
                        value={verificationCode} 
                        onChange={(e) => setVerificationCode(e.target.value)} 
                        className="h-12 bg-zinc-800 border-zinc-700 text-white" 
                        maxLength={6}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleVerifyCode();
                            }
                        }}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <Button type="button" onClick={handleVerifyCode} className="h-12 shrink-0" disabled={timer <= 0}>{t('verifyButton')}</Button>
                  </div>
                )}
                {errors.verification && <p className="text-red-400 text-sm">{errors.verification}</p>}
              </div>
    
              <div>
                <Input 
                    id="name"
                    name="name"
                    type="text" 
                    placeholder={t('namePlaceholder')} 
                    value={formData.name} 
                    onChange={(e) => handleInputChange('name', e.target.value)} 
                    className="h-12 bg-zinc-800 border-zinc-700 text-white" 
                    disabled={!isEmailVerified}/>
                 {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>
    
              <div>
                <div className="relative">
                    <Input 
                        id="password"
                        name="password"
                        type="password" 
                        placeholder={t('passwordPlaceholder')} 
                        value={formData.password} 
                        onChange={(e) => handleInputChange('password', e.target.value)} 
                        className="h-12 bg-zinc-800 border-zinc-700 text-white" 
                        autoComplete="new-password" 
                        disabled={!isEmailVerified}/>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {formData.password.length > 0 && (
                      passwordValidation.isValid ? 
                      <Check className="w-5 h-5 text-green-400" /> :
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle className="w-5 h-5 text-red-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            {passwordValidation.errors.map((err, i) => <p key={i}>{err}</p>)}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </div>
    
              <div>
                <div className="relative">
                    <Input 
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password" 
                        placeholder={t('confirmPasswordPlaceholder')} 
                        value={formData.confirmPassword} 
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)} 
                        className="h-12 bg-zinc-800 border-zinc-700 text-white" 
                        autoComplete="new-password" 
                        disabled={!isEmailVerified}/>
                  {formData.password && formData.password !== "" && formData.password === formData.confirmPassword && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />}
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
    
              <div className="space-y-2 pt-2">
                <div className="flex items-start space-x-2">
                    <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(checked as boolean)} disabled={!isEmailVerified}/>
                    <div className="text-sm text-zinc-300 leading-5 text-left">
                      <Trans
                        i18nKey="agreeToTermsFull"
                        ns="auth"
                        components={{
                          terms: <button type="button" onClick={() => setLegalModal('terms')} className="text-blue-400 hover:text-blue-300 underline" />,
                          privacy: <button type="button" onClick={() => setLegalModal('privacy')} className="text-blue-400 hover:text-blue-300 underline" />
                        }}
                      />
                    </div>
                </div>
                {errors.terms && <p className="text-red-400 text-sm">{errors.terms}</p>}
              </div>
    
              <div className="mt-6">
                <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700" disabled={isSignupDisabled}>
                  {isLoading ? <Loader2 className="animate-spin" /> : t('signUp')}
                </Button>
              </div>
              {errors.general && <p className="text-red-400 text-sm mt-2 text-center">{errors.general}</p>}
            </form>
    
           <LegalModal type={legalModal} onClose={() => setLegalModal(null)} i18n={i18n} />
          </div>
        </div>
    );
};

export default SignupStep;

