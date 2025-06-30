import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Notice } from '../types/notice';
import { Calendar, Eye, Archive } from 'lucide-react';

interface NoticeDetailModalProps {
  notice: Notice | null;
  isOpen: boolean;
  onClose: () => void;
  onHide: () => void;
}

const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({ notice, isOpen, onClose, onHide }) => {
  if (!notice) return null;

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case '점검':
      case '장애':
        return 'destructive';
      case '이벤트':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "(하루)";
    }
    return `(${diffDays}일)`;
  };
  
  const handleArchive = () => {
    onHide();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-11/12 sm:max-w-2xl bg-zinc-900 border-zinc-800 text-white p-6 rounded-lg">
        <DialogHeader className="border-b border-zinc-700 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant={getBadgeVariant(notice.notice_type)} className="text-sm px-2.5 py-1">
              {notice.notice_type}
            </Badge>
            <DialogTitle className="text-2xl font-bold text-zinc-100">{notice.title}</DialogTitle>
          </div>
          <div className="text-sm text-zinc-400 space-y-2">
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-6">
                <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <strong>게시일:</strong> {formatDate(notice.created_at)}
                </span>
                <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <strong>조회수:</strong> {notice.view_count}
                </span>
            </div>
            {notice.publish_start_dt && notice.publish_end_dt && (
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <strong>게시 기간:</strong> 
                    <span>{formatDate(notice.publish_start_dt)} ~ {formatDate(notice.publish_end_dt)}</span>
                </div>
            )}
            {notice.event_start_dt && notice.event_end_dt && (
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <strong>이벤트/점검 기간:</strong> 
                    <span>
                        {formatDate(notice.event_start_dt)} ~ {formatDate(notice.event_end_dt)}
                        <span className="ml-2 text-amber-400">{calculateDuration(notice.event_start_dt, notice.event_end_dt)}</span>
                    </span>
                </div>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[55vh] my-5 pr-3">
          <div
            className="prose prose-sm prose-invert max-w-none leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />
        </ScrollArea>

        <DialogFooter className="flex-col-reverse space-y-2 space-y-reverse sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0 border-t border-zinc-700 pt-4">
            <Button type="button" variant="outline" onClick={handleArchive} className="w-full sm:w-auto bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white">
                <Archive className="w-4 h-4 mr-2" />
                보관
            </Button>
            <DialogClose asChild>
                <Button type="button" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                확인
                </Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoticeDetailModal; 