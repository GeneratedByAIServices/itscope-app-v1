import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PMUser } from "@/types/auth";
import { Check, ShieldCheck } from 'lucide-react';

interface SuccessStepProps {
  user: PMUser | null;
  onContinue: () => void;
}

const loadingLogs = [
  { id: 1, text: '사용자 프로필 로딩' },
  { id: 2, text: '권한 그룹 확인' },
  { id: 3, text: '보안 정책 적용' },
  { id: 4, text: '작업 공간 설정' },
  { id: 5, text: '대시보드 초기화' },
  { id: 6, text: '최종 설정 완료' },
];

const SuccessStep = ({ user, onContinue }: SuccessStepProps) => {
  const [logs, setLogs] = useState<{ id: number; text: string }[]>([]);
  const [progress, setProgress] = useState(0);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const totalDuration = 3000;
    const startTime = Date.now();

    // 로그를 순차적으로 표시
    const logInterval = totalDuration / loadingLogs.length;
    loadingLogs.forEach((log, index) => {
      setTimeout(() => {
        setLogs(prevLogs => [...prevLogs, log]);
      }, index * logInterval);
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
    };
  }, [onContinue]);

  return (
    <div className="w-full max-w-sm mx-auto lg:mx-0">
      <div className="space-y-6">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl font-bold text-white mb-1">
            인증 완료되었습니다
          </h2>
          <p className="text-zinc-400">
            환영합니다, {user?.name || user?.email}님!
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
