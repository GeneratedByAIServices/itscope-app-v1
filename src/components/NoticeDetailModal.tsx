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

interface NoticeDetailModalProps {
  notice: Notice | null;
  isOpen: boolean;
  onClose: () => void;
}

const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({ notice, isOpen, onClose }) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-zinc-900 border-zinc-800 text-white p-6 rounded-lg">
        <DialogHeader className="border-b border-zinc-700 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant={getBadgeVariant(notice.notice_type)} className="text-sm px-2.5 py-1">
              {notice.notice_type}
            </Badge>
            <DialogTitle className="text-2xl font-bold text-zinc-100">{notice.title}</DialogTitle>
          </div>
          <div className="text-sm text-zinc-400 flex items-center gap-6">
            <span>
              <strong>게시일:</strong> {formatDate(notice.created_at)}
            </span>
            <span>
              <strong>조회수:</strong> {notice.view_count}
            </span>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[55vh] my-5 pr-3">
          <div
            className="prose prose-sm prose-invert max-w-none leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />
        </ScrollArea>

        <DialogFooter className="sm:justify-end border-t border-zinc-700 pt-4">
          <DialogClose asChild>
            <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white">
              확인
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoticeDetailModal; 