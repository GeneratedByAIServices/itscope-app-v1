import React, { useEffect, useState } from 'react';

interface SignUpInfoPanelProps {
  isVisible: boolean;
}

const SignUpInfoPanel: React.FC<SignUpInfoPanelProps> = ({ isVisible }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsAnimating(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible]);

  const featureItems = [
    { 
      text: '효과적인 프로젝트 업무 파악', 
      subText: '프로젝트 상태, 진척, 공수, 산출물 등을 한눈에 파악하고 관리할 수 있습니다.', 
      color: 'bg-blue-500' 
    },
    { 
      text: 'PMO를 위한 가시적인 프로젝트 모니터링', 
      subText: '프로젝트 현황과 이슈를 실시간으로 모니터링하고 신속한 의사결정을 지원합니다.', 
      color: 'bg-purple-500' 
    },
    { 
      text: '업무 표준 기반의 체계적인 SDLC 관리', 
      subText: '표준화된 개발 생명주기를 통해 일관성 있는 프로젝트 관리가 가능합니다.', 
      color: 'bg-green-500' 
    },
    { 
      text: '사용자 친화적 업무함 및 커뮤니케이션', 
      subText: '직관적인 인터페이스로 업무 처리와 팀원 간 소통이 더욱 원활해집니다.', 
      color: 'bg-yellow-500' 
    },
  ];

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
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-teal-600/5 opacity-50" />
      
      <div className="relative z-10 text-right max-w-lg">
        <div className="mb-12">
          <h1 className="text-3xl lg:text-3xl font-bold text-white mb-3">
            Sign Up
          </h1>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            새로운 시작을 환영합니다!
          </h2>
          {/* <p className="text-zinc-300 text-lg leading-relaxed">
            ITSCOPE PMO와 함께 프로젝트 관리를 혁신하세요.
          </p> */}
        </div>

        <div className="mt-8 space-y-6 hidden md:block ml-auto w-fit">
          {featureItems.map((item, index) => (
            <div 
              key={index}
              className={`
                flex items-start text-zinc-300 text-right justify-end
                transition-all duration-500 ease-out
                ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{ transitionDelay: `${index * 500}ms` }}
            >
              <div>
                <p className="text-white font-medium">{item.text}</p>
                <p className="text-zinc-400 mt-1 text-sm">{item.subText}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 장식적 요소 */}
      <div className="absolute top-16 right-16 w-40 h-40 border border-zinc-800 rounded-full opacity-10" />
      <div className="absolute bottom-16 left-16 w-24 h-24 border border-zinc-700 rounded-full opacity-20" />
    </div>
  );
};

export default SignUpInfoPanel; 