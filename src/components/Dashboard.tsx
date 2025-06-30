import React from 'react';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { t } = useTranslation('main');

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-zinc-900">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold text-white">{t('title')}</h1>
        <p className="text-zinc-400">{t('description')}</p>
        <p className="text-sm text-yellow-400">{t('currentLanguage')}</p>
        <Button
          variant="outline"
          className="bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white"
          onClick={onLogout}
        >
          {t('logout')}
        </Button>
      </div>
    </main>
  );
};

export default Dashboard;
