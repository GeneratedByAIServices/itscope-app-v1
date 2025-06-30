import React from 'react';
import { Button } from './ui/button';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-zinc-900">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400">Main application area.</p>
        <Button
          variant="outline"
          className="bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white"
          onClick={onLogout}
        >
          로그아웃
        </Button>
      </div>
    </main>
  );
};

export default Dashboard;
