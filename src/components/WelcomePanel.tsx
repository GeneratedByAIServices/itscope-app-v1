import React, { useEffect, useState } from 'react';
import logoSymbolColor from '/logo_symbol_color.png';
import NoticeList, { NoticeListProps } from './NoticeList';

interface WelcomePanelProps {
  isVisible: boolean;
  noticeListProps: NoticeListProps;
}

const WelcomePanel: React.FC<WelcomePanelProps> = ({ isVisible, noticeListProps }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsAnimating(true), 300); // 패널 등장 후 애니메이션 시작
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible]);

  return (
    <div 
      className={`
        ${isVisible ? 'flex' : 'hidden'}
        h-full flex-col justify-center items-end p-8 lg:p-12
        bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
        transition-all duration-700 ease-in-out
        relative overflow-hidden
        hidden lg:flex
      `}
    >
      {/* 배경 그라데이션 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-50" />
      
      <div className="relative z-10 text-right max-w-lg">
        {/* 로고/브랜드 영역 */}
        <div className="mb-12">
          <div 
            className={`transition-all duration-500 ease-out ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '0ms' }}
          >
            <img src={logoSymbolColor} alt="ITSCOPE PMO Logo" className="w-20 h-20 ml-auto mb-6" />
          </div>
          <div
            className={`transition-all duration-500 ease-out ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '150ms' }}
          >
            <h1 className="text-3xl lg:text-3xl font-bold text-white mb-3">
              ITSCOPE PMO
            </h1>
          </div>
        </div>

        {/* Welcome 메시지 & 공지사항 */}
        <div 
          className={`space-y-3 transition-all duration-500 ease-out ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '300ms' }}
        >
          <h2 className="text-xl font-semibold text-white">
            Make Your Project Management Office<br/>
            More Intelligent, More Capable
          </h2>
          <div className="text-zinc-300 text-lg leading-relaxed mt-6">
            <NoticeList {...noticeListProps} />
          </div>
        </div>
      </div>

      {/* 장식적 요소 */}
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-indigo-900/50 to-transparent rounded-full filter blur-3xl opacity-50" />
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-sky-900/50 to-transparent rounded-full filter blur-3xl opacity-50" />
    </div>
  );
};

export default WelcomePanel;
