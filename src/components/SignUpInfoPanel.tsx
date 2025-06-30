import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SignUpInfoPanelProps {
  isVisible: boolean;
}

const SignUpInfoPanel: React.FC<SignUpInfoPanelProps> = ({ isVisible }) => {
  const { t } = useTranslation('auth');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsAnimating(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible]);

  const featureItems = t('signUpFeatures', { returnObjects: true }) as { title: string; desc: string }[];

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
            {t('signUp')}
          </h1>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            {t('signUpNew')}
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
                <p className="text-white font-medium">{item.title}</p>
                <p className="text-zinc-400 mt-1 text-sm whitespace-pre-line">{item.desc}</p>
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