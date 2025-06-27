export interface Notice {
  notice_id: number;
  title: string;
  content: string;
  author_id: string | null;
  notice_type: string;
  is_published: boolean;
  is_pinned: boolean;
  publish_start_dt: string | null;
  publish_end_dt: string | null;
  view_count: number;
  created_at: string;
  updated_at: string | null;
  event_start_dt: string | null;
  event_end_dt: string | null;
} 