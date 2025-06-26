
import React from 'react';

interface WelcomePanelProps {
  isVisible: boolean;
}

const WelcomePanel: React.FC<WelcomePanelProps> = ({ isVisible }) => {
  return (
    <div 
      className={`
        ${isVisible ? 'flex' : 'hidden'}
        flex-col justify-center items-center p-8 lg:p-12
        bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
        hover:from-slate-800 hover:via-slate-700 hover:to-slate-800
        transition-all duration-700 ease-in-out
        relative overflow-hidden
        hidden lg:flex
      `}
    >
      {/* 배경 그라데이션 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-50" />
      
      <div className="relative z-10 text-center max-w-lg">
        {/* 로고/브랜드 영역 */}
        <div className="mb-12">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-3">
            ITSCOPE
          </h1>
          <div className="text-xl text-slate-300 font-light">
            PMO
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Welcome 메시지 */}
        <div className="space-y-6">
          <h2 className="text-4xl font-semibold text-white">
            Welcome to ModernAuth
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Experience seamless authentication with our modern, secure, and user-friendly platform.
          </p>
        </div>

        {/* 특징 포인트 */}
        <div className="mt-16 space-y-6">
          <div className="flex items-start text-slate-300">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
            </div>
            <div className="text-left">
              <div className="font-medium text-white mb-1">Secure & Reliable</div>
              <div className="text-sm text-slate-400">Enterprise-grade security with 2FA support</div>
            </div>
          </div>
          
          <div className="flex items-start text-slate-300">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
            </div>
            <div className="text-left">
              <div className="font-medium text-white mb-1">Lightning Fast</div>
              <div className="text-sm text-slate-400">Quick authentication with social logins</div>
            </div>
          </div>
          
          <div className="flex items-start text-slate-300">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <div className="text-left">
              <div className="font-medium text-white mb-1">User Friendly</div>
              <div className="text-sm text-slate-400">Intuitive design that users love</div>
            </div>
          </div>
        </div>
      </div>

      {/* 장식적 요소 */}
      <div className="absolute top-16 right-16 w-40 h-40 border border-slate-700 rounded-full opacity-10" />
      <div className="absolute bottom-16 left-16 w-24 h-24 border border-slate-600 rounded-full opacity-20" />
    </div>
  );
};

export default WelcomePanel;
