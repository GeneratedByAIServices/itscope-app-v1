
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
        bg-gradient-to-br from-gray-900 via-gray-800 to-black
        hover:from-gray-800 hover:via-gray-700 hover:to-gray-900
        transition-all duration-700 ease-in-out
        relative overflow-hidden
      `}
    >
      {/* 배경 그라데이션 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-50" />
      
      <div className="relative z-10 text-center max-w-md">
        {/* 로고/브랜드 영역 */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
            ITSCOPE
          </h1>
          <div className="text-lg text-gray-300 font-light">
            PMO
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Welcome 메시지 */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">
            Welcome Back
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            프로젝트 관리의 새로운 경험을 시작하세요
          </p>
          <p className="text-gray-400 text-sm">
            효율적이고 직관적인 프로젝트 관리 솔루션
          </p>
        </div>

        {/* 특징 포인트 */}
        <div className="mt-12 space-y-3">
          <div className="flex items-center text-gray-300 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
            실시간 프로젝트 협업
          </div>
          <div className="flex items-center text-gray-300 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
            스마트한 일정 관리
          </div>
          <div className="flex items-center text-gray-300 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
            데이터 기반 의사결정
          </div>
        </div>
      </div>

      {/* 장식적 요소 */}
      <div className="absolute top-10 right-10 w-32 h-32 border border-gray-700 rounded-full opacity-20" />
      <div className="absolute bottom-10 left-10 w-20 h-20 border border-gray-600 rounded-full opacity-30" />
    </div>
  );
};

export default WelcomePanel;
