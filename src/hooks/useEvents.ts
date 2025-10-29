import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient } from '@/lib/api';
import { Event } from '@/types/events';

interface UseEventsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: string;
  startDate?: string;
  endDate?: string;
}

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  stats: any;
  refetch: () => Promise<void>;
  createEvent: (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Event | null>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<Event | null>;
  deleteEvent: (id: string) => Promise<boolean>;
  getEvent: (id: string) => Promise<Event | null>;
}

export function useEvents(params: UseEventsParams = {}): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  const paramsKey = useMemo(() => JSON.stringify(params ?? {}), [params]);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getEvents(params);
      
      if (response.success) {
        const normalized = (response.data.events || []).map((e: any) => ({
          ...e,
          id: e.id ?? e._id ?? e.id,
        }));
        setEvents(normalized);
        setPagination(response.data.pagination || null);
      } else {
        setError(response.message || 'Failed to fetch events');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [paramsKey]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await apiClient.getEventStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch event stats:', err);
    }
  }, []);

  const refetch = useCallback(async () => {
    await Promise.all([fetchEvents(), fetchStats()]);
  }, [fetchEvents, fetchStats]);

  const createEvent = useCallback(async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event | null> => {
    try {
      setError(null);
      const response = await apiClient.createEvent(eventData);
      
      if (response.success) {
        await refetch(); // Refresh the events list
        return response.data.event;
      } else {
        setError(response.message || 'Failed to create event');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [refetch]);

  const updateEvent = useCallback(async (id: string, eventData: Partial<Event>): Promise<Event | null> => {
    try {
      setError(null);
      const response = await apiClient.updateEvent(id, eventData);
      
      if (response.success) {
        await refetch(); // Refresh the events list
        return response.data.event;
      } else {
        setError(response.message || 'Failed to update event');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [refetch]);

  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await apiClient.deleteEvent(id);
      
      if (response.success) {
        await refetch(); // Refresh the events list
        return true;
      } else {
        setError(response.message || 'Failed to delete event');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [refetch]);

  const getEvent = useCallback(async (id: string): Promise<Event | null> => {
    try {
      setError(null);
      const response = await apiClient.getEvent(id);
      
      if (response.success) {
        return response.data.event;
      } else {
        setError(response.message || 'Failed to fetch event');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    events,
    loading,
    error,
    pagination,
    stats,
    refetch,
    createEvent,
    updateEvent,
    deleteEvent,
    getEvent,
  };
}
