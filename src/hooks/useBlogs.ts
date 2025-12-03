import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api';

export interface AdminBlog {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  status: 'draft' | 'published';
  isActive?: boolean;
  publishedAt?: string;
  createdAt?: string;
  link?: string;
}

export function useBlogs(params: {
  page?: number; limit?: number; search?: string; status?: string; isActive?: boolean; sortBy?: string; sortOrder?: string;
} = {}) {
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const key = useMemo(() => JSON.stringify(params ?? {}), [params]);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.getBlogs(params);
      if (res.success) {
        const items = (res.data.blogs || []).map((b: any) => ({
          id: b._id || b.id,
          title: b.title,
          content: b.content,
          coverImage: b.coverImage,
          tags: b.tags,
          status: b.status,
          isActive: b.isActive,
          publishedAt: b.publishedAt,
          createdAt: b.createdAt,
          link: b.link,
        }));
        setBlogs(items);
        setPagination(res.data.pagination || null);
      } else {
        setError(res.message || 'Failed to fetch blogs');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  }, [key]);

  const createBlog = useCallback(async (data: Omit<AdminBlog,'id'>) => {
    const payload: any = { title: data.title, content: data.content, coverImage: data.coverImage, tags: data.tags, status: data.status, isActive: data.isActive, link: data.link };
    const res = await apiClient.createBlog(payload);
    if (res.success) await fetchBlogs();
    return res;
  }, [fetchBlogs]);

  const updateBlog = useCallback(async (id: string, data: Partial<AdminBlog>) => {
    const payload: any = {};
    ['title','content','coverImage','tags','status','isActive','link'].forEach((k) => {
      if ((data as any)[k] !== undefined) (payload as any)[k] = (data as any)[k];
    });
    const res = await apiClient.updateBlog(id, payload);
    if (res.success) await fetchBlogs();
    return res;
  }, [fetchBlogs]);

  const deleteBlog = useCallback(async (id: string) => {
    const res = await apiClient.deleteBlog(id);
    if (res.success) await fetchBlogs();
    return res;
  }, [fetchBlogs]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  return { blogs, loading, error, pagination, fetchBlogs, createBlog, updateBlog, deleteBlog };
}


