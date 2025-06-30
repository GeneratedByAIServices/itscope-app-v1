import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Loader2, Check, AlertCircle } from 'lucide-react';
import { toast } from "sonner"
import { validatePassword } from '../utils/authUtils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTranslation } from 'react-i18next';

interface FindPasswordStepProps {
  onBack: () => void;
  email: string;
  setEmail: (email: string) => void;
  onPasswordChange: (password: string) => void;
}

const FindPasswordStep: React.FC<FindPasswordStepProps> = ({ onBack, email, setEmail, onPasswordChange }) => {
  const { t } = useTranslation('auth');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [timer, setTimer] = useState(180);

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const newPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isVerificationSent || timer <= 0 || isEmailVerified) return;
    const interval = setInterval(() => {
        setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isVerificationSent, timer, isEmailVerified]);

  useEffect(() => {
    if (isEmailVerified) {
      setTimeout(() => newPasswordRef.current?.focus(), 100);
    }
  }, [isEmailVerified]);

  const handleVerificationRequest = () => {
    if (!email.trim()) {
        setErrors(prev => ({...prev, email: t('errorEmailRequired')}));
        return;
    }
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
        toast.success(t('verificationCodeSentToast'));
        setIsVerificationSent(true);
        setTimer(180);
        setIsLoading(false);
        setErrors({});
    }, 1000);
  };

  const handleVerifyCode = () => {
    if (verificationCode === '123456') {
        toast.success(t('emailVerified'), {
          description: t('emailVerifiedDesc')
        });
        setIsEmailVerified(true);
        setErrors({});
    } else {
        setErrors(prev => ({...prev, verification: t('verificationCodeInvalid')}));
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
        setErrors(prev => ({...prev, confirmPassword: t('errorPasswordMismatch')}));
        return;
    }
    if (!validatePassword(newPassword, t).isValid) {
        setErrors(prev => ({...prev, password: t('errorPasswordFormat')}));
        return;
    }
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
        onPasswordChange(newPassword);
        setIsLoading(false);
    }, 1000);
  };
  
  const passwordValidation = validatePassword(newPassword, t);
  const isChangeDisabled = isLoading || !isEmailVerified || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword || !passwordValidation.isValid;

  return (
    <div className="w-full max-w-sm mx-auto lg:mx-0">
      <div className="space-y-6">
        <Button onClick={onBack} variant="ghost" className="p-0 h-auto text-zinc-400 hover:text-blue-400 hover:bg-zinc-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToLoginShort')}
        </Button>
        
        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-3xl font-bold text-white">{t('newPasswordTitle')}</h1>
          <p className="text-zinc-400">
            {isEmailVerified ? t('newPasswordDesc') : t('checkEmailForCode')}
          </p>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
                <div className="flex space-x-2">
                    <div className="relative w-full">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={t('companyEmailPlaceholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 bg-zinc-800 border-zinc-700 text-white"
                            disabled={isEmailVerified || isVerificationSent}
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
                                {isLoading ? t('verifying') : (isVerificationSent ? t('resend') : t('sendCode'))}
                            </Button>
                        )}
                    </div>
                </div>
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

                {isVerificationSent && !isEmailVerified && (
                  <div className="flex space-x-2 pt-2">
                    <div className="relative w-full">
                      <Input 
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

            {isEmailVerified && (
                <>
                    <div>
                        <div className="relative">
                            <Input
                                ref={newPasswordRef}
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                placeholder={t('newPasswordPlaceholder')}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="h-12 bg-zinc-800 border-zinc-700 text-white"
                                autoComplete="new-password"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {newPassword.length > 0 && (
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
                        {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <div className="relative">
                            <Input
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                type="password"
                                placeholder={t('confirmNewPasswordPlaceholder')}
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="h-12 bg-zinc-800 border-zinc-700 text-white"
                                autoComplete="new-password"
                            />
                            {newPassword && newPassword !== "" && newPassword === confirmNewPassword && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />}
                        </div>
                        {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>
                    
                    <div className="mt-6">
                        <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700" disabled={isChangeDisabled}>
                            {isLoading ? <Loader2 className="animate-spin" /> : t('changeToNewPassword')}
                        </Button>
                    </div>
                </>
            )}
        </form>
      </div>
    </div>
  );
};

export default FindPasswordStep; 