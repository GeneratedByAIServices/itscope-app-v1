import React, { useState } from 'react';
import { Button } from './ui/button';
import { useIsMobile } from '../hooks/use-mobile';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { LifeBuoy, HelpCircle, Users, BookOpen } from 'lucide-react';

const HelpFloatingButton = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: '고객센터 문의', icon: <LifeBuoy className="w-5 h-5 mr-3" /> },
    { name: '자주 묻는 질문', icon: <HelpCircle className="w-5 h-5 mr-3" /> },
    { name: '커뮤니티', icon: <Users className="w-5 h-5 mr-3" /> },
    { name: '학습센터', icon: <BookOpen className="w-5 h-5 mr-3" /> },
  ];
  
  const handleMenuClick = (menuName: string) => {
    toast.info(`${menuName} 메뉴를 선택했습니다.`);
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
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
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