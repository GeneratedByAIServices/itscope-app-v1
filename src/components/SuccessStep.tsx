import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { PMUser } from "@/types/auth";

interface SuccessStepProps {
  user: PMUser | null;
  onContinue: () => void;
}

const SuccessStep = ({ user, onContinue }: SuccessStepProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          로그인 성공!
        </h2>
        <p className="text-gray-600">
          환영합니다, {user?.name || user?.email}
        </p>
        <p className="text-sm text-gray-500">
          잠시 후 메인 화면으로 이동합니다...
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div 
          className="bg-green-600 h-2 rounded-full animate-[progress_3s_ease-out_forwards]"
          style={{
            animationName: 'progress',
            animationDuration: '3s',
            animationTimingFunction: 'ease-out',
            animationFillMode: 'forwards',
          }}
        />
      </div>
      <style>
        {`
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}
      </style>
      <Button
        onClick={onContinue}
        className="bg-gray-900 hover:bg-gray-800"
      >
        바로 시작하기
      </Button>
    </div>
  );
};

export default SuccessStep;
