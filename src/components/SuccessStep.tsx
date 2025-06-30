import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PMUser } from "@/types/auth";
import { Check, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SuccessStepProps {
  user: PMUser | null;
  onContinue: () => void;
}

const SuccessStep = ({ user, onContinue }: SuccessStepProps) => {
  const { t } = useTranslation('auth');
  const [logs, setLogs] = useState<{ id: number; text: string }[]>([]);
  const [progress, setProgress] = useState(0);
  const animationFrameId = useRef<number>();
  const logTimerIds = useRef<NodeJS.Timeout[]>([]);

  const loadingLogs = [
    { id: 1, text: t('loadingLogs.profile') },
    { id: 2, text: t('loadingLogs.permission') },
    { id: 3, text: t('loadingLogs.security') },
    { id: 4, text: t('loadingLogs.workspace') },
    { id: 5, text: t('loadingLogs.dashboard') },
    { id: 6, text: t('loadingLogs.final') },
  ];

  useEffect(() => {
    const totalDuration = 3000;
    const startTime = Date.now();

    // 로그를 순차적으로 표시
    const logInterval = totalDuration / loadingLogs.length;
    loadingLogs.forEach((log, index) => {
      const timerId = setTimeout(() => {
        setLogs(prevLogs => {
          // StrictMode에서 중복 추가 방지
          if (prevLogs.some(p => p.id === log.id)) return prevLogs;
          return [...prevLogs, log]
        });
      }, index * logInterval);
      logTimerIds.current.push(timerId);
    });
    
    // 프로그레스 바 애니메이션
    const animateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      const currentProgress = Math.min((elapsedTime / totalDuration) * 100, 100);
      setProgress(currentProgress);
      if (elapsedTime < totalDuration) {
        animationFrameId.current = requestAnimationFrame(animateProgress);
      }
    };
    animationFrameId.current = requestAnimationFrame(animateProgress);

    // 리디렉션 타이머
    const redirectTimer = setTimeout(() => {
      onContinue();
    }, totalDuration + 500); // 로그가 다 표시되고 0.5초 후 이동

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      clearTimeout(redirectTimer);
      logTimerIds.current.forEach(clearTimeout);
      logTimerIds.current = [];
    };
  }, [onContinue, t]);

  return (
    <div className="w-full max-w-sm mx-auto lg:mx-0">
      <div className="space-y-6">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl font-bold text-white mb-1">
            {t('authComplete')}
          </h2>
          <p className="text-zinc-400">
            {t('welcome', { name: user?.name || user?.email })}
          </p>
        </div>

        <div className="space-y-2 h-48 bg-zinc-900/50 rounded-lg p-4 font-noto text-xs text-zinc-400 overflow-y-auto">
          <AnimatePresence>
            {logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                {index === logs.length - 1 ? (
                  <ShieldCheck className="w-4 h-4 mr-3 text-green-500 shrink-0" />
                ) : (
                  <Check className="w-4 h-4 mr-3 text-blue-500 shrink-0" />
                )}
                <span>{log.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-blue-600 h-2"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessStep;
