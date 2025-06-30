import React, { useState } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { LifeBuoy, HelpCircle, Users, BookOpen, Globe } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

const HelpFloatingButton = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [clickTimestamps, setClickTimestamps] = useState<number[]>([]);
  const [isKorean, setIsKorean] = useState(true);

  const menuItems = [
    { name: '고객센터 문의', icon: <LifeBuoy className="w-5 h-5 mr-3" /> },
    { name: '자주 묻는 질문', icon: <HelpCircle className="w-5 h-5 mr-3" /> },
    { name: '커뮤니티', icon: <Users className="w-5 h-5 mr-3" /> },
    { name: '학습센터', icon: <BookOpen className="w-5 h-5 mr-3" /> },
  ];

  const handleCommunityClick = () => {
    const now = Date.now();
    const recentTimestamps = clickTimestamps.filter(ts => now - ts < 1000);
    const newTimestamps = [...recentTimestamps, now];
    
    setClickTimestamps(newTimestamps);

    if (newTimestamps.length >= 3) {
      localStorage.removeItem('hidden_notices');
      localStorage.removeItem('read_notices');
      localStorage.removeItem('notice_hide_tooltip_shown_count');
      
      toast.success("캐시가 초기화되었습니다.", {
        description: "페이지를 새로고침합니다.",
        duration: 2000,
        onAutoClose: () => window.location.reload(),
      });

      setClickTimestamps([]);
    } else {
      toast.info("커뮤니티 기능은 현재 준비중입니다.");
    }
  };

  const handleMenuClick = (menuName: string) => {
    if (menuName === '커뮤니티') {
      handleCommunityClick();
    } else {
      toast.info(`'${menuName}' 기능은 현재 준비중입니다.`);
    }
  };

  const containerVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { y: { stiffness: 1000, velocity: -100 } }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: { y: { stiffness: 1000 } }
    }
  };

  return (
    <div
      className="fixed bottom-8 left-8 z-50 font-noto"
      onMouseEnter={isMobile ? undefined : () => setIsOpen(true)}
      onMouseLeave={isMobile ? undefined : () => setIsOpen(false)}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial="closed"
            animate="open"
            exit="closed"
            variants={containerVariants}
            className="mb-4 space-y-2"
          >
            <motion.li variants={itemVariants} className="w-48 h-12 rounded-lg bg-slate-800/80 backdrop-blur-sm border border-zinc-700 shadow-md px-4 flex items-center justify-start gap-4">
              <Label htmlFor="language-toggle" className="text-white font-normal cursor-pointer flex items-center">
                <Globe className="w-5 h-5" />
              </Label>
              <div className="flex items-center gap-2">
                  <Label className={`text-xs transition-colors ${isKorean ? 'font-bold text-blue-500' : 'font-medium text-zinc-400'}`}>KOR</Label>
                  <Switch
                      id="language-toggle"
                      checked={!isKorean}
                      onCheckedChange={() => setIsKorean(!isKorean)}
                      aria-label="언어 변경"
                  />
                  <Label className={`text-xs transition-colors ${!isKorean ? 'font-bold text-blue-500' : 'font-medium text-zinc-400'}`}>ENG</Label>
              </div>
            </motion.li>
            {menuItems.map((item, index) => (
              <motion.li key={index} variants={itemVariants}>
                <Button
                  variant="outline"
                  className="w-48 justify-start h-12 rounded-lg bg-zinc-900/80 backdrop-blur-sm border-zinc-700 text-white hover:bg-zinc-800 hover:text-white shadow-md font-normal"
                  onClick={() => handleMenuClick(item.name)}
                >
                  {item.icon}
                  {item.name}
                </Button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <Button 
        variant="outline"
        size="icon"
        className="h-14 w-14 rounded-full bg-zinc-900/80 backdrop-blur-sm border-zinc-700 text-white hover:bg-zinc-800 hover:text-white shadow-lg flex items-center justify-center"
        onClick={isMobile ? () => setIsOpen(!isOpen) : undefined}
      >
        <img src="/logo_symbol_color.png" alt="Help" className="h-6 w-6" />
        <span className="sr-only">도움말</span>
      </Button>
    </div>
  );
};

export default HelpFloatingButton; 