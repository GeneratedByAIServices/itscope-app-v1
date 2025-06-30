import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { Notice } from '../types/notice';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface NoticeCardProps {
  notice: Notice;
  onNoticeClick: (notice: Notice) => void;
  onHide: (noticeId: number) => void;
  isRead: boolean;
  isHiding: boolean;
  canShowTooltip: boolean;
  onTooltipHover: () => void;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ 
  notice, 
  onNoticeClick, 
  onHide, 
  isRead,
  isHiding,
  canShowTooltip, 
  onTooltipHover 
}) => {
  
  const getBadgeVariant = (noticeType: string | null): "default" | "destructive" | "secondary" => {
    switch (noticeType) {
      case '점검':
      case '장애':
        return 'destructive';
      case '업데이트':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const handleHideClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onHide(notice.notice_id);
  };

  const HideButton = (
    <Button
      variant="ghost"
      size="icon"
      className="w-8 h-8 rounded-full text-zinc-500 hover:bg-zinc-700 hover:text-white shrink-0"
      onClick={handleHideClick}
      aria-label="공지 숨기기"
    >
      <Check className="w-4 h-4" />
    </Button>
  );

  return (
    <div
      onClick={() => onNoticeClick(notice)}
      className={cn(
        "group bg-zinc-800/50 hover:bg-zinc-700/50 p-3 pl-4 rounded-lg mb-2 w-full text-left cursor-pointer flex items-center justify-between gap-3",
        "transition-all duration-500 ease-in-out",
        isHiding ? "transform translate-x-full opacity-0" : "transform translate-x-0 opacity-100"
      )}
    >
      {/* 좌측 영역: 뱃지 + 제목 */}
      <div className="flex items-center gap-3 overflow-hidden">
        <Badge variant={getBadgeVariant(notice.notice_type)} className="text-xs px-1.5 py-0.5 shrink-0">
          {notice.notice_type || '일반'}
        </Badge>
        <p className={`text-sm truncate text-zinc-300 group-hover:text-white ${!isRead ? 'font-bold' : ''}`}>
          {notice.title}
        </p>
        {!isRead && (
          <div className="w-2 h-2 bg-green-400 rounded-full shrink-0"></div>
        )}
      </div>

      {/* 우측 영역: 숨김 버튼 (툴팁 포함) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        {isRead && (
          <>
            {canShowTooltip ? (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild onPointerEnter={onTooltipHover}>
                    {HideButton}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>보관처리</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              HideButton
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NoticeCard; 