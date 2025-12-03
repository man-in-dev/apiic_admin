import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api';

export interface AdminProgram {
  id: string;
  title: string;
  duration?: string;
  bullets: string[];
  isActive?: boolean;
  link?: string;
}

interface UseProgramsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

export function usePrograms(params: UseProgramsParams = {}) {
  const [programs, setPrograms] = useState<AdminProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const key = useMemo(() => JSON.stringify(params ?? {}), [params]);

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.getPrograms(params);
      if (res.success) {
        const items = (res.data.programs || []).map((p: any) => ({
          id: p._id || p.id,
          title: p.title,
          duration: p.duration,
          bullets: p.bullets || [],
          isActive: p.isActive,
          link: p.link,
        }));
        setPrograms(items);
        setPagination(res.data.pagination || null);
      } else {
        setError(res.message || 'Failed to fetch programs');
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  }, [key]);

  const createProgram = useCallback(async (data: Omit<AdminProgram,'id'>) => {
    const payload = { title: data.title, duration: data.duration, bullets: data.bullets, isActive: data.isActive, link: data.link };
    const res = await apiClient.createProgram(payload);
    if (res.success) await fetchPrograms();
    return res;
  }, [fetchPrograms]);

  const updateProgram = useCallback(async (id: string, data: Partial<AdminProgram>) => {
    const payload: any = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.duration !== undefined) payload.duration = data.duration;
    if (data.bullets !== undefined) payload.bullets = data.bullets;
    if (data.isActive !== undefined) payload.isActive = data.isActive;
    if (data.link !== undefined) payload.link = data.link;
    const res = await apiClient.updateProgram(id, payload);
    if (res.success) await fetchPrograms();
    return res;
  }, [fetchPrograms]);

  const deleteProgram = useCallback(async (id: string) => {
    const res = await apiClient.deleteProgram(id);
    if (res.success) await fetchPrograms();
    return res;
  }, [fetchPrograms]);

  useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

  return { programs, loading, error, pagination, fetchPrograms, createProgram, updateProgram, deleteProgram };
}


