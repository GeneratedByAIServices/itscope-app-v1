import React, { useState, useEffect } from 'react';
import { getNotices } from '../utils/authUtils';
import NoticeCard from './NoticeCard';
import { Notice } from '../types/notice';
import { Skeleton } from './ui/skeleton';

const NoticeList: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAndFilterNotices = async () => {
            setIsLoading(true);
            const { success, data } = await getNotices();
            if (success && data) {
                const now = new Date();
                const publishedNotices = data.filter(n => {
                    if (!n.is_published) return false;
                    const startDate = n.publish_start_dt ? new Date(n.publish_start_dt) : null;
                    const endDate = n.publish_end_dt ? new Date(n.publish_end_dt) : null;
                    const isAfterStartDate = !startDate || now >= startDate;
                    const isBeforeEndDate = !endDate || now <= endDate;
                    return isAfterStartDate && isBeforeEndDate;
                });
                
                publishedNotices.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
                setNotices(publishedNotices);
            }
            setIsLoading(false);
        };
        fetchAndFilterNotices();
    }, []);

    if (isLoading) {
        return (
            <div className="mt-8 w-full max-w-sm space-y-2">
                <Skeleton className="h-12 w-full bg-zinc-800/50" />
                <Skeleton className="h-12 w-full bg-zinc-800/50" />
                <Skeleton className="h-12 w-full bg-zinc-800/50" />
            </div>
        )
    }

    if (notices.length === 0) {
        return null;
    }

    return (
        <div className="mt-8 w-full max-w-sm">
            {notices.map(notice => (
                <NoticeCard key={notice.notice_id} notice={notice} />
            ))}
        </div>
    );
};

export default NoticeList; 