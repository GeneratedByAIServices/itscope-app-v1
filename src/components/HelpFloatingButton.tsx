import React, { useState } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { LifeBuoy, HelpCircle, Users, BookOpen, Globe } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from 'react-i18next';

const HelpFloatingButton = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [clickTimestamps, setClickTimestamps] = useState<number[]>([]);
  const { currentLanguage, toggleLanguage } = useLanguage();
  const { t } = useTranslation('common');

  const menuItems = [
    { name: t('menu_contact'), icon: <LifeBuoy className="w-5 h-5 mr-3" /> },
    { name: t('menu_faq'), icon: <HelpCircle className="w-5 h-5 mr-3" /> },
    { name: t('menu_community'), icon: <Users className="w-5 h-5 mr-3" /> },
    { name: t('menu_learning'), icon: <BookOpen className="w-5 h-5 mr-3" /> },
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
      
      toast.success(t('toast_cache_cleared_title'), {
        description: t('toast_cache_cleared_desc'),
        duration: 2000,
        onAutoClose: () => window.location.reload(),
      });

      setClickTimestamps([]);
    } else {
      toast.info(t('toast_community_soon'));
    }
  };

  const handleMenuClick = (menuName: string) => {
    if (menuName === t('menu_community')) {
      handleCommunityClick();
    } else {
      toast.info(t('toast_menu_soon', { menuName }));
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
                  <Label className={`text-xs transition-colors ${currentLanguage === 'ko' ? 'font-bold text-blue-500' : 'font-medium text-zinc-400'}`}>KOR</Label>
                  <Switch
                      id="language-toggle"
                      checked={currentLanguage === 'en'}
                      onCheckedChange={toggleLanguage}
                      aria-label="언어 변경"
                  />
                  <Label className={`text-xs transition-colors ${currentLanguage === 'en' ? 'font-bold text-blue-500' : 'font-medium text-zinc-400'}`}>ENG</Label>
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
        <span className="sr-only">{t('help')}</span>
      </Button>
    </div>
  );
};

export default HelpFloatingButton; 