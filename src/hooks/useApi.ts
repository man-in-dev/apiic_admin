"use client";

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specific hooks for different operations
export function usePreIncubationApplications() {
  const api = useApi();
  
  const fetchApplications = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    applicationStatus?: string;
    currentStage?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    return api.execute(() => apiClient.getPreIncubationApplications(params));
  }, []);

  const fetchApplication = useCallback(async (id: string) => {
    return api.execute(() => apiClient.getPreIncubationApplication(id));
  }, []);

  const createApplication = useCallback(async (data: any) => {
    return api.execute(() => apiClient.createPreIncubationApplication(data));
  }, []);

  const updateApplication = useCallback(async (id: string, data: any) => {
    return api.execute(() => apiClient.updatePreIncubationApplication(id, data));
  }, []);

  const deleteApplication = useCallback(async (id: string) => {
    return api.execute(() => apiClient.deletePreIncubationApplication(id));
  }, []);

  const fetchStats = useCallback(async () => {
    return api.execute(() => apiClient.getPreIncubationStats());
  }, []);

  return {
    ...api,
    fetchApplications,
    fetchApplication,
    createApplication,
    updateApplication,
    deleteApplication,
    fetchStats,
  };
}

export function useIncubationApplications() {
  const api = useApi();
  
  const fetchApplications = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    applicationStatus?: string;
    currentStage?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    return api.execute(() => apiClient.getIncubationApplications(params));
  }, []);

  const fetchApplication = useCallback(async (id: string) => {
    return api.execute(() => apiClient.getIncubationApplication(id));
  }, []);

  const createApplication = useCallback(async (data: any) => {
    return api.execute(() => apiClient.createIncubationApplication(data));
  }, []);

  const updateApplication = useCallback(async (id: string, data: any) => {
    return api.execute(() => apiClient.updateIncubationApplication(id, data));
  }, []);

  const deleteApplication = useCallback(async (id: string) => {
    return api.execute(() => apiClient.deleteIncubationApplication(id));
  }, []);

  const fetchStats = useCallback(async () => {
    return api.execute(() => apiClient.getIncubationStats());
  }, []);

  return {
    ...api,
    fetchApplications,
    fetchApplication,
    createApplication,
    updateApplication,
    deleteApplication,
    fetchStats,
  };
}

export function useContactSubmissions() {
  const api = useApi();
  
  const fetchContacts = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    source?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    return api.execute(() => apiClient.getContactSubmissions(params));
  }, []);

  const fetchContact = useCallback(async (id: string) => {
    return api.execute(() => apiClient.getContactSubmission(id));
  }, []);

  const createContact = useCallback(async (data: any) => {
    return api.execute(() => apiClient.createContactSubmission(data));
  }, []);

  const updateContact = useCallback(async (id: string, data: any) => {
    return api.execute(() => apiClient.updateContactSubmission(id, data));
  }, []);

  const deleteContact = useCallback(async (id: string) => {
    return api.execute(() => apiClient.deleteContactSubmission(id));
  }, []);

  const fetchStats = useCallback(async () => {
    return api.execute(() => apiClient.getContactStats());
  }, []);

  return {
    ...api,
    fetchContacts,
    fetchContact,
    createContact,
    updateContact,
    deleteContact,
    fetchStats,
  };
}

export function useAnnouncements() {
  const api = useApi();
  
  const fetchAnnouncements = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    return api.execute(() => apiClient.getAnnouncements(params));
  }, []);

  const fetchAnnouncement = useCallback(async (id: string) => {
    return api.execute(() => apiClient.getAnnouncement(id));
  }, []);

  const createAnnouncement = useCallback(async (data: any) => {
    return api.execute(() => apiClient.createAnnouncement(data));
  }, []);

  const updateAnnouncement = useCallback(async (id: string, data: any) => {
    return api.execute(() => apiClient.updateAnnouncement(id, data));
  }, []);

  const deleteAnnouncement = useCallback(async (id: string) => {
    return api.execute(() => apiClient.deleteAnnouncement(id));
  }, []);

  const fetchStats = useCallback(async () => {
    return api.execute(() => apiClient.getAnnouncementStats());
  }, []);

  return {
    ...api,
    fetchAnnouncements,
    fetchAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    fetchStats,
  };
}
