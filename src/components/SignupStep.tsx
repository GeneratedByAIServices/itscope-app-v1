
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { validatePassword } from '../utils/authUtils';

interface SignupStepProps {
  email: string;
  onBack: () => void;
  onNext: () => void;
}

const SignupStep: React.FC<SignupStepProps> = ({ email, onBack, onNext }) => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 실시간 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

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
      // 가짜 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('회원가입 성공:', { email, ...formData });
      onNext();
    } catch (err) {
      setErrors({ general: '회원가입 중 오류가 발생했습니다' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.password);

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
          회원가입
        </h2>
        <p className="text-gray-600">
          {email}
        </p>
      </div>

      {/* 회원가입 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 이름 */}
        <div>
          <Input
            type="text"
            placeholder="이름"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="h-12"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div>
          <Input
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="h-12"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
          
          {/* 비밀번호 강도 표시 */}
          {formData.password && (
            <div className="mt-2 space-y-1">
              <div className="text-xs text-gray-600">비밀번호 조건:</div>
              <div className="space-y-1">
                {passwordValidation.errors.map((error, index) => (
                  <div key={index} className="text-xs text-red-500 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                    {error}
                  </div>
                ))}
                {passwordValidation.isValid && (
                  <div className="text-xs text-green-600 flex items-center">
                    <span className="w-1 h-1 bg-green-500 rounded-full mr-2" />
                    안전한 비밀번호입니다
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <Input
            type="password"
            placeholder="비밀번호 확인"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="h-12"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* 이용약관 동의 */}
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            />
            <label htmlFor="terms" className="text-sm text-gray-600 leading-5">
              이용약관 및 개인정보처리방침에 동의합니다
            </label>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-sm">{errors.terms}</p>
          )}
        </div>

        {errors.general && (
          <p className="text-red-500 text-sm text-center">{errors.general}</p>
        )}

        <Button
          type="submit"
          className="w-full h-12 bg-gray-900 hover:bg-gray-800"
          disabled={isLoading || !formData.name || !formData.password || !formData.confirmPassword || !acceptTerms}
        >
          {isLoading ? '가입 중...' : '회원가입'}
        </Button>
      </form>
    </div>
  );
};

export default SignupStep;
