import { useState, useCallback, useMemo } from 'react';
import { apiClient } from '@/lib/api';

export interface Mentor {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  company: string;
  expertise: string[];
  bio: string;
  profileImage?: string;
  linkedinProfile?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    name: string;
    email: string;
  };
  updatedBy?: {
    name: string;
    email: string;
  };
}

export interface UseMentorsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface UseMentorsReturn {
  mentors: Mentor[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  fetchMentors: (params?: UseMentorsParams) => Promise<void>;
  createMentor: (data: {
    name: string;
    email: string;
    phone: string;
    designation: string;
    company: string;
    expertise: string[];
    bio: string;
    profileImage?: string;
    linkedinProfile?: string;
  }) => Promise<boolean>;
  updateMentor: (id: string, data: Partial<Mentor>) => Promise<boolean>;
  deleteMentor: (id: string) => Promise<boolean>;
  updateMentorStatus: (id: string, isActive: boolean) => Promise<boolean>;
  getMentor: (id: string) => Promise<Mentor | null>;
  refetch: () => Promise<void>;
}

export const useMentors = (initialParams: UseMentorsParams = {}): UseMentorsReturn => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const memoizedParams = useMemo(() => initialParams, [JSON.stringify(initialParams)]);

  const fetchMentors = useCallback(async (params: UseMentorsParams = memoizedParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getMentors(params);
      
      if (response.success && response.data) {
        // Normalize mentor data to include id from _id
        const normalizedMentors = response.data.mentors.map((mentor: any) => ({
          ...mentor,
          id: mentor._id || mentor.id,
        }));
        
        setMentors(normalizedMentors);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Failed to fetch mentors');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch mentors');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(memoizedParams)]);

  const createMentor = useCallback(async (data: {
    name: string;
    email: string;
    phone: string;
    designation: string;
    company: string;
    expertise: string[];
    bio: string;
    profileImage?: string;
    linkedinProfile?: string;
  }) => {
    try {
      const response = await apiClient.createMentor(data);
      
      if (response.success) {
        await fetchMentors(); // Refresh the list
        return true;
      } else {
        setError(response.message || 'Failed to create mentor');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create mentor');
      return false;
    }
  }, [fetchMentors]);

  const updateMentor = useCallback(async (id: string, data: Partial<Mentor>) => {
    try {
      const response = await apiClient.updateMentor(id, data);
      
      if (response.success) {
        await fetchMentors(); // Refresh the list
        return true;
      } else {
        setError(response.message || 'Failed to update mentor');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update mentor');
      return false;
    }
  }, [fetchMentors]);

  const deleteMentor = useCallback(async (id: string) => {
    try {
      const response = await apiClient.deleteMentor(id);
      
      if (response.success) {
        await fetchMentors(); // Refresh the list
        return true;
      } else {
        setError(response.message || 'Failed to delete mentor');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete mentor');
      return false;
    }
  }, [fetchMentors]);

  const updateMentorStatus = useCallback(async (id: string, isActive: boolean) => {
    try {
      const response = await apiClient.updateMentorStatus(id, isActive);
      
      if (response.success) {
        // Update the local state
        setMentors(prevMentors => 
          prevMentors.map(mentor => 
            mentor.id === id ? { ...mentor, isActive } : mentor
          )
        );
        return true;
      } else {
        setError(response.message || 'Failed to update mentor status');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update mentor status');
      return false;
    }
  }, []);

  const getMentor = useCallback(async (id: string) => {
    try {
      const response = await apiClient.getMentor(id);
      
      if (response.success && response.data) {
        return {
          ...response.data,
          id: response.data._id || response.data.id,
        };
      } else {
        setError(response.message || 'Failed to fetch mentor');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch mentor');
      return null;
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchMentors();
  }, [fetchMentors]);

  return {
    mentors,
    loading,
    error,
    pagination,
    fetchMentors,
    createMentor,
    updateMentor,
    deleteMentor,
    updateMentorStatus,
    getMentor,
    refetch,
  };
};
