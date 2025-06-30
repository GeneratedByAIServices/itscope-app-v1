import { TooltipProvider } from './ui/tooltip';
import { Notice } from '../types/notice';
import NoticeCard from './NoticeCard';

export interface NoticeListProps {
  notices: Notice[];
  isLoading: boolean;
  hiddenNoticeIds: number[];
  hidingNoticeIds: number[];
  readNoticeIds: number[];
  canShowTooltip: boolean;
  onNoticeClick: (notice: Notice) => void;
  onHide: (noticeId: number) => void;
  onTooltipHover: () => void;
}

const NoticeList: React.FC<NoticeListProps> = ({
  notices,
  isLoading,
  hiddenNoticeIds,
  hidingNoticeIds,
  readNoticeIds,
  canShowTooltip,
  onNoticeClick,
  onHide,
  onTooltipHover,
}) => {
  const visibleNotices = notices.filter(n => !hiddenNoticeIds.includes(n.notice_id));

  if (isLoading || visibleNotices.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 w-full max-w-sm mx-auto">
      <TooltipProvider delayDuration={100}>
        {visibleNotices.map(notice => (
          <NoticeCard
            key={notice.notice_id}
            notice={notice}
            onNoticeClick={onNoticeClick}
            onHide={onHide}
            isRead={readNoticeIds.includes(notice.notice_id)}
            isHiding={hidingNoticeIds.includes(notice.notice_id)}
            canShowTooltip={canShowTooltip}
            onTooltipHover={onTooltipHover}
          />
        ))}
      </TooltipProvider>
    </div>
  );
};

export default NoticeList; 