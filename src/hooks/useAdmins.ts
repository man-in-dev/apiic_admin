import { useState, useCallback, useMemo } from 'react';
import { apiClient } from '@/lib/api';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: string;
  createdBy?: {
    name: string;
    email: string;
  };
  updatedBy?: {
    name: string;
    email: string;
  };
}

export interface UseAdminsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UseAdminsReturn {
  admins: AdminUser[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  fetchAdmins: (params?: UseAdminsParams) => Promise<void>;
  addAdmin: (data: {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'super_admin';
  }) => Promise<boolean>;
  updateAdminStatus: (id: string, isActive: boolean) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export const useAdmins = (initialParams: UseAdminsParams = {}): UseAdminsReturn => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const memoizedParams = useMemo(() => initialParams, [JSON.stringify(initialParams)]);

  const fetchAdmins = useCallback(async (params: UseAdminsParams = memoizedParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getAdmins(params);
      
      if (response.success && response.data) {
        // Normalize admin data to include id from _id
        const normalizedAdmins = response.data.admins.map((admin: any) => ({
          ...admin,
          id: admin._id || admin.id,
        }));
        
        setAdmins(normalizedAdmins);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Failed to fetch admin users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch admin users');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(memoizedParams)]);

  const addAdmin = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'super_admin';
  }) => {
    try {
      const response = await apiClient.addAdmin(data);
      
      if (response.success) {
        await fetchAdmins(); // Refresh the list
        return true;
      } else {
        setError(response.message || 'Failed to add admin user');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add admin user');
      return false;
    }
  }, [fetchAdmins]);

  const updateAdminStatus = useCallback(async (id: string, isActive: boolean) => {
    try {
      const response = await apiClient.updateAdminStatus(id, isActive);
      
      if (response.success) {
        // Update the local state
        setAdmins(prevAdmins => 
          prevAdmins.map(admin => 
            admin.id === id ? { ...admin, isActive } : admin
          )
        );
        return true;
      } else {
        setError(response.message || 'Failed to update admin status');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update admin status');
      return false;
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchAdmins();
  }, [fetchAdmins]);

  return {
    admins,
    loading,
    error,
    pagination,
    fetchAdmins,
    addAdmin,
    updateAdminStatus,
    refetch,
  };
};

export interface UseChangePasswordReturn {
  loading: boolean;
  error: string | null;
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<boolean>;
}

export const useChangePassword = (): UseChangePasswordReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = useCallback(async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.changePassword(data);
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to change password');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    changePassword,
  };
};
