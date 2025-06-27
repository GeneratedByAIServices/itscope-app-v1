import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Notice } from '../types/notice';
import NoticeDetailModal from './NoticeDetailModal';

interface NoticeCardProps {
  notice: Notice;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    try {
      const readNotices: number[] = JSON.parse(localStorage.getItem('readNotices') || '[]');
      if (readNotices.includes(notice.notice_id)) {
        setIsRead(true);
      }
    } catch (error) {
      console.error("Failed to parse read notices from localStorage", error);
    }
  }, [notice.notice_id]);

  const getBadgeVariant = (type: string) => {
    switch(type) {
      case '점검':
      case '장애':
        return 'destructive';
      case '이벤트':
        return 'default';
      default:
        return 'secondary';
    }
  }

  const handleCardClick = () => {
    if (!isRead) {
      try {
        const readNotices: number[] = JSON.parse(localStorage.getItem('readNotices') || '[]');
        const updatedReadNotices = [...new Set([...readNotices, notice.notice_id])];
        localStorage.setItem('readNotices', JSON.stringify(updatedReadNotices));
        setIsRead(true);
      } catch (error) {
        console.error("Failed to update read notices in localStorage", error);
      }
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors p-3 rounded-lg mb-2 w-full text-left cursor-pointer"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 overflow-hidden">
            <p className={`text-sm truncate ${isRead ? 'text-zinc-400' : 'font-semibold text-zinc-100'}`}>{notice.title}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
              {notice.is_pinned && <div className="w-2 h-2 bg-yellow-400 rounded-full shrink-0" aria-label="Pinned" />}
              <Badge variant={getBadgeVariant(notice.notice_type)} className="text-xs px-1.5 py-0.5">
                {notice.notice_type}
              </Badge>
          </div>
        </div>
      </div>
      <NoticeDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        notice={notice} 
      />
    </>
  );
};

export default NoticeCard; 